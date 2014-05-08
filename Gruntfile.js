/*global module */
module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    license: grunt.file.read('src/build_frags/copyright.js'),

    clean: ['dist'],

    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'tests/spec/**/*.js'],

      options: {
        jshintrc: true
      },
    },

    requirejs: {
      production: {
        options: {
          optimize: 'none',
          baseUrl: "src",
          name: '../node_modules/almond/almond',
          include: ['main'],
          out: 'dist/plyfe-widgets-bootstrap.js',
          wrap: {
            startFile: 'src/build_frags/start.frag',
            endFile: 'src/build_frags/end.frag'
          }
        }
      }
    },

    uglify: {
      options: {
        banner: '<%= license %>'
      },
      minified: {
        files: {
          'dist/plyfe-widgets-bootstrap.min.js': ['dist/plyfe-widgets-bootstrap.js']
        }
      },
      beautiful: {
        options: {
          compress: false,
          mangle: false,
          preserveComments: false,
          beautify: true,
        },
        files: {
          'dist/plyfe-widgets-bootstrap.js': ['dist/plyfe-widgets-bootstrap.js']
        }
      }
    },

    watch: {
      scripts: {
        files: ['src/**/*.js', 'tests/**/*'],
        tasks: ['test'],
      },
    },

    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: ['pkg'],
        pushTo: 'origin',
        commitFiles: ['-a'],
      }
    },

    mocha: {
      options: {
        run: false
      },
      test: {
        src: ['tests/*.html'],
      }
    },

  });

  grunt.registerTask('default', [
    'jshint',
    'build',
    'uglify:beautiful', // beautify first
    'uglify:minified'
  ]);

  grunt.registerTask('build', [
    'clean',
    'requirejs',
  ]);

  grunt.registerTask('test', [
    'build',
    'mocha',
  ]);

  grunt.registerTask('release', function(type) {
    type = type || 'patch'; // Default release type
    grunt.task.run('bump-only:' + type);
    grunt.task.run('default');
    grunt.task.run('bump-commit');
  });

};
