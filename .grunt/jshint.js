
var path  = require('path')
  , pkg   = require(path.resolve(process.cwd(), 'package.json'))
  ;


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

  options: '<%= pkg.jshintConfig %>'
};
