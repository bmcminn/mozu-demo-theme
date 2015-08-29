
  var lastVersionGot

    , path        = require('path')
    , pkg         = require(path.resolve('./package.json'))
    , versionCmd  = null

    , getVersion = function(cb) {
        if (!versionCmd) {
          return cb(null, pkg.version);
        }

        var cmd = versionCmd.split(' ');

        grunt.util.spawn({
          cmd: cmd[0],
          args: cmd.slice(1)
        }, function(err, res) {
          lastVersionGot = res.stdout.replace(/^v/,'');
          cb(err, lastVersionGot);
        });
      }
    ;


module.exports = {

  check: {}
, update: {}
, compile: {}

, quickcompile: {
    command: 'compile'
  , opts: {
      skipminification: true
    }
  },

  buildver: {
    command: 'set-version'
  , opts: function(callback) {
      getVersion(function(err, ver) {
        callback(err, {
          version: ver
        , 'no-bower': true
        , 'no-package': true
        });
      });
    }
  }

, releasever: {
    command: 'set-version'
  , opts: function(callback) {
      getVersion(function(err, ver) {
        callback(err, {
          version: ver
        });
      });
    }
  }

};
