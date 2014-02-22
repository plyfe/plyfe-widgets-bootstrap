module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-requirejs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-rename');

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    license: grunt.file.read('src/copyright.js'),

    clean: ['dist'],

    rename: {
      version: {
        src: 'dist/plyfe-widget.js',
        dest: 'dist/plyfe-widget-<%= pkg.version %>.js'
      },
    },

    bump: {
      options: {
        updateConfigs: ['pkg'],
      }
    },

    jshint: {
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
          out: 'dist/plyfe-widget.js',
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
          'dist/plyfe-widget.min.js': ['dist/plyfe-widget.js']
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
          'dist/plyfe-widget.js': ['dist/plyfe-widget.js']
        }
      }
    },
  });

  grunt.registerTask('default', [
    'clean',
    'jshint',
    'requirejs',
    'uglify:minified',
    'uglify:beautiful'
  ]);

  ['', ':patch', ':minor', ':major', ':build', ':git'].forEach(function(task) {
    grunt.registerTask('release' + task, [
      'bump-only:' + task,
      'default',
      'rename:version',
      'bump-commit',
    ]);
  });

};
