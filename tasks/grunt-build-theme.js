/* jshint laxbreak:true, laxcomma:true */
/* global module, require, __dirname */

module.exports = function(grunt) {

	'use strict';


	// Widgetize me Cap'n!g
	// -----
	//
	// The goal of this script is


	// Features
	// -----
	// -


	// Load modules
	var _           = require('lodash')
		, path        = require('path')
		, chalk       = require('chalk')
		, jsonHelper  = require('./helpers-json.js')

		, paths = {
				themeJson: path.resolve('theme.json')
			}
		;

	// load JSON.minify
	JSON.minify = jsonHelper.minify;



	grunt.registerTask('build-settings', 'Aggregates all theme settings configs.', function() {


		/**
		 * [writeJSON description]
		 * @param  {[type]} path [description]
		 * @param  {[type]} data [description]
		 * @return null
		 */
		grunt.file.writeJSON = function(path, data) {
			grunt.file.write(path, JSON.stringify(data, null, 2));
		};



		var theme     = grunt.file.readJSON(paths.themeJson)
			, settings  = grunt.file.expand(path.resolve('.', 'components', 'themeSettings', '*.json'))
			;

		theme.settings = {};

		grunt.log.subhead('Merging themeSettings from', chalk.cyan('components/themeSettings') + chalk.white('...'));

		_.each(settings, function(settingsFile) {

			settingsFile = grunt.file.readJSON(settingsFile);
			theme.settings = _.merge(theme.settings, settingsFile);

		})

		grunt.file.writeJSON(paths.themeJson, theme);

	});






	/**
	 * [description]
	 * @param  {[type]} )                     {		var       theme [description]
	 * @param  {[type]} JSON.stringify(theme, null,         2)    [description]
	 * @return {[type]}                       [description]
	 */
	grunt.registerTask('build-pagetypes', 'Gather pagetype configs into theme.json.', function() {

		var theme         = grunt.file.readJSON(paths.themeJson)
			, pageTypeConfs = grunt.file.expand(path.resolve('.', 'components', 'pageTypes', '*.json'))
			;


		// init or reset the pageTypes collection in theme.json
		theme.pageTypes = [];


		grunt.log.subhead('Merging pageType configurations from', chalk.cyan('components/pageTypes') + chalk.white('...'));


		// foreach pagetype, push it into the theme.json pageTypes collection
		grunt.log.debug(pageTypeConfs);

		_.each(pageTypeConfs, function(fileLoc) {
			theme.pageTypes.push(grunt.file.readJSON(fileLoc));
		});


		// write theme.json back to the file system
		grunt.file.write(path.resolve('.', 'theme.json'), JSON.stringify(theme, null, 2));

	});
};
