module.exports = {

  main: {
    dir: '.'
  , manualancestry: [
      './references/<%= theme.about.extends %>'
    ]
  , ignore: [
      '/references'
    , '\\.git'
    , 'node_modules'
    , '^/resources'
    , '^/tasks'
    , '\\.zip$'
    ]
  }

};
