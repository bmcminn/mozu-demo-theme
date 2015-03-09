'use strict';

var coreVersions = [4,5,6];

var task = function(grunt) {
  grunt.registerTask('checkreferences', 'Check to see if core has updated', function() {
    var done = this.async(),
    semver = require('semver');
    var themejson;
    try {
      themejson = grunt.file.readJSON('./theme.json');
    } catch(e) {
      return grunt.fail.fatal('Theme.json not found.');
    }
    var activeVersion = coreVersions.filter(function(ver) {
      return themejson.about.extends.toLowerCase().trim() === "core" + ver;
    })[0];

    if (!activeVersion) {
      grunt.log.ok(grunt.log.wraptext(80, 'This theme does not extend a Core theme directly, so a reference check is unnecessary. If you extend a Core theme in the upstream theme ' + themejson.about.extends + ', then keep references current in that theme.'));
      return done();
    }
    coreVersions.reduceRight(function(cb, ver) {
      var installedVersion;
      try {
        installedVersion = grunt.file.readJSON('./references/core' + ver + '/bower.json', 'utf-8').version;
      } catch(e) {
        console.log(e.message);
        grunt.fail.warn('Core' + ver + ' theme must be installed in order to check references. Run `grunt updatereferences`.');
      }
      return function() {

        grunt.util.spawn({ cmd: 'bower', args: ['info','mozu/core-theme#^' + ver,'-j']}, function(err, res) {
          if (err) grunt.fail.warn(err);
          var currentVersion = JSON.parse(res.stdout).version;
          grunt.log.ok('Installed version of Core' + ver + ' is ' + installedVersion);
          grunt.log.ok('Current version of Core' + ver + ' is ' + currentVersion);
          if (semver.gt(currentVersion, installedVersion)) {
            if (ver === activeVersion) {
              grunt.fail.warn(grunt.log.wraptext(80, 'Your theme extends Core' + ver + ' and Core' + ver + ' has updated in production! Run `grunt updatereferences --warn' + ver + '` to update your local reference and check the repository for release notes.'));
            } else {
              grunt.log.subhead(grunt.log.wraptext(80, 'Core' + ver + ' has updated in production. Your theme does not extend Core' + ver + ', so no action is necessary, but if you want to maintain a current copy of Core' + ver + ' for reference, run `grunt updatereferences`.'));
            }
          }
          cb();
        });
      }
    }, done)();
  });
};

task.coreVersions = coreVersions;

module.exports = task;