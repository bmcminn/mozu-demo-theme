
var paths = {
			labels:   './labels'
		, emailSrc: './src_emails'
		, emails:   './templates/email'
		, extraCSS: './grunt/assets/email.css'
		}
	, grunt = require('grunt')
	, extraCSS = grunt.file.exists(paths.extraCSS) ? grunt.file.read(paths.extraCSS) : ''
	;

module.exports = {

	emails: {

		options: {
			paths: paths,
			extraCss: extraCSS
		},

		files: [
			{
				expand: true,
				cwd: paths.emailSrc + '/',
				src: [
					'**/*.hypr*'
				],
				dest: paths.emails + '/',
				ext: '.hypr'
			}
		]
	}

};
