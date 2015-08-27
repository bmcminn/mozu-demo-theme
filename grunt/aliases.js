// grunt/tasks/default.js

module.exports = function(grunt) {

  grunt.registerTask('default', [
    'widgetize'
  , 'jsonlint'
  , 'jshint'
  , 'setver'
  , 'compress'
  ]);

  grunt.registerTask('build', [
    'jsonlint'
  , 'jshint'
  , 'checkreferences'
  , 'zubat'
  , 'setver:build'
  , 'compress'
  ]);

  grunt.registerTask('email', [
    'juice'
  , 'strainer'
  ]);

  grunt.registerTask('push', [
    'jsonlint'
  , 'jshint'
  , 'mozutheme:check'
  , 'mozutheme:quickcompile'
  , 'mozutheme:buildver'
  , 'mozusync:upload'
  ]);

  grunt.registerTask('sync', [
    'watch:sync'
  ]);

};
