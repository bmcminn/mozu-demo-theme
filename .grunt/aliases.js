// grunt/tasks/default.js

// TODO: clean out old tooling processes

module.exports = function(grunt) {

  'use strict';

  //
  // MACROS
  //

  grunt.registerTask('lintify', [
    'jshint:dev'
  ]);


  grunt.registerTask('theme', [
    'theme:about',
    'theme:backoffice',
    'theme:editors',
    'theme:pagetypes',
    'theme:settings',
    'theme:ui'
  ]);


  grunt.registerTask('check', [
    'theme',
    'lintify',
    'setver',
    'check:labels',
  // 'check:widgets',
    'check:settings',
    'check:deprecated',
    'mozutheme:quickcompile',
    'mozutheme:check'
  ]);



  //
  // TASKS
  //

  grunt.registerTask('default', [
    'theme',
    'lintify',
  // 'jsbeautifier',
    'setver',
    'mozutheme:quickcompile',
    'mozusync:upload'
  ]);


  grunt.registerTask('build', [
    'theme',
    'lintify',
    'jshint:production',
  // 'jsbeautifier',
    'setver',
    'mozutheme:compile',
    'mozusync:upload'
  ]);


  grunt.registerTask('emails', [
    'lintify',
    'email-settings',
    'email-lessify',
    'less:emails',
    'juice',
    'email-strainer',
    'email-delessify',
    'mozusync:upload'
  ]);


  grunt.registerTask('reset', [
    'mozusync:wipe',
    'mozusync:upload'
  ]);




};
