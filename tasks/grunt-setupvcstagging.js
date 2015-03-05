'use strict';

module.exports = function(grunt) {
  grunt.registerTask('setup-vcs-tagging', 'Setup version control (default git) tagging by editing the versionCmd in the gruntfile', function() {

    var gruntfileContents = grunt.file.read('Gruntfile.js'),
        tagCmd = grunt.option('tagcmd') || 'git describe --tags --always',
        versionCmdRE = /versionCmd = ':';/,
        matches = gruntfileContents.match(versionCmdRE);

    if (!matches) grunt.fail.warn('versionCmd variable assignment not found in Gruntfile. If you have modified your gruntfile extensively, you may have to do this manually.');

    grunt.log.ok('Found versionCmd in gruntfile, currently \'' + matches[0].trim() + '\'. Setting it to: \'' + tagCmd + '\'');

    grunt.file.write('Gruntfile.js', gruntfileContents.replace(versionCmdRE,function(str, terminator) {
      return "versionCmd = '" + tagCmd + "';";
    }));

  });
}