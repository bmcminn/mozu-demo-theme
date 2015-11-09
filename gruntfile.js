module.exports = function(grunt) {

  'use strict';

  var path = require('path')
    ;

  require('time-grunt')(grunt);

  grunt.loadTasks('./.tasks/');
  grunt.loadNpmTasks('thmaa');

  require('load-grunt-config')(grunt, {
      configPath: path.join(process.cwd(), '.grunt')
    , data: {
        pkg:        grunt.file.readJSON('package.json')
      , theme:      grunt.file.readJSON('theme.json')
      , mozuconfig: grunt.file.exists('./mozu.config.json') ? grunt.file.readJSON('./mozu.config.json') : {}
      }
    });


};
