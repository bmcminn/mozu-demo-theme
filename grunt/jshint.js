
module.exports = {

  theme_js: [
    'Gruntfile.js'
  , 'build.js'
  , 'scripts/**/*.js'
  ],

  options: {
    ignores: [
      'scripts/vendor/**/*.js'
    , 'build.js'
    ]

  , undef: true
  , laxcomma: true
  , unused: false
  , globals: {
      console: true
    , window: true
    , document: true
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
