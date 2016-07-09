// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function (grunt) {
  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Lazyload grunt tasks.
  require('grunt-lazyload')(grunt);

  // Configurable paths
  var config = {
    app: 'web/app/',
    dist: 'web/dist',
    bower: 'bower_components',
    pkg: grunt.file.readJSON('package.json')
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      options: {
          spawn: false // Important, don't remove this!
      },
      js: {
        files: [
          '<%= config.app %>/scripts/{,*/}*.js'
        ],
        tasks: ['jshint']
      },
      sass: {
        files: [
          '<%= config.app %>/scss/**/*.scss',
        ],
        tasks: ['styles']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      dev: {
        files: [{
          dot: true,
          src: [
            '<%= config.app %>/scripts/vendor',
            '<%= config.app %>/styles/vendor'
          ]
        }]
      },
      js: ["<%= config.dist %>/scripts/*.js", "!<%= config.dist %>/scripts/*.min.js"],
      server: '.tmp'
    },

    // JS uglify.
    uglify: {
      dist: {
        options: {
          banner: '/* <%= config.pkg.name %> - v<%= config.pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %> */',
          preserveComments: false,
          mangle: true,
          compress: {
            drop_console: true
          }
        },
        files: [{
          expand: true,
          cwd: '<%= config.app %>/',
          src: 'scripts/*.js',
          dest: '<%= config.dist %>/'
        }]
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        '<%= config.app %>/scripts/*.js'
      ]
    },
    compass: {                  // Task
      dist: {                   // Target
        options: {              // Target options
          sassDir: '<%= config.app %>/scss',
          cssDir: '<%= config.app %>/styles',
          environment: 'development',
          // require: 'susy',
          raw: 'require \'compass\'\n'
        }
      }
    },
    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles/',
          src: '{,*/}*.css',
          dest: '<%= config.app %>/styles/'
        }]
      }
    },
    // Minify css for production
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: '<%= config.app %>/styles/',
          src: ['*.css'],
          dest: '<%= config.dist %>/styles/',
          ext: '.css'
        }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          // Copy global files.
          expand: true,
          dot: true,
          cwd: '<%= config.app %>',
          dest: '<%= config.dist %>',
         src: [
            '*.{ico,png,txt,md,json}',              // Global files.
            'assets/**/*.*',                        // Assets.
            'img/{,*/}*.{webp,jpg,png,gif,svg}',    // Images.
            'widget_img/{,*/}*.{webp,jpg,png,gif,svg}',    // Images.
            'fonts/{,*/}*.*',                // Fonts.
            'translate/{,*/}*.json',                // translations.
            'scripts/{,*jquery/}*.js',              // JS librairies.
          ]
        }]
      },
      distIndex:{
        // Copy index to apache docroot & edit urls to match distribution.
        src: '<%= config.app %>/index.html',
        dest: '<%= config.dist %>/index.html',
        options: {
          process: function (content, srcpath) {
            // Replace uncompiled files by compiled JS.
            content = content.replace('<script type="text/javascript" src="scripts/main.js"></script>',
              '<script type="text/javascript" src="scripts/main.min.js"></script>');
            return content;
          }
        },
      },
      index:{
        // Copy index to apache docroot & edit urls to match distribution.
        src: '<%= config.dist %>/index.html',
        dest: './index.html',
        options: {
          process: function (content, srcpath) {
            // Edit all src/href arguments to match new relatives urls. 
            // Load XRegExp to fix poor JavaScript native RegExp. 
            var XRegExp = require('xregexp').XRegExp; 
            var attributs = XRegExp('(?<attr>href|src)[ ]*=[ ]*(?<quo>[\'|"])(?!http:|https:|\/\/|mailto:|ftp:|ftps:|sftp:)', 'gi');
            content = XRegExp.replace(content, attributs,"${attr}=${quo}" + config.dist + "/");
            // Replace script init.
            content = content.replace('baseUrl:\'/\'',
              'baseUrl:\'/dist/\'');
            return content;
          }
        }
      },
      bower: {
        // Copy bower elements.
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= config.bower %>/jquery/dist/',
          dest: '<%= config.dist %>/scripts/vendor/jquery',
          src: ['jquery.min.js']
        },{
          expand: true,
          dot: true,
          cwd: '<%= config.bower %>/bootstrap/dist/',
          dest: '<%= config.dist %>/scripts/vendor/bootstrap',
          src: ['css/bootstrap.min.css', 'js/bootstrap.min.js', 'fonts/']
        },{
          expand: true,
          dot: true,
          cwd: '<%= config.bower %>/ks-normalize/dist/css/',
          dest: '<%= config.app %>/styles/vendor',
          src: ['ks-normalize.min.css']
        }
        ]
      }
    },
    concat: {
      options: {
        separator: '\n',
        stripBanners: true,
        banner: '/*! <%= config.pkg.name %> - v<%= config.pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      dist: {
        src: [
          '<%= config.dist %>/scripts/main.js',
        ],
        dest: '<%= config.dist %>/scripts/main.min.js',
      },
    }
  });

  // Explicit lazyLoad tasks.
  grunt.lazyLoadNpmTasks('grunt-contrib-connect', 'connect');
  grunt.lazyLoadNpmTasks('grunt-contrib-jshint', 'jshint');
  grunt.lazyLoadNpmTasks('jshint-stylish', 'stylish');
  grunt.lazyLoadNpmTasks('grunt-autoprefixer', 'autoprefixer');
  grunt.lazyLoadNpmTasks('grunt-browser-sync', 'browserSync');
  grunt.lazyLoadNpmTasks('grunt-contrib-clean', 'clean');
  grunt.lazyLoadNpmTasks('grunt-contrib-copy', 'copy');
  grunt.lazyLoadNpmTasks('grunt-contrib-sass', 'sass');
  grunt.lazyLoadNpmTasks('grunt-contrib-compass', 'compass');
  grunt.lazyLoadNpmTasks('grunt-contrib-uglify', 'uglify');
  grunt.lazyLoadNpmTasks('grunt-contrib-watch', 'watch');
  grunt.lazyLoadNpmTasks('grunt-contrib-cssmin', 'cssmin');
  grunt.lazyLoadNpmTasks('grunt-contrib-concat', 'concat');

  // Register tasks.
  grunt.registerTask('styles', [
    'compass',
    'autoprefixer'
  ]);
  grunt.registerTask('dist', [
    'clean:dist',
    'clean:server',
    'compass',
    'autoprefixer',
    'cssmin',
    'uglify:dist',
    'concat',
    'copy:dist',
    'clean:js',
    'copy:distIndex',
    'copy:index'
  ]);
  grunt.registerTask('serve', [
    'dist',
  ]);
  grunt.registerTask('default', [
    'clean:dev',
    'copy:bower',
    'styles',
    'dist'
  ]);
};
