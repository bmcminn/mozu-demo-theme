'use strict';

var coreVersions = require('./grunt-checkreferences').coreVersions;

module.exports = function(grunt) {
  grunt.registerTask('updatereferences', 'Update references folder with core theme and any other dependent themes', function() {
    var done = this.async();
    grunt.util.spawn({ cmd: 'bower', args: ['cache','clean'] }, function(err) {
      if (err) grunt.fail.warn('Cache clean failed: ' + err.message);
      coreVersions.reduceRight(function(cb, ver) {
        return function() {
          if (grunt.file.exists('./references/core' + ver)) grunt.file.delete('./references/core' + ver);
          grunt.util.spawn({
            cmd: 'bower',
            args: ('install core' + ver + '=mozu/core-theme#^' + ver + ' -j --production --config.directory=references').split(' ')
          }, function(err, res) {
            if (err) grunt.fail.warn('Update references failed: ' + err.message || err);
            JSON.parse(res.stderr).filter(function(log) { 
              return log.id === "resolved" && log.data && log.data.endpoint && log.data.endpoint.source === "mozu/core-theme"; 
            }).forEach(function(log) {
              if (grunt.option('warn' + ver)) grunt.log.subhead("Core" + ver + " has changed in production. Check the release notes of the Core theme for changes, and re-test your theme.")
              grunt.log.ok("Your reference to Core" + ver + " has updated to version " + log.message.split('#').pop());
            });
            cb();
          });
        }
      }, done)();
    });
  });
}