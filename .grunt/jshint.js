
module.exports = {
  production: {
    src: [
      'theme.json',
      'theme-ui.json',
      'labels/**/*.json',
      'gruntfile.js',
      'scripts/**/*.js'
    ]
  },
  dev: {
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
