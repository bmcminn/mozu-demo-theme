
var versionCmd = ''; // e.g. 'git describe --tags --always' or 'svn info'

module.exports = {

  release: {
    cmd: versionCmd
  , themejson: true
  , packagejson: true
  , readmemd: true
  }

, build: {
    cmd: versionCmd
  , themejson: true
  }

};
