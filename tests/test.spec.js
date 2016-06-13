// Loading dependencies.
var Rip = require('../src/index.js');

describe('Rip', function() {
    beforeEach(function() {
        this.sinonSandbox = new sinon.sandbox.create(); // eslint-disable-line new-cap
    });

    afterEach(function() {
        this.sinonSandbox.restore();
    });

    context('contructor', function() {
        it('should allow for overriding of settings', function() {
            var testOnLoadFunction = function() {
                return 1 + 1;
            };

            var testInstantiation = new Rip({
                scanInterval: 1234,
                scanTimeout: 4321,
                imageSelector: '.js-test-selector',
                imageLoadedSelector: '.js-another-test-selector',
                onLoad: testOnLoadFunction
            });

            expect(testInstantiation.scanInterval).to.equal(1234);
            expect(testInstantiation.scanTimeout).to.equal(4321);
            expect(testInstantiation.imageSelector).to.equal('.js-test-selector');
            expect(testInstantiation.imageLoadedSelector).to.equal('.js-another-test-selector');
            expect(testInstantiation.onLoadCallback).to.equal(testOnLoadFunction);
        });
    });

    context('triggerPreloading', function() {
        it('calls scan images', function(done) {
            var testInstantiation = new Rip();

            this.sinonSandbox.stub(testInstantiation, 'scanImages', function() {
                return false;
            });

            testInstantiation.triggerPreloading();

            setTimeout(function() {
                expect(testInstantiation.scanImages.callCount).to.equal(1);
                done();
            }, testInstantiation.scanInterval);
        });

        it('times itself out', function(done) {
            var testInstantiation = new Rip({
                scanInterval: 33,
                scanTimeout: 100
            });

            expect(testInstantiation.checkInterval).to.equal(null);

            this.sinonSandbox.stub(testInstantiation, 'scanImages', function() {
                return true;
            });

            testInstantiation.triggerPreloading();

            setTimeout(function() {
                expect(typeof(testInstantiation.checkInterval)).to.equal('number');
            }, testInstantiation.scanInterval);

            setTimeout(function() {
                expect(testInstantiation.checkInterval).to.equal(null);
                done();
            }, testInstantiation.scanTimeout + 200);
        });

        it('should clear the timer', function(done) {
            var testInstantiation = new Rip();

            this.sinonSandbox.spy(testInstantiation, 'clearInterval');
            this.sinonSandbox.stub(testInstantiation, 'scanImages', function() {
                return false;
            });

            testInstantiation.triggerPreloading();

            setTimeout(function() {
                expect(testInstantiation.checkInterval).to.equal(null);
                done();
            }, testInstantiation.scanInterval);
        });
    });

    context('scanImages', function() {
        beforeEach(function() {
            this.testInstantiation = new Rip();

            this.testInstantiation.imageElements = [
                {currentSrc: false},
                {currentSrc: 'set'},
                {currentSrc: 'set'}
            ];

            this.sinonSandbox.stub(this.testInstantiation, 'preloadImage');

            this.testInstantiation.scanImages();
        });

        it('should splice elements from array if `currentSrc` is set', function() {
            expect(this.testInstantiation.imageElements.length).to.equal(1);
        });

        it('should trigger `preloadImage` whenever an image is ready', function() {
            expect(this.testInstantiation.preloadImage.callCount).to.equal(2);
        });
    });

    context('onImageLoad', function() {
        it('should add a class to the element', function() {
            var testInstantiation = new Rip({
                imageLoadedSelector: 'js-test'
            });

            var dummyElement = document.createElement('img');

            expect(dummyElement.classList.contains('js-test')).to.equal(false);

            testInstantiation.onImageLoad(dummyElement);

            expect(dummyElement.classList.contains('js-test')).to.equal(true);
        });
    });

    context('clearInterval', function() {
        var testInstantiation = new Rip();

        testInstantiation.checkInterval = 'test';
        testInstantiation.clearInterval();
        expect(testInstantiation.checkInterval).to.equal(null);
    });

    context('isValidProperty', function() {
        it('should correctly validate properties', function() {
            var testInstantiation = new Rip();

            var testVariables = {
                aNumber: 123,
                aString: 'abc'
            };

            expect(testInstantiation.isValidProperty(testVariables, 'aNumber', 'number'));
            expect(testInstantiation.isValidProperty(testVariables, 'aString', 'string'));
        });
    });

    context('preloadImage', function() {
        it('should preload an image correctly', function(done) {
            var testInstantiation = new Rip({
                onLoad: function() {
                    done();
                }
            });

            var fakeImage = {
                currentSrc: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
            };

            testInstantiation.preloadImage(fakeImage, testInstantiation.onLoadCallback);
        });
    });
});
