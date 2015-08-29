/**
 * grunt-pagespeed-ngrok
 * http://www.jamescryer.com/grunt-pagespeed-ngrok
 *
 * Copyright (c) 2014 James Cryer
 * http://www.jamescryer.com
 */


'use strict';

var ngrok = require('ngrok');

module.exports = function(grunt) {

    // Load grunt tasks
    require('load-grunt-tasks')(grunt);

    // Grunt configuration
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        /** Setup tasks **/

        responsive_images: {
            dev: {
                options: {
                    engine: 'im',
                    sizes: [
                        {
                            name: 'small',
                            width: 100,
                            quality: 60
                        },
                        {
                            name: 'medium',
                            width: 512,
                            quality: 60
                        },
                        {
                            name: 'large',
                            width: 1024,
                            quality: 50
                        },
                        {
                            name: 'large-2x',
                            width: 2048,
                            quality: 40
                        }
                    ]
                },

                /*
                 You don't need to change this part if you don't change
                 the directory structure.
                 */
                files: [{
                    expand: true,
                    src: ['*.{gif,jpg,png}'],
                    cwd: 'src/static/img_src/resp/pizza',
                    dest: 'src/static/img/pizza'
                },
                {
                    expand: true,
                    src: ['*.{gif,jpg,png}'],
                    cwd: 'src/static/img_src/resp',
                    dest: 'src/static/img'

                }]
            }
        },


        imageoptim: {
            options: {
                jpegMini: false,
                imageAlpha: false,
                imageOptim: true,
                quitAfter: true
            },
            build: {
                src: [
                    'dist/**/*.png',
                    'dist/**/*.jpg',
                    'dist/**/*.gif'
                ]
            }
        },

        /* Clear out the images directory if it exists */
        clean: {
            img: {
                src: ['src/static/img/']
            },
            build: {
                src: ['dist/']
            }
        },

        /* Generate the images directory if it is missing */
        mkdir: {
            img: {
                options: {
                    create: ['src/static/img']
                }
            }
        },

        /* Copy the "fixed" images that don't go through processing into the images/directory */
        copy: {
            img: {
                files: [{
                    expand: true,
                    src: 'src/static/img_src/fixed/*.{gif,jpg,png}',
                    dest: 'src/static/img/',
                    flatten: true
                }]
            },
            build: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: [
                        '**',
                        '!static/img_src/**',
                        '!static/scripts/**',
                        '!static/scripts/**/*.js',
                        '!static/styles/**/*.scss'
                    ],
                    dest: 'dist/'
                }]
            }
        },

        serviceWorker: {
            files:[{
                expand: true,
                cwd: 'src/',
                src: [
                    'static/scripts/third_party/serviceworker-cache-polyfill.js',
                    'static/scripts/sw.js'
                ],
                dest: 'dist/'
            }]
        },


        pagespeed: {
            options: {
                nokey: true,
                locale: "en_GB",
                threshold: 40

            },
            local: {
                options: {
                    strategy: "desktop"
                }
            },
            mobile: {
                options: {
                    strategy: "mobile"
                }
            }
        }
    });

    // Register customer task for ngrok
    grunt.registerTask('psi-ngrok', 'Run pagespeed with ngrok', function() {
        var done = this.async();
        var port = 8080;//9292;

        ngrok.connect(port, function(err, url) {
            if (err !== null) {
                grunt.fail.fatal(err);
                return done();
            }
            grunt.config.set('pagespeed.options.url', url);
            grunt.task.run('pagespeed');
            done();
        });
    });

    // Register default tasks
    grunt.loadNpmTasks('grunt-imageoptim');
    grunt.loadNpmTasks('grunt-responsive-images');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-mkdir');
    grunt.registerTask('resp', ['clean:img', 'mkdir:img', 'copy:img', 'responsive_images']);
    //grunt.registerTask('default', ['psi-ngrok']);
}
