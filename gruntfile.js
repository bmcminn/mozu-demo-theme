
module.exports = function(grunt) {

  'use strict';

  var path          = require('path')
    , watchAdapter  = require('grunt-mozu-appdev-sync/watch-adapter')
    , pkg           = grunt.file.readJSON('package.json')
    , versionCmd    = ''
    ;

  require('time-grunt')(grunt);

  require('load-grunt-config')(grunt, {
      configPath: path.join(process.cwd(), 'grunt')
    , data: {
        pkg:    grunt.file.readJSON('package.json')
      , theme:  grunt.file.readJSON('theme.json')
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


  var lastVersionGot;
  function getVersion(cb) {
    if (!versionCmd) return cb(null, pkg.version);
    var cmd = versionCmd.split(' ');
    grunt.util.spawn({
      cmd: cmd[0],
      args: cmd.slice(1)
    }, function(err, res) {
      lastVersionGot = res.stdout.replace(/^v/,'');
      cb(err, lastVersionGot);
    });
  }


  grunt.loadTasks('./tasks/');
  grunt.loadNpmTasks('thmaa');

};
