
module.exports = {

	options: {
		mode: 'zip'
	},

	build: {
		options: {
			archive: 'theme-files.zip',
			pretty: true
		},
		files: [
			{
				src: [
					'compiled/**',
					'labels/**',
					'resources/**',
					'scripts/**',
					'stylesheets/**',
					'templates/**',
					'LICENSE',
					'theme.json',
					'theme-ui.json',
					'thumb.png'
				],
				dest: '/'
			}
		]
	}

};
