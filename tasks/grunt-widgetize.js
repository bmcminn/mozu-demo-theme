/* jshint laxbreak:true, laxcomma:true */
/* global module, require */

module.exports = function(grunt) {

  'use strict';


  // Widgetize me Cap'n!g
  // -----
  //
  // The goal of this script is simple; allow developers to separate their widget
  // assets into a compartmentalized widget directory structure and dyamically
  // allocate assets and configs into their respective locations for consumption
  // by the theme.


  // Features
  // -----
  // - keep track of widgets that are "loaded"
  //    - widgets are considered "loaded" if their asset folders are located
  //      within the `/widgets` directory
  // - dynamically inject .less imports into storefront.less
  // - dynamically inject widget.json configs into theme.json "widgets" collection


  // Load modules
  var _     = require('lodash')
    , chalk = require('chalk')
    ;


  // if our grunt directory doesn't exist already, create it
  if (!grunt.file.exists('./.grunt')) {
    grunt.file.mkdir('./.grunt');
  }


  grunt.registerTask('widgetize', 'Integrate individual widget configs into the theme project.', function() {

    var theme   = grunt.file.readJSON('theme.json')
      // , debug   = grunt.option('dbg') ? true : false

      , getPath = function(absPath) {
          absPath  = absPath.split('/');
          absPath.pop();
          return absPath.join('/') + '/';
        }

      , path = {
          grunt: './.grunt/'
        , less: './stylesheets/'
        , dest: {
            hypr:   './templates/widgets/',
            less:   './stylesheets/widgets/',
            js:     './scripts/widgets/',
            vendor: './scripts/vendor/'
          }
        }

      , assets    = []
      , lessFiles = []

      , currentDir
      , writeDir
      , temp
      ;


    // determine if widgets.less is imported via storefront.less
    if (grunt.file.exists(path.less + 'storefront.less')) {

      // get storefront.less from the core theme we're extending
      temp = grunt.file.read(path.less + 'storefront.less');

      // if we haven't imported 'widgest.less' yet
      if (!temp.match(/widgets\.less/)) {

        // append the "custom widgets" section so we can inject stuff
        temp += [
          '',
          '// Imported Widgets',
          '@import "' + path.less.substring(1) + 'widgets.less";'
        ].join('\n');

        grunt.log.ok('adding import for', chalk.cyan('widgets.less'), 'to', chalk.cyan('storefront.less'));

        // write our file to the stylesheets directory
        grunt.file.write(path.less + 'storefront.less', temp);

      }

    } else {

      // error out that the developer should copy this over from their reference theme
      grunt.log.warn(chalk.cyan('storefront.less'), chalk.red('doesn\'t exist...'));
      grunt.log.warn(chalk.yellow('copy one from the core theme of your choice.'));
      return;
    }



    // get our assets listing and delete all files
    if (grunt.file.exists(path.grunt + 'assets.json')) {

      grunt.log.subhead('Deleting widget asset files');

      // delete all of our assets
      _.each(grunt.file.readJSON(path.grunt + 'assets.json'), function(filepath) {
        grunt.log.warn(chalk.red(filepath));
        grunt.file.delete(filepath);
      });
    }


    // reset our data caches
    theme.widgets = [];
    assets = [];


    // iterate over each widget.json config we find
    _.each(grunt.file.expand('./widgets/**/widget.json'), function(widgetJsonFile) {

      // get our widget config
      temp  = grunt.file.readJSON(widgetJsonFile);

      // get directory paths
      currentDir  = getPath(widgetJsonFile);
      writeDir    = getPath(temp.displayTemplate);


      grunt.log.subhead('Widget:', temp.displayName);


      // add our widget config to theme.json 'widgets'
      grunt.log.ok('appending widget config into', chalk.cyan('theme.json'), chalk.magenta('> widgets'));
      theme.widgets.push(temp);


      // iterate over all files in the widget directory
      grunt.file.recurse(currentDir, function(abspath, rootdir, subdir, filename) {

        // skip 'widget.json'
        if (filename === 'widget.json' && rootdir) {
          return;
        }

        // copy our vendor scripts
        if (subdir === 'vendor') {
          grunt.log.ok('copying', chalk.cyan(filename), 'into', chalk.yellow(path.dest.vendor));
          grunt.file.copy(abspath, path.dest.vendor + filename);
          assets.push(path.dest.vendor + filename);
        }

        // copy our js files over
        if (subdir === null && filename.match(/\.js/)) {
          grunt.log.ok('copying', chalk.cyan(filename), 'into', chalk.yellow(path.dest.js));
          grunt.file.copy(abspath, path.dest.js + filename);
          assets.push(path.dest.js + filename);
        }

        // copy our less files over
        if (filename.match(/\.less/)) {
          grunt.log.ok('copying', chalk.cyan(filename), 'into', chalk.yellow(path.dest.less));
          grunt.file.copy(abspath, path.dest.less + filename);
          lessFiles.push('@import "' + path.dest.less.substr(1) + filename + '";');
          assets.push(path.dest.less + filename);
        }

        // copy our hypr and hypr.live files over
        if (filename.match(/\.hypr(?:\.live)?/)) {
          grunt.log.ok('copying', chalk.cyan(filename), 'into', chalk.yellow(path.dest.hypr + writeDir));
          grunt.file.copy(abspath, path.dest.hypr + filename);
          assets.push(path.dest.hypr + filename);
        }

      });

    });


    grunt.log.subhead('Cacheing...');

    // write our assets.json data
    grunt.log.ok('writing', chalk.cyan(path.grunt.substr(2) + 'assets.json'));
    grunt.file.write(path.grunt + 'assets.json', JSON.stringify(assets, null, 2));

    // write our widgets.less file
    grunt.log.ok('writing', chalk.cyan(path.dest.less.substr(2) + 'widgets.less'));
    grunt.file.write(path.less + 'widgets.less', lessFiles.join('\n'));

    // write our changes to theme.json
    grunt.log.ok('writing', chalk.cyan('theme.json'));
    grunt.file.write('theme.json', JSON.stringify(theme, null, 2));

  });
};
