// Karma configuration
// Generated on Tue Feb 24 2015 13:36:24 GMT-0500 (Eastern Standard Time)

module.exports = function(config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: 'js',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['qunit'],

      plugins: [
          'karma-qunit',
          'karma-ember-preprocessor',
          'karma-phantomjs-launcher',
          'karma-coverage',
          'karma-json-fixtures-preprocessor'
      ],

    // list of files / patterns to load in the browser
    files: [
        'vendor/bower_components/jquery/dist/jquery.min.js',
        'vendor/bower_components/ember/ember.debug.js',
        'vendor/bower_components/ember/ember-template-compiler.js',
        'vendor/bower_components/ember-data/ember-data.js',
        //'bower_components/ember-model/ember-model.js',
        'vendor/bower_components/ember-validations/ember-validations.js',
        'vendor/bower_components/underscore/underscore-min.js',
        'vendor/bower_components/chance/chance.js',
        'vendor/bower_components/ember-i18n/lib/i18n.js',
        'vendor/bower_components/ember-i18n/lib/i18n-plurals.js',
        //'vendor/bower_components/qunit/qunit/qunit.js',
        'vendor/bower_components/qunit-promises/qunit-promises.js',
        'vendor/bower_components/ember-qunit/ember-qunit.js',
        'vendor/bower_components/jquery-mockjax/jquery.mockjax.js',
        'vendor/bower_components/jsmockito/dist/jsmockito.js',
        'vendor/bower_components/jshamcrest/build/jshamcrest.js',

        { pattern: 'modules/translations/*.json', watched: false },
        { pattern: 'modules/**/*.hbs', watched: false },

        'modules/*.js',
        'modules/components/*.js',

        'modules/signin/*.js',
        'modules/tenant/*.js',
        'modules/presence/*.js',

        'tests/**/*.js'
    ],

    // list of files to exclude
    exclude: [
    ],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'modules/**/*.hbs': ['ember'],
        'modules/**/*.js': ['coverage'],
        'modules/**/*.json': ['json_fixtures']
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,

    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true
  });
};
