
var configs = {
			emails:   require('./juice.js')
		, jsonlint: require('./jsonlint.js')
		, jshint:   require('./jshint.js')
    , compress: require('./compress.js')
		, mozusync: require('./mozusync.js')
		}
	;

module.exports = {

	options: {
		spawn: false
	}


, json: {
		files: configs.jsonlint.theme_json.src
	, tasks: [
			'jsonlint'
		]
	}


, lintTooling: {
    files: configs.jshint.buildtools_js
  , tasks: [
      'jshint:buildtools_js'
    ]
  }


, javascript: {
    files: configs.jshint.theme_js
	, tasks: [
			'jshint:theme_js'
    , 'jsbeautifier'
    , 'mozusync:upload'
		]
	}


, themeJSON: {
    files: [
      '.components/**/*.json',
      '.components/editors/**/*.js'
    ],
    tasks: [
      'theme'
    , 'mozusync:upload'
    ]
  }


, themeUI: {
    files: [
      '.components/theme-ui/**'
    ],
    tasks: [
      'theme-ui'
    , 'mozusync:upload'
    ]
  }


, widgets: {
		files: [
			'.components/widgets/**'
		]
	, tasks: [
			'widgetize'
		, 'mozusync:upload'
		]
	}


, emails: {
		files: [
			configs.emails.emailSrc + '/**/*'
		],
		tasks: [
			'juice'
		, 'strainer:' + configs.emails.emailSrc + '/*.hypr*'
		]
	}


, compress: {
		files: configs.compress.build.files[0].src
	, tasks: [
			'compress'
		]
	}


, sync: {
		files: configs.mozusync.upload.src,
		tasks: [
			'mozusync:upload'
		]
	}

};
