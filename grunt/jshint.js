
module.exports = {

  theme_js: [
    'gruntfile.js'
  , 'grunt/**/*.js'
  , 'scripts/**/*.js'
  , '!scripts/vendor/**/*.js'
  ],

  options: {
    ignores: [
      'build.js'
    ]

  , undef: true
  , laxcomma: true
  , unused: false
  , globals: {
      console: true
    , window: true
    , document: true
    , grunt: true
    , setTimeout: true
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
