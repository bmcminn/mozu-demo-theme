// grunt/tasks/default.js

module.exports = function(grunt) {

	grunt.registerTask('default', [
		'buildTheme'
	, 'lintify'
	, 'setver:build'
	, 'mozutheme:quickcompile'
	]);

	grunt.registerTask('check', [
		'buildTheme'
	, 'checklabels'
	, 'checkwidgets'
	, 'checksettings'
	, 'checkreferences'
	]);

	grunt.registerTask('build', [
		'buildTheme'
	, 'lintify'
	, 'checkreferences'
	, 'zubat'
	, 'setver:release'
	, 'compress'
	]);

	grunt.registerTask('emails', [
		'lintify'
	, 'email-settings'
	, 'email-lessify'
	, 'less:emails'
	, 'juice'
	, 'email-strainer'
	, 'email-delessify'
	, 'compress'
	]);

	grunt.registerTask('push', [
		'buildTheme'
	, 'lintify'
	// , 'mozutheme:check'
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


	grunt.registerTask('buildTheme', [
		'widgetize'
	, 'build-settings'
	, 'build-pagetypes'
	]);

};
