/* jshint laxbreak:true, laxcomma:true */
/* global module, require, __dirname */

module.exports = function(grunt) {

	'use strict';


	// Widgetize me Cap'n!g
	// -----
	//
	// The goal of this script is simple; allow developers to separate their widget
	// assets into a compartmentalized widget directory structure and dyamically
	// allocate assets and configs into their respective locations for consumption
	// by the theme.


	// Features
	// -----
	// - keep track of widgets that are "loaded"
	//    - widgets are considered "loaded" if their asset folders are located
	//      within the `/widgets` directory
	// - dynamically inject .less imports into storefront.less
	// - dynamically inject widget.json configs into theme.json "widgets" collection


	// Load modules
	var _     = require('lodash')
		, chalk = require('chalk')
		, path  = require('path')
		;

	// load JSON.minify
	JSON.minify = function(string) {
		return JSON.parse(string.replace(/\/\/.+/g, ''));
	};


	grunt.registerTask('widgetize', 'Integrate individual widget configs into the theme project.', function() {

		var theme   = grunt.file.readJSON('theme.json')
			, gruntFolder = './grunt/assets'
			// , debug   = grunt.option('dbg') ? true : false

			, paths = {
					grunt: gruntFolder
				, less: './stylesheets'
				, assetsJson: path.resolve(gruntFolder, 'assets.json')
				, storefrontLess: path.resolve('./stylesheets', 'storefront.less')
				, dest: {
						hypr:   './templates/widgets',
						less:   './stylesheets/widgets',
						js:     './scripts/widgets',
						vendor: './scripts/vendor',
						icons:  './resources/admin/widgets'
					}
				}

			, assets    = []
			, lessFiles = []

			, basepathLength = path.resolve(__dirname, '..').length
			, currentDir
			, writeDir
			, temp

			, destPath = function(path) {
					return path.substr(basepathLength).replace(/\\/g, '/');
				}
			;


		// make widgets.less a standalone import for page.hypr
		lessFiles.push('// base styles/configs');
		lessFiles.push('@import "/stylesheets/base/colors.less";');
		lessFiles.push('@import "/stylesheets/base/variables.less";');
		lessFiles.push('');
		lessFiles.push('// widget imports');


		// check if there is a reference to widgets.less in page.hypr
		if (grunt.file.exists(path.resolve('.','tempaltes','page.hypr'))) {
			temp = grunt.file.read(path.resolve('.','tempaltes','page.hypr'));

			if (!temp.match('widgets.less')) {
				grunt.log.warn('You should add the following snippet to /templates/page.hypr:');
				grunt.log.warn(chalk.yellow(
      		'{{ "stylesheets/widgets.less"|stylesheet_tag("default") }}'
				));
			}

		} else {
			grunt.log.warn('You should probably add /templates/page.hypr to your theme.')
		}


		// get our assets listing and delete all files
		if (grunt.file.exists(paths.assetsJson)) {

			grunt.log.subhead('Deleting widget asset files');

			// delete all of our assets
			_.each(grunt.file.readJSON(paths.assetsJson), function(filepath) {
				grunt.log.warn('deleting:', chalk.red(destPath(filepath)));
				grunt.file.delete(filepath);
			});
		}


		// reset our data caches
		theme.widgets = [];
		assets = [];


		// iterate over each widget.json config we find
		_.each(grunt.file.expand('./src_widgets/**/widget.json'), function(widgetJsonFile) {

			// get our widget config
			temp  = JSON.minify(grunt.file.read(widgetJsonFile));
			// temp  = grunt.file.readJSON(widgetJsonFile);

			// get directory paths
			currentDir  = path.dirname(widgetJsonFile);
			writeDir    = path.dirname(temp.displayTemplate);


			grunt.log.subhead('Widget:', temp.displayName);


			// add our widget config to theme.json 'widgets'
			grunt.log.ok('appending widget config into', chalk.cyan('theme.json'), chalk.magenta('> widgets'));
			theme.widgets.push(temp);


			// iterate over all files in the widget directory
			grunt.file.recurse(currentDir, function(abspath, rootdir, subdir, filename) {

				// skip 'widget.json'
				if (filename === 'widget.json' && rootdir) {
					return;
				}

				// copy our vendor scripts
				if (subdir === 'vendor') {
					temp = path.resolve(paths.dest.vendor, filename);
					grunt.log.ok('copying', chalk.cyan(filename), 'to', chalk.yellow(destPath(temp)));
					grunt.file.copy(abspath, temp);
					assets.push(temp);
				}

				// copy our js files over
				if (subdir === undefined && filename.match(/\.js/)) {
					temp = path.resolve(paths.dest.js, filename);
					grunt.log.ok('copying', chalk.cyan(filename), 'to', chalk.yellow(destPath(temp)));
					grunt.file.copy(abspath, temp);
					assets.push(temp);
				}

				// copy our less files over
				if (filename.match(/\.less/)) {
					temp = path.resolve(paths.dest.less, filename);
					grunt.log.ok('copying', chalk.cyan(filename), 'to', chalk.yellow(destPath(temp)));
					grunt.file.copy(abspath, temp);
					lessFiles.push('@import "' + paths.dest.less.substr(1) + '/' + filename + '";');
					assets.push(temp);
				}

				// copy our hypr and hypr.live files over
				if (filename.match(/\.hypr(?:\.live)?/)) {
					temp = path.resolve(paths.dest.hypr, writeDir, filename);
					grunt.log.ok('copying', chalk.cyan(filename), 'into', chalk.yellow(destPath(temp)));
					grunt.file.copy(abspath, temp);
					assets.push(temp);
				}

				// copy our widget icons to our resources/admin/widgets directory
				if (filename.match(/\.(png|jpeg|jpg|gif)/)) {
					temp = path.resolve(paths.dest.icons, filename);
					grunt.log.ok('copying', chalk.cyan(filename), 'to', chalk.yellow(destPath(temp)));
					grunt.file.copy(abspath, temp);
					assets.push(temp);
				}

			});

		});


		grunt.log.subhead('Cacheing...');


		// write our assets.json data
		temp = path.resolve(paths.grunt, 'assets.json');
		grunt.log.ok('writing', chalk.cyan(destPath(temp)));
		grunt.file.write(temp, JSON.stringify(assets, null, 2));

		// write our widgets.less file
		temp = path.resolve(paths.less, 'widgets.less');
		grunt.log.ok('writing', chalk.cyan(destPath(temp)));
		grunt.file.write(temp, lessFiles.join('\n'));

		// write our changes to theme.json
		temp = path.resolve('theme.json');
		grunt.log.ok('writing', chalk.cyan(destPath(temp)));
		grunt.file.write(temp, JSON.stringify(theme, null, 2));

	});
};
