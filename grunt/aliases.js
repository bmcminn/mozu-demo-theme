// grunt/tasks/default.js

module.exports = function(grunt) {

	grunt.registerTask('default', [
		'widgetize'
	, 'lintify'
	, 'setver:build'
	, 'compress'
	]);

	grunt.registerTask('check', [
		'checklabels'
	, 'checkwidgets'
	, 'checksettings'
	, 'checkreferences'
	]);

	grunt.registerTask('build', [
		'widgetize'
	, 'lintify'
	, 'checkreferences'
	, 'zubat'
	, 'setver:release'
	, 'compress'
	]);

	grunt.registerTask('emails', [
		'lintify'
	, 'email-lessify'
	, 'less:emails'
	, 'juice'
	, 'email-strainer'
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
