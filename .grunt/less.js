module.exports = {

	options: {
		paths: [
			"./stylesheets"
		]
	, compress: true
	},

	emails: {
		files: {
			'./.grunt/assets/email.css': './stylesheets/src_email.less'
		}
	}

};
