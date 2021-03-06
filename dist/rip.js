(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Rip", [], factory);
	else if(typeof exports === 'object')
		exports["Rip"] = factory();
	else
		root["Rip"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports) {

	'use strict';
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	module.exports = function () {
	    /**
	     * Sets up default values for class options and validates / uses any user
	     * values that have been supplied.
	     *
	     * @param {Object} options
	     */
	
	    function Rip() {
	        var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
	
	        _classCallCheck(this, Rip);
	
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
	
	
	    _createClass(Rip, [{
	        key: 'triggerPreloading',
	        value: function triggerPreloading() {
	            var _this = this;
	
	            var startTimestamp = Date.now();
	
	            this.imageElements = [].slice.call(document.querySelectorAll(this.imageSelector));
	
	            this.checkInterval = window.setInterval(function () {
	                var timestampDifference = Date.now() - startTimestamp;
	
	                if (_this.scanImages() === false || timestampDifference >= _this.scanTimeout) {
	                    _this.clearInterval();
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
	
	    }, {
	        key: 'scanImages',
	        value: function scanImages() {
	            for (var i = this.imageElements.length - 1; i >= 0; i--) {
	                var currentImage = this.imageElements[i];
	
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
	
	    }, {
	        key: 'onImageLoad',
	        value: function onImageLoad(imageElement) {
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
	
	    }, {
	        key: 'preloadImage',
	        value: function preloadImage(imageElement, callbackFunc) {
	            var self = this;
	            var dummyElement = document.createElement('img');
	
	            dummyElement.addEventListener('load', function onImageLoaded() {
	                if (typeof callbackFunc === 'function' && callbackFunc.call) {
	                    callbackFunc.call(self, imageElement);
	                }
	
	                dummyElement.removeEventListener('load', onImageLoaded, false);
	                dummyElement = null;
	            }, false);
	
	            dummyElement.src = imageElement.currentSrc;
	        }
	    }, {
	        key: 'clearInterval',
	
	
	        /**
	         * Clears the internal inverval running and nulls the variable.
	         */
	        value: function clearInterval() {
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
	
	    }, {
	        key: 'isValidProperty',
	        value: function isValidProperty(targetObject, propertyName, propertyType) {
	            return targetObject.hasOwnProperty(propertyName) && _typeof(targetObject[propertyName]) === propertyType;
	        }
	    }]);
	
	    return Rip;
	}();

/***/ }
/******/ ])
});
;
//# sourceMappingURL=rip.js.map
//# sourceMappingURL=rip.js.map