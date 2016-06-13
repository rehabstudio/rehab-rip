// Loading dependencies.
var args = require('yargs').argv,
    globalSettings = require('./run/config');

// Bind a shorter reference to the script settings from the global file.
var scriptSettings = globalSettings.taskConfiguration.scripts;

// Adapting the application-specific webpack settings to run in the test suite.
scriptSettings.webpackSettings.entry = {};
scriptSettings.webpackSettings.output = {
    filename: null
};

// Setting variables for upcoming checks and use in karma settings.
var autoWatch,
    singleRun,
    aggregateTimeout;

// Set some karma settings based on command-line arguments for watch mode.
if (args.watch) {
    autoWatch = true;
    singleRun = false;
    aggregateTimeout = 1000;
} else {
    autoWatch = false;
    singleRun = true;
    aggregateTimeout = 10000;
}

module.exports = function(config) {
    config.set({
        client: {
            mocha: {
                timeout: 8000
            }
        },

        frameworks: [
            'mocha',
            'chai',
            'sinon'
        ],

        /**
         * Files for Karma to load. By default we're searching
         * for any file that has our chosen test file suffix.
         *
         * @type {Array}
         */
        files: [
            'tests/**/*.spec.js'
        ],

        /**
         * Ensuring that any test specification will get
         * piped through webpack and built into its own
         * bundle.
         *
         * NOTE: If you have hundreds of tests, that means
         * hundreds of bundles. If it gets to that stage it
         * may be better to write one JS file that requires
         * all of your tests and target that only that one
         * JS file to load in Karma so only one bundle is
         * ever created (See: Miyagi Project).
         *
         * @type {Object}
         */
        preprocessors: {
            'tests/**/*.spec.js': ['webpack']
        },

        /**
         * Karma will use the test specifications that are
         * listed in the files array. It will not run any
         * code from the entry option of the webpack config.
         *
         * @type {Object}
         */
        webpack: scriptSettings.webpackSettings,

        /**
         * After a change the watcher waits for more changes.
         * By using a large value it stops webpack validating
         * and invalidating bundles rapidly.
         *
         * @type {Object}
         */
        webpackMiddleware: {
            watchOptions: {
                aggregateTimeout: aggregateTimeout
            }
        },

        reporters: ['progress', 'junit'],

        junitReporter: {
            outputDir: './test-results',
            outputFile: 'results.xml',
            useBrowserName: false
        },

        browsers: ['PhantomJS'],

        port: 9876,

        autoWatch: autoWatch,

        singleRun: singleRun,

        logLevel: config.LOG_INFO
    });
};
