module.exports = function(grunt) {

  'use strict';

  // Grunt themeSettingsLess
  // -----
  //
  // In prep for the Mozu theme engine update for LESS, we'll write a trasnpiler
  // that groks our themeSettings into a less variables file that we can use to
  // locally compile and validate our styles


  // Load modules
  var path  = require('path')
    , _     = require('lodash')
    , chalk = require('chalk')
    ;


  // // if our grunt directory doesn't exist already, create it
  // if (!grunt.file.exists('./grunt/assets')) {
  //   grunt.file.mkdir('./grunt/assets');
  // }


  grunt.registerMultiTask('less-theme-settings', 'Transpile a list of veriables from our themeSettings for local less compilation.', function() {

    var pkg         = grunt.file.readJSON('package.json')
      , theme       = grunt.file.readJSON('theme.json')
      , debug       = grunt.option('dbg') ? true : false
      , extendsRef  = theme.about.extends

      , variables   = []

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

      // break up the camel casing and hyphenate our variables
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
          // break;
      }

      string = temp + ': ' + value + ';';

      grunt.log.debug(chalk.white.bgMagenta(string));
      variables.push(string);

    });



    // get all files that have {{ themeSettings in them }}
    temp = {};
    temp.options = this.options();


    temp.lessFiles = grunt.file.expand(temp.options.stylesheets);

    console.log(temp.lessFiles);


    // write temp variables.less file
    grunt.file.write('./.grunt/assets/variables.less', variables.join('\n'));
    grunt.log.ok(
        'writing'
      , chalk.yellow('"grunt/assets/variables.less"...')
      );


    // iterate over each target
    _.each(this.files, function(file) {

      file.srcFile = file.src[0];

      var less    = grunt.file.read(file.srcFile).split('\n')
        , imports = []
        ;


      // iterate against each import in our .less file
      _.each(less, function(importPath, row) {

        // if this isn't an import, lets get out of here
        if (!importPath.match(/\@import/)) {
          imports.push(importPath);
          return;
        }

        temp = {};

        // get the import path
        temp.importPath = importPath.replace(/.+"([\/a-z0-9-_]+\.less).+/, "$1");

        // if import doesn't exist in our theme
        if (!grunt.file.exists('.' + temp.importPath)) {

          // and if we don't extend another theme, error out
          if (!extendsRef) {
            grunt.fail.fatal(temp.importPath + ' doesn\'t exist...');
          }

          // if the file exists in our inherited theme
          if (grunt.file.exists('./references/' + extendsRef + temp.importPath)) {
            string = '@import "../references/' + extendsRef + temp.importPath + '";';
          }

        // otherwise leave it as-is
        } else {
          temp.relPath = path
              .relative(file.srcFile, file.dest)
              .toString()
              .replace(/\\/g, '/')
              .replace(/\/\w[\S]*/, '')
              ;

          string = ['@import "', temp.relPath, temp.importPath, '";'].join('');
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
      grunt.file.write(file.dest, less.join('\n'));

      grunt.log.ok(
          'writing'
        , chalk.yellow('"' + file.dest + '"...')
        );




    });

  });
};
