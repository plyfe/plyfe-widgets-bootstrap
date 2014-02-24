module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-mocha');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    license: grunt.file.read('src/copyright.js'),

    clean: ['tmp', 'dist'],

    jshint: {
      all: ['Gruntfile.js', 'src/**/*.js', 'dist/*.js', 'tests/spec/**/*.js'],
      options: {
        curly: true,
        eqeqeq: true,
        eqnull: true,
        browser: true,
        globals: {
          jQuery: true
        },
      },
    },

    requirejs: {
      production: {
        options: {
          optimize: 'none',
          baseUrl: "src",
          name: '../node_modules/almond/almond',
          include: ['main'],
          out: 'tmp/plyfe-widget.js',
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
          'tmp/plyfe-widget.min.js': ['tmp/plyfe-widget.js']
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
          'tmp/plyfe-widget.js': ['tmp/plyfe-widget.js']
        }
      }
    },

    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['test'],
      },
    },

    copy: {
      version: {
        files: [
          {
            src: 'tmp/plyfe-widget.js',
            dest: 'dist/plyfe-widget-<%= pkg.version %>.js'
          },
          {
            src: 'tmp/plyfe-widget.min.js',
            dest: 'dist/plyfe-widget-<%= pkg.version %>.min.js'
          },
        ]
      },
    },

    bump: {
      options: {
        updateConfigs: ['pkg'],
        pushTo: 'origin',
        commitFiles: ['-a'],
      }
    },

    mocha: {
      options: {
        run: true
      },
      test: {
        src: ['tests/*.html'],
      }
    },

  });

  grunt.registerTask('default', [
    'build',
    'jshint',
    'copy:version',
  ]);

  grunt.registerTask('build', [
    'clean',
    'requirejs',
    'uglify:minified',
    'uglify:beautiful',
  ]);

  grunt.registerTask('test', [
    'build',
    'mocha',
  ]);

  ['', ':patch', ':minor', ':major', ':build', ':git'].forEach(function(task) {
    grunt.registerTask('release' + task, [
      'bump-only:' + task,
      'default',
      'copy:version',
      // 'bump-commit',
    ]);
  });

};
