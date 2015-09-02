
module.exports = {

  options: {
    spawn: false
  }


, json: {
    files: [
      'theme*.json'
    ]
  , tasks: ['jsonlint']
  }


, javascript: {
    files: require('./jshint.js').theme_js
  , tasks: ['jshint']
  }


, widgets: {
    files: [
      'widgets/**'
    ]
  , tasks: ['widgetize']
  }


, compress: {
    files: require('./compress.js').build.files[0].src
  , tasks: ['compress']
  }


, sync: {
    files: '<%= mozusync.upload.src %>',
    tasks: ['mozusync:upload']
  }

};
