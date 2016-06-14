[![Travis](https://img.shields.io/travis/rehabstudio/responsive-image-preloader.svg?maxAge=3600)](https://travis-ci.org/rehabstudio/responsive-image-preloader)
[![npm](https://img.shields.io/npm/v/responsive-image-preloader.svg?maxAge=3600)](https://www.npmjs.com/package/responsive-image-preloader)

# Responsive Image Preloader (RIP)

## Introduction

Responsive Image Preloader gathers up image elements in the DOM denoted with a
particular class, determines the relevant source for the current breakpoint
then preloads it and applies a class to the image. This library will also work
on standard non-responsive images.

The library has been built upon the [rehabstudio
FE Skeleton](https://github.com/rehabstudio/fe-skeleton) so any specifics
about installation, task documentation or setup can be read from the
documentation on that repository.

## Installation

Install this package via the usual `npm` commmands or you could download this
repository as a zip and take the relevant library bundle file from the `dist/`
folder.

    npm install responsive-image-preloader --save

## Example

An example page with multiple use cases (standard image, responsive image) can
be found within the [examples folder](
https://github.com/rehabstudio/responsive-image-preloader/tree/master/examples)
of the repository.

## Usage

Imagery requiring hidden and preloaded should be denoted with a particular JS
hook (which is configurable) and another selector that hides the image until it
has been loaded:

    <img class="rip js-rip-preload" src="/abc.jpg" alt="test image" />

    <picture>
        <source srcset="/large.jpg" media="(min-width: 800px)" />
        <source srcset="/medium.jpg" media="(min-width: 640px)" />
        <img class="rip js-rip-preload" src="/small.jpg" alt="test image" />
    </picture>

Once the image markup has been implemented correctly, add the stylesheet and
script to your HTML document:

    <link href="rip.css" rel="stylesheet" />
    <script src="rip.js"></script>

With the images and library files in place the only thing left to do is
create an instance of the library and trigger its preloading functionality:

    <script>
        var imagePreloader = new Rip();
        imagePreloader.triggerPreloading();
    </script>

The relevant image sources will now be preloaded in the background (responsive
images will be polled until their `currentSrc` attribute has been set by the
browser to denote it has made a decision on what source is best for the current
breakpoint) and after preloading has completed, a CSS selector will be added
to the image element to make it transition back into view.

## Documentation

The constructor method permits a multitude of settings to be specified in an
options object whenever it is called:

| Setting | Description | Type | Example Value |
|---------|-------------|------|---------------|
| *`scanInterval`* | The frequency (ms) with which image elements should be tested for their `currentSrc` value being set. | Number | `150` |
| *`scanTimeout`* | The amount of time (ms) that can pass before the interval doing the scanning gets forcibly cleared. | Number | `6000` |
| *`imageSelector`* | A valid CSS selector to select image elements needing preloaded. | String | `'js-rip-preload'` |
| *`imageLoadedSelector`* | A CSS selector applied after an image element finishes preloading. | String | `'rip--loaded'` |
| *`onLoad`* | Logic to run whenever an image has been successfully preloaded. | Function | `function(imageElement) { imageElement.classList.add('rip--loaded'); }` |

Example of overriding the defaults above:

    var imagePreloader = new Rip({
        scanInterval: 300,
        scanTimeout: 5000,
        imageSelector: 'js-preload-me',
        imageLoadedSelector: 'preloaded',
        onLoad: function(img) { img.classList.add('preloaded'); }
    });

    imagePreloader.triggerPreloading();

## Compiling

If you wish to manually compile the latest library files then clone the
repository and install `npm` packages:

    npm install

Once the build tools have been installed you can use an `npm` script to bundle
the source code into the library files:

    npm run-script build

This command will generate both unminified and minified versions of the script
along with source maps for both.

## Testing

The library comes with a test suite to ensure it operates as functionally
expected. If you wish to run this test suite (which also includes source file
linting) then run the following `npm` command:

    npm test