module.exports = {

    /**
     * Where built output (CSS, JS, HTML, fonts, images) should be
     * stored on the filesystem. Can either be an absolute path or
     * relative path to the location of the gulpfile.
     *
     * @type {String}
     */
    destPath: './dist/',

    /**
     * Configuration settings for any task which needs them.
     * Keys should match the task name for consistency.
     *
     * @type {Object}
     */
    taskConfiguration: {
        build: {
            sourcePaths: []
        },
        lint: {
            sourcePaths: ['./src/**/*.js', './run/**/*.js']
        },
        scripts: {
            /**
             * A folder path that is prefixed with the global `destPath` to give a
             * standard destination for JS bundles.
             *
             * @type {String}
             */
            genericOutputFolder: './',

            /**
             * Settings for webpacks uglify plugin.
             *
             * @type {Object}
             */
            uglifySettings: {
                include: /\.min\.js$/,
                compress: {
                    'drop_console': false,
                    'drop_debugger': false,
                    'warnings': false
                }
            },

            /**
             * Base settings for webpack.
             *
             * NOTE: For a full list of options, please visit:
             * https://webpack.github.io/docs/configuration.html
             *
             * @type {Object}
             */
            webpackSettings: {
                watch: false,
                entry: {
                    'rip': './src/index.js',
                    'rip.min': './src/index.js'
                },
                output: {
                    filename: '[name].js',
                    library: 'Rip',
                    libraryTarget: 'umd',
                    umdNamedDefine: true
                },
                module: {
                    loaders: [
                        {test: /\.js$/, exclude: /(node_modules|bower_components)/, loader: 'babel?presets[]=es2015'}
                    ]
                },
                plugins: [
                ]
            }
        },
        test: {
            configPath: __dirname + '/../karma.conf.js'
        },
        watch: {
            sourcePaths: {
            }
        }
    }

};
