module.exports = function(grunt) {

  'use strict';

  var path        = require('path')
    , pkg         = grunt.file.readJSON('./package.json')
    , theme       = grunt.file.exists('./theme.json') ? grunt.file.readJSON('theme.json') : {}
    , mozuconfig  = grunt.file.exists('./mozu.config.json') ? grunt.file.readJSON('./mozu.config.json') : {}
    ;

  require('time-grunt')(grunt);

  grunt.loadNpmTasks('mozu-theme-helpers');
  grunt.loadTasks('./.tasks/');

  require('load-grunt-config')(grunt, {
      configPath: path.join(process.cwd(), '.grunt'),
      pkg: pkg,
      data: {
        pkg:        pkg,
        theme:      theme,
        mozuconfig: mozuconfig
      }
    });

};
