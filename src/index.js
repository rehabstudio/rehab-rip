module.exports = class Rip {
    /**
     * Sets up default values for class options and validates / uses any user
     * values that have been supplied.
     *
     * @param {Object} options
     */
    constructor(options = {}) {
        /**
         * The frequency in which image elements should be tested.
         *
         * @type {Number}
         */
        if (this.isValidProperty(options, 'scanInterval', 'number')) {
            this.scanInterval = options.scanInterval;
        } else {
            this.scanInterval = 150;
        }

        /**
         * The amount of time that can pass before the interval doing the
         * scanning gets forcibly cleared.
         *
         * @type {Number}
         */
        if (this.isValidProperty(options, 'scanTimeout', 'number')) {
            this.scanTimeout = options.scanTimeout;
        } else {
            this.scanTimeout = 6000;
        }

        /**
         * A valid CSS selector to select image elements needing preloaded.
         *
         * @type {String}
         */
        if (this.isValidProperty(options, 'imageSelector', 'string')) {
            this.imageSelector = options.imageSelector;
        } else {
            this.imageSelector = '.js-rip-preload';
        }

        /**
         * A CSS selector applied after an image element finishes preloading.
         *
         * @type {String}
         */
        if (this.isValidProperty(options, 'imageLoadedSelector', 'string')) {
            this.imageLoadedSelector = options.imageLoadedSelector;
        } else {
            this.imageLoadedSelector = 'rip--loaded';
        }

        /**
         * Logic to run whenever an image has been successfully preloaded.
         *
         * @type {Function}
         */
        if (this.isValidProperty(options, 'onLoad', 'function')) {
            this.onLoadCallback = options.onLoad;
        } else {
            this.onLoadCallback = this.onImageLoad;
        }

        /**
         * An array of image DOM elements still requiring preloading.
         *
         * @type {Array}
         */
        this.imageElements = null;

        /**
         * Interval ID for the `currentSrc` looping logic.
         *
         * @type {Number}
         */
        this.checkInterval = null;
    }

    /**
     * Selects the elements requiring preloading from the DOM then starts an
     * interval loop for scanning to see if their `currentSrc` is set.
     */
    triggerPreloading() {
        let startTimestamp = Date.now();

        this.imageElements = [].slice.call(document.querySelectorAll(this.imageSelector));

        this.checkInterval = window.setInterval(() => {
            let timestampDifference = Date.now() - startTimestamp;

            if (this.scanImages() === false || timestampDifference >= this.scanTimeout) {
                this.clearInterval();
            }
        }, this.scanInterval);
    }

    /**
     * Cycles through query selected image elements checking to see if the
     * elements `currentSrc` has been set yet (It will be instant for standard
     * image elements but takes longer for responsive images while the browser
     * decides which `src` is most relevant). Once the property is set, the
     * element is removed from the stack and preloading gets triggered.
     *
     * @return {Boolean} - If more preloading is required, return true.
     */
    scanImages() {
        for (let i = this.imageElements.length - 1; i >= 0; i--) {
            let currentImage = this.imageElements[i];

            if (currentImage.currentSrc) {
                this.preloadImage(currentImage, this.onLoadCallback);
                this.imageElements.splice(i, 1);
            }
        }

        return this.imageElements.length > 0;
    }

    /**
     * Whenever an image has loaded we apply the relevant CSS selector
     * to signify that the element is ready.
     *
     * @param {Object} imageElement - The element which has been preloaded.
     */
    onImageLoad(imageElement) {
        imageElement.classList.add(this.imageLoadedSelector);
    }

    /**
     * Creates an image element in memory, binds a load listener to it that will
     * run a callback function passed through during initialise and then trigger
     * the loading of the image by applying the src.
     *
     * @param {Object} imageElement - The element requiring preloading.
     * @param {Function} [callbackFunc] - The function to be called after load.
     */
    preloadImage(imageElement, callbackFunc) {
        let self = this;
        let dummyElement = document.createElement('img');

        dummyElement.addEventListener('load', function onImageLoaded() {
            if (typeof(callbackFunc) === 'function' && callbackFunc.call) {
                callbackFunc.call(self, imageElement);
            }

            dummyElement.removeEventListener('load', onImageLoaded, false);
            dummyElement = null;
        }, false);

        dummyElement.src = imageElement.currentSrc;
    };

    /**
     * Clears the internal inverval running and nulls the variable.
     */
    clearInterval() {
        window.clearInterval(this.checkInterval);
        this.checkInterval = null;
    }

    /**
     * Convenience method to check an object for a particular property and
     * ensure that said property is of the correct type.
     *
     * @param {Object} targetObject
     * @param {String} propertyName
     * @param {String} propertyType
     * @return {Boolean}
     */
    isValidProperty(targetObject, propertyName, propertyType) {
        return (targetObject.hasOwnProperty(propertyName) && typeof(targetObject[propertyName]) === propertyType);
    }

    /**
     * Nulls all internal class variables to ensure that an instantiation
     * of this class will put up little resistance when it comes to being
     * garbage collected.
     */
    destroy() {
        this.clearInterval();
        this.imageElements = null;
        this.onLoadCallback = null;
        this.imageLoadedSelector = null;
        this.imageSelector = null;
        this.scanTimeout = null;
        this.scanInterval = null;
    }
};
