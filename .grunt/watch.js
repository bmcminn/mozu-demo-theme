
var configs = {
      emails:     require('./juice.js'),
      // jsonlint:   require('./jsonlint.js'),
      jshint:     require('./jshint.js'),
      compress:   require('./compress.js'),
      mozusync:   require('./mozusync.js')
    }
  ;


module.exports = {

  options: {
    spawn: false
  },

  lintTooling: {
    files: configs.jshint.buildtools_js,
    tasks: [
      'jshint:buildtools_js'
    ]
  },

  javascript: {
    files: configs.jshint.theme_js,
    tasks: [
      'newer:jshint:dev',
      'newer:jsbeautifier',
      'mozutheme:quickcompile',
      'newer:mozusync:upload'
    ]
  },

  json: {
    files: configs.jshint.theme_js,
    // files: [
    //   '.components/**/*.json',
    //   '.components/editors/**/*.js'
    // ],
    tasks: [
      'theme',
      'newer:jshint:dev',
      'newer:mozusync:upload'
    ]
  },

  themeUI: {
    files: [
      '.components/theme-ui/**'
    ],
    tasks: [
      'theme-ui',
      'newer:mozusync:upload'
    ]
  },

  widgets: {
    files: [
      '.components/widgets/**'
    ],
    tasks: [
      'widgetize',
      'newer:mozusync:upload'
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
      'newer:mozusync:upload'
    ]
  }

};
