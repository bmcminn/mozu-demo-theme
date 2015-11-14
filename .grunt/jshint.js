
module.exports = {

	theme_js: [
	  'scripts/**/*.js'
  , '.components/**/*.js'
  , '!.components/**/vendor/**/*.js'
	, '!scripts/vendor/**/*.js'
	],


  buildtools_js: [
      'gruntfile.js'
    , '.grunt/**/*.js'
    , '.tasks/**/*.js'
    ],

	options: {
		ignores: [
			'build.js'
		]

	, undef: true
	, laxcomma: true
	, laxbreak: true
	, unused: false
	, globals: {
			console: true
		, window: true
		, document: true
		, grunt: true
		, navigator: true
    , Ext: true
    , Taco: true  // TODO: get rid of TACO..
		, Image: true
		, V: true
		, setTimeout: true
		, order: true
		, typeOf: true
		, clearTimeout: true
		, module: true
		, define: true
		, require: true
		, Modernizr: true
		, process: true
		}
	}

};
