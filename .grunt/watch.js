
var configs = {
      emails:     require('./juice.js'),
      jshint:     require('./jshint.js'),
      compress:   require('./compress.js'),
      mozusync:   require('./mozusync.js')
    }
  ;


module.exports = {

  options: {
    spawn: false
  },


  json: {
    files: configs.jshint.production.src,
    // files: [
    //   '.components/**/*.json',
    //   '.components/editors/**/*.js'
    // ],
    tasks: [
      'theme',
      // 'newer:jshint:dev',
      'jshint:dev'
    // , 'newer:mozusync:upload'
    , 'mozusync:upload'
    ]
  },


  themeUI: {
    files: [
      '.components/theme-ui/**'
    ],
    tasks: [
      'theme-ui'
    // , 'newer:mozusync:upload'
    // , 'mozusync:upload'
    ]
  },


  themeJSON: {
    files: [
      '.theme/**/*.json'
    , '.theme-ui/**'
    ],
    tasks: [
      'theme'
    // , 'newer:mozusync:upload'
    , 'mozusync:upload'
    ]
  },


  widgets: {
    files: [
      '.theme/widgets/**'
    ],
    tasks: [
      'widgetize'
    // , 'newer:mozusync:upload'
    , 'mozusync:upload'
    ]
  },


  emails: {
    files: [
      configs.emails.emailSrc + '/**/*'
    ],
    tasks: [
      'juice',
      'strainer:' + configs.emails.emailSrc + '/*.hypr*'
    ]
  },


  compress: {
    files: configs.compress.build.files[0].src,
    tasks: [
      'compress'
    ]
  },


  sync: {
    files: configs.mozusync.upload.src,
    tasks: [
      'mozusync:upload'
      // 'mozusync:upload'
    ]
  }

};
