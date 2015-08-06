
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
