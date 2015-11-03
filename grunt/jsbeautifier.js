
var path = require('path')
	;


module.exports = {

	default: {
		src : [
			path.resolve('./scripts/**/*.js')
		],
		options: {
			config: "./.jsbeautifyrc",
			mode: 'VERIFY_AND_WRITE'
		}
	},

	'git-pre-commit': {
		src : [
			path.resolve('./scripts/**/*.js')
		],
		options : {
			mode:'VERIFY_ONLY'
		}
	}

};
