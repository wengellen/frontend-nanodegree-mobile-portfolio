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
                    cwd: 'img_src/resp/pizza',
                    dest: 'img/pizza'
                },
                {
                    expand: true,
                    src: ['*.{gif,jpg,png}'],
                    cwd: 'img_src/resp',
                    dest: 'img'

                }]
            }
        },


        imageoptim: {
            myTask: {
                options: {
                    jpegMini: false,
                    imageAlpha: true,
                    quitAfter: true
                },
                src: ['img']
            }
        },

        /* Clear out the images directory if it exists */
        clean: {
            dev: {
                src: ['img/']
            }
        },

        /* Generate the images directory if it is missing */
        mkdir: {
            dev: {
                options: {
                    create: ['img']
                }
            }
        },

        /* Copy the "fixed" images that don't go through processing into the images/directory */
        copy: {
            dev: {
                files: [{
                    expand: true,
                    src: 'img_src/fixed/*.{gif,jpg,png}',
                    dest: 'img/',
                    flatten: true
                }]
            }
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
    grunt.registerTask('default', ['clean', 'mkdir', 'copy', 'responsive_images', 'imageoptim']);
    //grunt.registerTask('default', ['psi-ngrok']);
}
