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
		;

	// load JSON.minify
	JSON.minify = jsonHelper.minify;


	grunt.registerTask('gather-pagetypes', 'Gather pagetype configs into theme.json.', function() {

		var theme         = grunt.file.readJSON('theme.json')
			, pageTypeConfs = grunt.file.expand(path.resolve('.', 'confs', 'pageTypes', '*.json'))
			;


		// init or reset the pageTypes collection in theme.json
		theme.pageTypes = [];


		grunt.log.subhead('Merging pageType configurations from', chalk.cyan('confs/pageTypes') + chalk.white('...'));


		// foreach pagetype, push it into the theme.json pageTypes collection
		grunt.log.debug(pageTypeConfs);

		_.each(pageTypeConfs, function(fileLoc) {
			theme.pageTypes.push(grunt.file.readJSON(fileLoc));
		});


		// write theme.json back to the file system
		grunt.file.write(path.resolve('.', 'theme.json'), JSON.stringify(theme, null, 2));

	});
};
