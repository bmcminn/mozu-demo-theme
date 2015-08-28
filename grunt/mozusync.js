
module.exports = {

  options: {
    applicationKey: '<%= mozuconfig.workingApplicationKey %>'
  , context: '<%= mozuconfig %>'
  }

, upload: {
    options: {
      action: 'upload'
    , noclobber: true
    }

  , src: [
      'theme*.json'
    , 'templates/**'
    , 'stylesheets/**'
    , 'resources/**'
    , 'scripts/**'
    , 'labels/**'
    , 'compiled/**'
      // '**',
      // '**/*',
      // '!node_modules/**',
      // '!references/**',
      // '!tasks/**',
      // '!configure.js',
      // '!Gruntfile.js',
      // '!mozu.config.json',
      // '!*.zip'
    ]
  , filter: 'isFile'
  }

, del: {
    options: {
      action: 'delete'
    }
  , src: '<%= mozusync.upload.src %>'
  , filter: 'isFile'
  , remove: [

    ]
  }

, wipe: {
    options: {
      action: 'deleteAll'
    }
  , src: '<%= mozusync.upload.src %>'
  }

};
