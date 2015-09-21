"use strict";

var path  = require('path')
	, chalk = require('chalk')
	, temp = {}

	, helpers = require('./helpers.js')
	, jsonify = helpers.jsonify
	;


temp.lessTarget = './stylesheets/email.less';
temp.lessGen    = './stylesheets/src_email.less'

module.exports = function (grunt) {


	/**
	 * Generate parsable email.less file
	 * @param  {Object} )                              {		var       emails      [description]
	 * @param  {[type]} emails.basepath);		emails.less [description]
	 * @param  {[type]} 'written                       to            disc.');	} [description]
	 * @return {[type]}                                [description]
	 */
	grunt.registerTask('email-lessify', "Process email.less as needed.", function() {

		var emails = {};

		emails.basepath = '@import "';

		emails.less = grunt.file.read(temp.lessTarget);

		emails.less = emails.less.replace(/(@import\s*"(?:\.|\/)*stylesheets\/)/gi, emails.basepath);
		emails.less = emails.less.replace(/\.less/gi, '');

		grunt.file.write(temp.lessGen, emails.less);
		grunt.log.ok(chalk.cyan(temp.lessGen), 'written to disc.');
	});



	/**
	 * Update email configs to theme.json
	 * @param  {[type]} ) {		var       theme [description]
	 * @return {[type]}   [description]
	 */
	grunt.registerTask('email-settings', "Add email configs to theme.json", function() {

		var theme = require(path.resolve('.', 'theme.json'))
			, config = require(path.resolve('.', 'src_emails', 'theme-emails.json'))
			;

		console.log(config);

	});



	/**
	 * Remove generated parsable email.less file
	 * @param  {[type]} ) {		if        (grunt.file.exists(temp.lessGen)) {			grunt.file.delete(temp.lessGen);			grunt.log.ok(chalk.cyan(temp.lessGen), 'deleted...');		} else {			grunt.log.warn(chalk.cyan(temp.lessGen), "doesn't exist...");		}	} [description]
	 * @return {[type]}   [description]
	 */
	grunt.registerTask('email-delessify', "Process email.less as needed.", function() {

		if (grunt.file.exists(temp.lessGen)) {
			grunt.file.delete(temp.lessGen);
			grunt.log.ok(chalk.cyan(temp.lessGen), 'deleted...');
		} else {
			grunt.log.warn(chalk.cyan(temp.lessGen), "doesn't exist...");
		}
	});



	/**
	 * Filters out unnecessary tags from email partials
	 * @param  {[type]} partials) {		grunt.file.expand(partials).map(function(filePath) {			var oldHtml [description]
	 * @return {[type]}           [description]
	 */
	grunt.registerTask('email-strainer', "Remove unnecessary HTML tags in email partials.", function (partials) {
		grunt.file.expand(partials).map(function(filePath) {
			var oldHtml = grunt.file.read(filePath),
			newHtml = oldHtml.replace(/<html><body+\s+[^>]*>/g, '').replace('</body></html>', '');

			grunt.file.write(filePath, newHtml);

			grunt.log.ok('File"', chalk.cyan(filePath), '"filtered.');
		});

		grunt.log.oklns('Email partials are now pulp-free and ready for production.');
	});

};
