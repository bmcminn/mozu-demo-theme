
var configs = {
			emails:   require('./juice.js')
		, jsonlint: require('./jsonlint.js')
		, jshint:   require('./jshint.js')
		, compress: require('./compress.js')
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


, javascript: {
		files: configs.jshint.theme_js
	, tasks: [
			'jshint'
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
		files: '<%= mozusync.upload.src %>',
		tasks: [
			'mozusync:upload'
		]
	}

};
