
module.exports = {

	options: {
		applicationKey: '<%= mozuconfig.workingApplicationKey %>'
	, context: '<%= mozuconfig %>'
	, 'watchAdapters': [
			{
				'src': 'mozusync.upload.src',
				'action': 'upload'
			},
			{
				'src': 'mozusync.del.remove',
				'action': 'delete'
			}
		]
	}

, upload: {
		options: {
			action: 'upload'
		, noclobber: true
		}

	, src: [
			'theme*.json'
		, '*thumb.png'
		, '*thumb.jpg'

		, 'admin/**/*'
		, 'compiled/**'
		, 'labels/**'
		, 'resources/**'
		, 'scripts/**'
		, 'stylesheets/**'
		, 'templates/**'
			// '**',
			// '**/*',
			// '!node_modules/**',
			// '!references/**',
			// '!tasks/**',
			// '!configure.js',
			// '!Gruntfile.js',
			// '!mozu.config.json',
			// '!*.zip'
		]
	, filter: 'isFile'
	}

, del: {
		options: {
			action: 'delete'
		}
	, src: '<%= mozusync.upload.src %>'
	, filter: 'isFile'
	, remove: [

		]
	}

, wipe: {
		options: {
			action: 'deleteAll'
		}
	, src: '<%= mozusync.upload.src %>'
	}

};
