module.exports = function(grunt) {
    grunt.log.writeln('Initializing grunt task configurations');
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                separator: ';'
            },
            dist: {
                // The files to concatenate and
                // the location of the resulting JS file
                files: {
                    'js/dist/<%= pkg.name %>-app.js': ['js/modules/*.js'],
                    'js/dist/<%= pkg.name %>-components.js': ['js/modules/components/**/*.js'],
                    'js/dist/<%= pkg.name %>-signin.js': ['js/modules/signin/**/*.js'],
                    'js/dist/<%= pkg.name %>-tenant.js': ['js/modules/tenant/**/*.js'],
                    'js/dist/<%= pkg.name %>-presence.js': ['js/modules/presence/**/*.js']
                }
            }
        },
        uglify: {
            prod: {
                options: {
                    // The banner is inserted at the top of the output
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
                },
                files: {
                    'js/dist/<%= pkg.name %>-app.min.js': ['js/dist/<%= pkg.name %>-app.js'],
                    'js/dist/<%= pkg.name %>-components.min.js': ['js/dist/<%= pkg.name %>-components.js'],
                    'js/dist/<%= pkg.name %>-signin.min.js': ['js/dist/<%= pkg.name %>-signin.js'],
                    'js/dist/<%= pkg.name %>-tenant.min.js': ['js/dist/<%= pkg.name %>-tenant.js'],
                    'js/dist/<%= pkg.name %>-presence.min.js': ['js/dist/<%= pkg.name %>-presence.js']
                }
            },
            dev: {
                options: {
                    // The banner is inserted at the top of the output
                    banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n',
                    beautify: true
                },
                files: {
                    'js/dist/<%= pkg.name %>-app.min.js': ['js/dist/<%= pkg.name %>-app.js'],
                    'js/dist/<%= pkg.name %>-components.min.js': ['js/dist/<%= pkg.name %>-components.js'],
                    'js/dist/<%= pkg.name %>-signin.min.js': ['js/dist/<%= pkg.name %>-signin.js'],
                    'js/dist/<%= pkg.name %>-tenant.min.js': ['js/dist/<%= pkg.name %>-tenant.js'],
                    'js/dist/<%= pkg.name %>-presence.min.js': ['js/dist/<%= pkg.name %>-presence.js']
                }
            }
        },
        karma: {
            prod: {
                configFile: 'karma.conf.js',
                coverageReporter: {
                    dir: '../../coverage/js_coverage',
                    reporters: [
                        {
                            type: 'html',
                            subdir: '/html-report',
                            watermarks: {
                                statements: [ 79, 89 ],
                                functions: [ 79, 89 ],
                                branches: [ 79, 89 ],
                                lines: [ 79, 89 ]
                            }
                        },
                        {
                            type: 'text-summary',
                            subdir: '/',
                            watermarks: {
                                statements: [ 79, 89 ],
                                functions: [ 79, 89 ],
                                branches: [ 79, 89 ],
                                lines: [ 79, 89 ]
                            }
                        },
                        {
                            type: 'lcov',
                            subdir: '/',
                            //file: 'lcov.info', // REMARKS: Only needed if using the lcovonly reporter type
                            watermarks: {
                                statements: [ 79, 89 ],
                                functions: [ 79, 89 ],
                                branches: [ 79, 89 ],
                                lines: [ 79, 89 ]
                            }
                        },
                        {
                            type: 'teamcity',
                            subdir: '/teamcity-report',
                            file: 'teamcity.txt',
                            watermarks: {
                                statements: [ 79, 89 ],
                                functions: [ 79, 89 ],
                                branches: [ 79, 89 ],
                                lines: [ 79, 89 ]
                            }
                        },
                        {
                            type: 'json',
                            subdir: 'json-report',
                            file: 'coverageobjects.json',
                            watermarks: {
                                statements: [ 79, 89 ],
                                functions: [ 79, 89 ],
                                branches: [ 79, 89 ],
                                lines: [ 79, 89 ]
                            }
                        }
                    ]
                }
            },
            dev: {
                configFile: 'karma.conf.js',
                reporters: ['progress']
            }
        },
        // TODO: Made it work by modifying the code-coverage-enforcer library; however, we need to fix the bugs in it so we can properly standardize it.
        //"code-coverage-enforcer": {
        //    options: {
        //        lcovfile: '../../Product/coverage/js_coverage/lcov-report/lcov.info',
        //        //statements: 60,
        //        lines: 90,
        //        functions: 50,
        //        branches: 50,
        //        src: 'js/modules',
        //        includes: ['**/*.js'],
        //        excludes: ['js/vendor/**/*.js', 'js/modules/mockeddata.js']
        //    }
        //},
        jshint: {
            files: ['Gruntfile.js', 'js/modules/**/*.js', 'js/tests/**/*.js'],
            options: {
                // Options here to override JSHint defaults.
                // More options here if you want to override JSHint defaults
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        watch: {
            files: ['<%= jshint.files %>'],
            tasks: ['jshint', 'uglify:dev', 'karma:dev']
        }
    });

    grunt.log.writeln('Loading grunt tasks');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-concat');

    //grunt.loadNpmTasks('grunt-code-coverage-enforcer');
    //grunt.registerTask('build-acceptance', ['code-coverage-enforcer']);

    // The default task can be run just by typing "grunt" on the command line
    // Running grunt by itself will execute each task in the order specified
    var target = grunt.option('target') || 'dev';
    grunt.log.writeln('Registering and executing grunt tasks for ' + target);
    grunt.registerTask('build', ['jshint', 'concat', 'uglify:' + target, 'karma:' + target]);
};