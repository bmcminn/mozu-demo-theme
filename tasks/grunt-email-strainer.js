"use strict";

var path  = require('path')
	, chalk = require('chalk')
	, temp = {}
	;


temp.lessTarget = './stylesheets/email.less';
temp.lessGen    = './stylesheets/src_email.less'

module.exports = function (grunt) {

	// Generate parsable email.less file
	grunt.registerTask('email-lessify', "Process email.less as needed.", function() {

		var emails = {};

		emails.basepath = '@import "';

		emails.less   = grunt.file.read(temp.lessTarget);

		emails.less = emails.less.replace(/(@import\s*"(?:\.|\/)*stylesheets\/)/gi, emails.basepath);
		emails.less = emails.less.replace(/\.less/gi, '');

		grunt.file.write(temp.lessGen, emails.less);
		grunt.log.ok(chalk.cyan(temp.lessGen), 'written to disc.');
	});


	// Remove generated parsable email.less file
	grunt.registerTask('email-delessify', "Process email.less as needed.", function() {

		if (grunt.file.exists(temp.lessGen)) {
			grunt.file.delete(temp.lessGen);
			grunt.log.ok(chalk.cyan(temp.lessGen), 'deleted...');
		} else {
			grunt.log.warn(chalk.cyan(temp.lessGen), "doesn't exist...");
		}
	});


	// filters out unnecessary tags from email partials
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
