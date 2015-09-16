'use strict';
module.exports = function(grunt) {

  // grunt commands;
  // ------
  // > grunt setver
  //
  // Manually set the version to whatever you wish
  // > grunt setver -to xx.xx.xx
  //

  grunt.registerMultiTask('setver', 'Update all version information.', function() {

    var pkg             = grunt.file.readJSON('package.json'),
        theme           = grunt.file.readJSON('theme.json'),

        childProcess    = require('child_process'),
        fs              = require('fs'),
        path            = require('path'),
        async           = require('async'),

        done            = this.async(),
        currentVersion  = theme.about.version,
        self            = this,

        applyVersion = function(newver) {
          if (!newver) newver = currentVersion;
          var next = function(cb) {
                process.nextTick(function() {
                  cb(null, true);
                });
              },
              tasks = {
                packagejson: function(cb) {
                  pkg.version = newver;
                  grunt.file.write('package.json', JSON.stringify(pkg, null, 2));
                  grunt.log.ok('Updated package.json version to ' + newver);
                  next(cb);
                },
                bowerjson: function(cb) {
                  pkg.version = newver;
                  grunt.file.write('bower.json', JSON.stringify(pkg, null, 2));
                  grunt.log.ok('Updated bower.json version to ' + newver);
                  next(cb);
                },
                themejson: function(cb) {
                  theme.about.version = newver;
                  if (!theme.about.name.match(/v[\d\.]+/)) {
                    theme.about.name += ' v0.1.0';
                  }
                  theme.about.name    = theme.about.name.replace(/\s+v[\d\.]+/, ' v' + newver);
                  grunt.file.write('theme.json', JSON.stringify(theme, null, 2));
                  grunt.log.ok('Updated theme.json version to ' + newver);
                  next(cb);
                },
                readmemd: function(cb) {
                  var readmetxt = grunt.file.read('README.md');
                  grunt.file.write('README.md', readmetxt.replace(/\nVersion:.*\n/, "\nVersion: " + newver + "\n"));
                  grunt.log.ok('Updated readme.md version to ' + newver);
                  next(cb);
                },
                filenames: function(cb) {
                  if (!Array.isArray(self.data.filenames)) {
                    var err = 'Please supply an array of filenames to rename with the version, instead of "' + filenames + '".';
                    grunt.log.error(err);
                    return cb(err);
                  }
                  var suffix = '-' + newver || currentVersion;
                  self.data.filenames.forEach(function(filename) {
                    var ext = path.extname(filename),
                      newName = path.basename(filename, ext) + suffix + ext;
                      console.log(newName);
                    fs.renameSync(filename, newName);
                    grunt.log.ok('Updated ' + filename + ' to ' + newName);
                  });
                  next(cb);
                }
              };

          var toRun = {};

          for (var task in tasks) {
            if (self.data[task]) {
              toRun[task] = tasks[task];
            }
          }

          grunt.log.writeln('Updating everything to version ' + newver || currentVersion);

          async.parallel(toRun, function(err, allDone) {
            if (err) {
              grunt.fail.fatal(err);
            } else {
              done(true);
            }
          });
        };

    var manualVer = grunt.option('to');

    if (manualVer) {
      applyVersion(manualVer);
      //done(true);
    } else {
      applyVersion(theme.about.version)
      // childProcess.exec(this.data.cmd || 'git describe --tags --always', function(err, stdout, stderr) {
      //   if (err || stderr) {
      //     return grunt.fail.fatal(err || stderr);
      //   }
      //   applyVersion(stdout.trim());
      // });
    }
  });
};
