
var paths = {
			labels:   './labels'
		, emailSrc: './.components/emails'
		, emailDest:   './templates/email'
		, extraCSS: './.grunt/assets/email.css'
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
				dest: paths.emailDest + '/',
				ext: '.hypr'
			}
		]
	}

};
