'use strict';
module.exports = function(grunt) {

  // Grunt themeSettingsLess
  // -----
  //
  // In prep for the Mozu theme engine update for LESS, we'll write a trasnpiler
  // that groks our themeSettings into a less variables file that we can use to
  // locally compile and validate our styles


  // Load modules
  var _     = require('lodash')
    , chalk = require('chalk')
    ;


  // if our grunt directory doesn't exist already, create it
  if (!grunt.file.exists('./.grunt')) {
    grunt.file.mkdir('./.grunt');
  }


  grunt.registerTask('themeSettingsLess', 'Transpile a list of veriables from our themeSettings for local less compilation.', function() {

    var pkg         = grunt.file.readJSON('package.json')
      , theme       = grunt.file.readJSON('theme.json')
      , debug       = grunt.option('dbg') ? true : false
      , extendsRef  = theme.about.extends

      , variables = []

      , temp
      , string
      ;


    // if we're extending another theme, merge its settings with ours
    if (extendsRef) {
      temp = grunt.file.readJSON('./references/' + extendsRef + '/theme.json');
      theme.settings = _.merge(theme.settings, temp.settings);
      // console.log(JSON.stringify(theme.settings, null, 2));
      grunt.log.ok(
          'merging'
        , chalk.cyan(extendsRef)
        , 'settings with'
        , chalk.cyan('theme.json')
        , 'settings'
      );
    }


    // iterate over our theme settings and build a list of variables
    _.each(theme.settings, function(value, setting) {

      temp = setting.replace(/([A-Z])/g, '-$1').toLowerCase();

      switch(typeof value) {
        case 'string':

          // if it doesn't contain a hex code, percentage, has quotes, etc
          if (!value.match(/^#[\dA-F]|\%|\"|\'|px|r?em|%/i)) {
            value = '"' + value + '"';
          }
          break;

        // Everything else, just ignore
        case 'number':
        case 'object':
        case 'boolean':
          return;
          break;
      }

      string = '@theme-settings-' + temp + ': ' + value + ';';

      grunt.log.debug(chalk.white.bgMagenta(string));
      variables.push(string);

    });


    // get our storefront.less file
    var less    = grunt.file.read('./stylesheets/storefront.less').split('\n')
      , imports = []
      ;


    // iterate against each import in our storefront.less file
    _.each(less, function(importPath, row) {

      // if this isn't an import, lets get out of here
      if (!importPath.match(/\@import/)) {
        return;
      }

      // get the import path
      temp = importPath.replace(/.+"([\/a-z0-9-_]+\.less).+/, "$1");

      // if import doesn't exist in our theme
      if (!grunt.file.exists('.' + temp)) {

        // and if we don't extend another theme, error out
        if (!extendsRef) {
          grunt.fail.fatal(temp + ' doesn\'t exist...');
        }

        // if the file exists in our inherited theme
        if (grunt.file.exists('./references/' + extendsRef + temp)) {
          string = '@import "../references/' + extendsRef + temp + '";';
        }

      // otherwise leave it as-is
      } else {
        string = '@import "..' + temp + '";';
      }

      imports.push(string);
    });


    less = _.union(
        ['// compiled variables']
      , variables
      , ['', '', '// less imports', '']
      , imports
    );


    // write our cached files
    grunt.file.write('./.grunt/variables.less', variables.join('\n'));
    grunt.file.write('./.grunt/compiled-storefront.less', less.join('\n'));

    grunt.log.ok(
        'writing'
      , chalk.yellow('".grunt/variables.less"...')
      );

    grunt.log.ok(
        'writing'
      , chalk.yellow('".grunt/compiled-storefront.less"...')
      );

  });
};
