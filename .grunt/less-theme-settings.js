module.exports = {

	options: {
		stylesheets: "./stylesheets/**/*.less"
	},

	main: {

		files: {
			"./.grunt/assets/storefront.less": "./stylesheets/storefront.less"
		, "./.grunt/assets/email.less": "./stylesheets/src_email.less"
		}
	}

};
