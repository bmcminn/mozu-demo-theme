
module.exports = {

  watch: {

    json: {
      files: require('./jsonlint.js').theme_json.src
    , tasks: ['jsonlint']
    }

  , javascript: {
      files: [
        'scripts/**/*.js'
      , '!scripts/vendor/**/*.js'
      ]
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
  }

};
