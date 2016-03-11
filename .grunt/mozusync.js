module.exports = {

  options: {
    applicationKey: '<%= mozuconfig.workingApplicationKey %>',
    context: '<%= mozuconfig %>',
    noAuthDialog: false
  },

  upload: {
    options: {
      action: 'upload',
      noclobber: true,
      noAuthDialog: 1
    },
    src: [
      'admin/**/*',
      'compiled/**/*',
      'labels/**/*',
      'resources/**/*',
      'packageconfig.xml',
      'scripts/**/*',
      'stylesheets/**/*',
      'templates/**/*',
      'theme.json',
      '*thumb.png',
      '*thumb.jpg',
      'theme-ui.json',
      '!*.orig',
      '!.inherited'
    ]
  },

  del: {
    options: {
      action: 'delete'
    },
    src: '<%= mozusync.upload.src %>',
    remove: []
  },

  wipe: {
    options: {
      action: 'deleteAll',
      soloOnly: false
    },
    src: '<%= mozusync.upload.src %>'
  }

};
