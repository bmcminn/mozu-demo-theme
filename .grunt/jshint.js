
module.exports = {
  production: {
    src: [
      'theme.json',
      'theme-ui.json',
      'labels/**/*.json',
      'Gruntfile.js',
      'scripts/**/*.js'
    ]
  },
  develop: {
    src: '{<%= jshint.production.src %>}',
    options: {
      devel: true
    }
  },
  options: {
    es3: true,
    browser: true,
    undef: true,
    laxcomma: true,
    laxbreak: true,
    nonstandard: true,
    ignores: ['scripts/vendor/**/*.js'],
    globals: {
      console: true,
      V: true,
      JSON: true,
      define: true,
      require: true,
      Modernizr: true,
      process: true,
      module: true,
      order: true
    }
  }
}

// module.exports = {

//  theme_js: [
//    'scripts/**/*.js'
//   , '.components/**/*.js'
//   , '!.components/**/vendor/**/*.js'
//  , '!scripts/vendor/**/*.js'
//  ],


//   buildtools_js: [
//       'gruntfile.js'
//     , '.grunt/**/*.js'
//     , '.tasks/**/*.js'
//     ],

//  options: {
//    ignores: [
//      'build.js'
//    ]

//  , undef: true
//  , laxcomma: true
//  , laxbreak: true
//  , unused: false
//  , globals: {
//      console: true
//    , window: true
//    , document: true
//    , grunt: true
//    , navigator: true
//     , Ext: true
//     , Taco: true  // TODO: get rid of TACO..
//    , Image: true
//    , V: true
//    , setTimeout: true
//    , typeOf: true
//    , clearTimeout: true
//    , define: true
//    , require: true
//    , Modernizr: true
//    }
//  }

// };
