// grunt/tasks/default.js

// TODO: clean out old tooling processes

module.exports = function(grunt) {

  'use strict';

  // MACROS
  grunt.registerTask('lintify', [
    // 'jsonlint'
    'jshint'
  ]);


  grunt.registerTask('theme', [
    'theme:about'
  , 'theme:backoffice'
  , 'theme:editors'
  , 'theme:pagetypes'
  , 'theme:settings'
  , 'widgetize'
  , 'theme:ui'
  ]);


  // TASKS
  grunt.registerTask('default', [
    'theme'
  , 'lintify'
  // , 'jsbeautifier'
  , 'setver'
  // , 'mozutheme:quickcompile'
  , 'mozusync:upload'
  ]);


  grunt.registerTask('init', [
    'default'
  , 'check:labels'
  , 'check:widgets'
  , 'check:settings'
  ]);


  grunt.registerTask('check', [
    'theme'
  , 'lintify'
  , 'setver'
  , 'check:labels'
  // , 'check:widgets'
  , 'check:settings'
  , 'check:deprecated'
  // , 'mozutheme:quickcompile'
  ]);


  grunt.registerTask('emails', [
    'lintify'
  , 'email-settings'
  , 'email-lessify'
  , 'less:emails'
  , 'juice'
  , 'email-strainer'
  , 'email-delessify'
  , 'mozusync:upload'
  ]);


  grunt.registerTask('reset', [
    'mozusync:wipe'
  , 'mozusync:upload'
  ]);




};
