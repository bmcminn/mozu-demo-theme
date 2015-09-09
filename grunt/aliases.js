// grunt/tasks/default.js

module.exports = function(grunt) {

	grunt.registerTask('default', [
		'widgetize'
	, 'lintify'
	, 'setver:build'
	, 'compress'
	]);

	grunt.registerTask('build', [
		'widgetize'
	, 'lintify'
	, 'checkreferences'
	, 'zubat'
	, 'setver:release'
	, 'compress'
	]);

	grunt.registerTask('email', [
		'lintify'
	, 'email-lessify'
	, 'less:emails'
	, 'juice'
	, ['email-strainer:', require('./juice.js').emails.options.paths.emails, '/*.hypr*'].join('')
	, 'email-delessify'
	, 'compress'
	]);

	grunt.registerTask('push', [
		'widgetize'
	, 'lintify'
	, 'mozutheme:check'
	, 'mozutheme:quickcompile'
	// , 'mozutheme:buildver'
	, 'mozusync:upload'
	]);

	grunt.registerTask('sync', [
		'watch:sync'
	]);


	grunt.registerTask('lintify', [
		'jsonlint'
	, 'jshint'
	]);

};
