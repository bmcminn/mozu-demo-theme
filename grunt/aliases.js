// grunt/tasks/default.js

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
	]);


	grunt.registerTask('check', [
		'theme'
	, 'checklabels'
	, 'checkwidgets'
	, 'checksettings'
	]);


	// DEPRECATED
	// grunt.registerTask('build', [
	//  'theme'
	// , 'lintify'
	// , 'zubat'
	// , 'setver'
	// , 'compress'
	// ]);


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
		'theme'
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


	grunt.registerTask('theme', [
		'widgetize'
	, 'theme-about'
	, 'theme-settings'
	, 'theme-pagetypes'
	]);

};
