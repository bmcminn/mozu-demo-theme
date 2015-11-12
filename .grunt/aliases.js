// grunt/tasks/default.js

// TODO: clean out old tooling processes

module.exports = function(grunt) {

	grunt.registerTask('init', [
		'default'
	, 'checklabels'
	, 'checkwidgets'
	, 'checksettings'
	]);


	grunt.registerTask('default', [
		'theme'
	, 'lintify'
	, 'setver'
	, 'mozutheme:quickcompile'
	, 'mozusync:upload'
	]);


	grunt.registerTask('check', [
		'theme'
	, 'checklabels'
	, 'checkwidgets'
	, 'checksettings'
	]);


	grunt.registerTask('emails', [
		'lintify'
	, 'email-settings'
	, 'email-lessify'
	, 'less:emails'
	, 'juice'
	, 'email-strainer'
	, 'email-delessify'
	, 'mozusync:upload'
	]);


	grunt.registerTask('reset', [
		'mozusync:wipe'
	, 'mozusync:upload'
	]);


	grunt.registerTask('lintify', [
		'jsonlint'
	, 'jshint'
	]);


	grunt.registerTask('theme', [
		'widgetize'
	, 'compile-theme'
	]);

};
