
module.exports = {

  build: {
    options: {
      archive: '<%= pkg.name %>-<%= pkg.version %>.zip',
      pretty: true
    },
    files: [
      {
        src: [
          'admin/**/*',
          'compiled/**/*',
          'labels/**/*',
          'packageconfig.xml',
          'resources/**/*',
          'scripts/**/*',
          'stylesheets/**/*',
          'templates/**/*',
          'theme.json',
          '*thumb.png',
          '*thumb.jpg',
          'theme-ui.json',
          '!**/*.orig',
          '!.inherited'
        ],
        dest: '/'
      }
    ]
  }

};
