module.exports = function(grunt) {

  var jsonFiles = [
        'theme.json',
        'theme-ui.json',
        'package.json',
        'labels/*.json'
      ],

      jsFiles = [
        'Gruntfile.js',
        'build.js',
        'scripts/**/*.js'
      ],

      filesToArchive = [
        'compiled/**',
        'labels/**',
        'resources/**',
        'scripts/**',
        'stylesheets/**',
        'templates/**',
        'LICENSE',
        'theme.json',
        'theme-ui.json',
        'thumb.png'
      ],

      // Set the versioning command for your VCS
      versionCmd = ':' // e.g. 'git describe --tags --always' or 'svn info'
  ;

grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    theme: grunt.file.readJSON('theme.json'),

    jsonlint: {
      theme_json: {
        src: jsonFiles
      }
    },

    jshint: {
      theme_js: jsFiles,
      options: {
        ignores: ['scripts/vendor/**/*.js'],
        undef: true,
        laxcomma: true,
        unused: false,
        globals: {
          console: true,
          window: true,
          document: true,
          setTimeout: true,
          clearTimeout: true,
          module: true,
          define: true,
          require: true,
          Modernizr: true,
          process: true
        }
      }
    },

    zubat: {
      main: {
        dir: '.',
        manualancestry: ['./references/<%= theme.about.extends %>'],
        ignore: ['/references','\\.git','node_modules','^/resources','^/tasks','\\.zip$']
      }
    },

    compress: {
      options: {
        mode: 'zip'
      },
      build: {
        options: {
          archive: 'theme-files.zip',
          pretty: true
        },
        files: [{
          src: filesToArchive,
          dest: '/'
        }]
      }
    },

    setver: {
      release: {
        cmd: versionCmd,
        themejson: true,
        packagejson: true,
        readmemd: true
      },
      build: {
        cmd: versionCmd,
        themejson: true,
      }
    },

    watch: {
      styles: {
        files: [
          'stylesheets/**/*.less'
        ],
        tasks: []
      },
      json: {
        files: jsonFiles,
        tasks: ['jsonlint']
      },
      javascript: {
        files: [
          'scripts/**/*.js',
          '!scripts/vendor/**/*.js'
        ],
        tasks: ['jshint']
      },
      compress: {
        files: filesToArchive,
        tasks: ['compress']
      }
    }
  });

  require('load-grunt-tasks')(grunt);

  grunt.loadTasks('./tasks/');

  grunt.registerTask('default', [
    'jsonlint',
    'jshint',
    'setver',
    'compress'
    ]);

  grunt.registerTask('build', [
    'jsonlint',
    'jshint',
    'checkreferences',
    'zubat',
    'setver:build',
    'compress'
    ]);

  grunt.registerTask('release', [
    'jsonlint',
    'jshint',
    'zubat',
    'setver:release',
    'compress'
    ]);
};
