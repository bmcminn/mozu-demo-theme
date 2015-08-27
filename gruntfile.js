
module.exports = function(grunt) {

  'use strict';

  var path          = require('path')
    , watchAdapter  = require('grunt-mozu-appdev-sync/watch-adapter')
    , pkg           = grunt.file.readJSON('package.json')
    , versionCmd    = null
    ;

  require('time-grunt')(grunt);

  require('load-grunt-config')(grunt, {
      configPath: path.join(process.cwd(), 'grunt')
    , data: {
        pkg:        grunt.file.readJSON('package.json')
      , theme:      grunt.file.readJSON('theme.json')
      , mozuconfig: grunt.file.readJSON('mozu.config.json')
      }

    });


  watchAdapter(grunt, {
      src: 'mozusync.upload.src',
      action: 'upload',
      always: ['./assets/functions.json']
  });

  watchAdapter(grunt, {
      src: 'mozusync.del.remove',
      action: 'delete'
  });


  grunt.loadTasks('./tasks/');
  grunt.loadNpmTasks('thmaa');

};
