
module.exports = {

	install: {
		options: {
			targetDir: './scripts/vendor',
			layout: 'byComponent',
			cleanBowerDir: true,
			bowerOptions: {
				production: true,
				forceLatest: true
			}
		}
	}

};
