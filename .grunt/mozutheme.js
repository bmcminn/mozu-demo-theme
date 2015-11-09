
module.exports = {

	'check': {},
	'compile': {},
	'update': {
		'versionRange': '<%= pkg.config.baseThemeVersion %>'
	},
	'quickcompile': {
		'command': 'compile',
		'opts': {
			'skipminification': true
		}
	}

};
