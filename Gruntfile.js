/* jshint es3:false, node:true */

module.exports = function(grunt) {
  'use strict';

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-mocha');

  var packageJSON = grunt.file.readJSON('package.json');
  var versions = packageJSON.version.split('.');
  var majorVersion = versions[0];
  var minorVersion = versions[1];

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    license: grunt.file.read('src/build_frags/copyright.js'),

    majorVersion: majorVersion,
    minorVersion: minorVersion,

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
          baseUrl: 'src',
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

    copy: {
      version: {
        files: [
          {
            src: 'dist/plyfe-widgets-bootstrap.js',
            dest: 'dist/plyfe-widgets-bootstrap-v<%= majorVersion %>.<%= minorVersion %>.js'
          },
          {
            src: 'dist/plyfe-widgets-bootstrap.min.js',
            dest: 'dist/plyfe-widgets-bootstrap-v<%= majorVersion %>.<%= minorVersion %>.min.js'
          },
        ]
      },
    },

    watch: {
      scripts: {
        files: ['src/**/*.js', 'src/build_frags/*', 'tests/**/*'],
        tasks: ['test'],
      },
    },

    bump: {
      options: {
        files: ['package.json', 'bower.json'],
        updateConfigs: [],
        commit: true,
        commitMessage: 'Release v%VERSION%',
        commitFiles: ['package.json', 'bower.json'],
        createTag: true,
        tagName: 'v%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: true,
        pushTo: 'origin',
        gitDescribeOptions: '--tags --always --abbrev=1 --dirty=-d'
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
    'build',
  ]);

  grunt.registerTask('build', [
    'jshint',
    'clean',
    'requirejs',
    'uglify:beautiful', // beautify first
    'uglify:minified',
    'copy',
  ]);

  grunt.registerTask('test', [
    'build',
    'mocha',
  ]);
};
