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


	/**
	 * [writeJSON description]
	 * @param  {[type]} path [description]
	 * @param  {[type]} data [description]
	 * @return null
	 */
	grunt.file.writeJSON = function(path, data) {
		grunt.file.write(path, JSON.stringify(data, null, 2));
	};



	/**
	 * [description]
	 * @return null
	 */
	grunt.registerTask('theme-about', 'Inserts theme About data into theme config', function() {

		var theme = grunt.file.readJSON(paths.themeJson)
			, about = grunt.file.readJSON(path.resolve('.', 'components', 'about.json'))
			, contract = {
			    name: about.projectName + ' v' + about.version,
			    projectName: "Mozu Theme",
			    version: "0.0.1",
			    defaultLanguage: "en-US",
			    baseCoreVersion: 8,
			    extends: null,
			    isDesktop: true,
			    isTablet: true,
			    isMobile: true,
			    allowProduction: true
				}
			;

		// init or reset the about collection in theme.json
		grunt.log.subhead('Getting about data from', chalk.cyan('components/about.json') + chalk.white('...'));

		grunt.log.debug(JSON.stringify(about, null, 2));

		// asign the new about collection to theme settings
		theme.about = _.merge(contract, about);

		// write the theme.json file updates to disk
		grunt.file.writeJSON(paths.themeJson, theme);

	});



	/**
	 * Compiles all JSON configs in components/themeSettings and writes them to theme.json as the new "settings" property.
	 * @return null
	 */
	grunt.registerTask('theme-settings', 'Aggregates all theme settings configs.', function() {

		var theme     = grunt.file.readJSON(paths.themeJson)
			, settings  = grunt.file.expand(path.resolve('.', 'components', 'themeSettings', '*.json'))
			;

		// init or reset the settings collection in theme.json
		theme.settings = {};

		grunt.log.subhead('Merging themeSettings from', chalk.cyan('components/themeSettings') + chalk.white('...'));

		grunt.log.debug(JSON.stringify(settings, null, 2));

		// iterate over each theme settings config and merge them into the settings collection
		_.each(settings, function(settingsFile) {
			settingsFile = grunt.file.readJSON(settingsFile);
			theme.settings = _.merge(theme.settings, settingsFile);
		});

		grunt.file.writeJSON(paths.themeJson, theme);

	});



	/**
	 * Compiles all components/pageTypes configs
	 * @return null
	 */
	grunt.registerTask('theme-pagetypes', 'Gather pagetype configs into theme.json.', function() {

		var theme     = grunt.file.readJSON(paths.themeJson)
			, pageTypes = grunt.file.expand(path.resolve('.', 'components', 'pageTypes', '*.json'))
			;

		// init or reset the pageTypes collection in theme.json
		theme.pageTypes = [];

		grunt.log.subhead('Merging pageType configurations from', chalk.cyan('components/pageTypes') + chalk.white('...'));

		grunt.log.debug(JSON.stringify(pageTypes, null, 2));

		// iterate over each pagetype config and push it into the pageTypes collection
		_.each(pageTypes, function(fileLoc) {
			theme.pageTypes.push(grunt.file.readJSON(fileLoc));
		});

		// write theme.json back to the file system
		grunt.file.write(path.resolve('.', 'theme.json'), JSON.stringify(theme, null, 2));

	});



};
