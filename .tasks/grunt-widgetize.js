/* jshint laxbreak:true, laxcomma:true */
/* global module, require, __dirname */

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
  var _           = require('lodash')
    , chalk       = require('chalk')
    , path        = require('path')
    , jsonHelper  = require(process.cwd() + '/.tasks/helpers-json.js')
    ;

  grunt.registerTask(
    'widgetize'
  , 'Integrate individual widget configs into the theme project.'
  , function() {

    // load JSON.minify
    JSON.minify = jsonHelper.minify;

    var theme   = grunt.file.readJSON('theme.json')
      , gruntFolder = path.resolve('.','.grunt', 'assets')
      // , debug   = grunt.option('dbg') ? true : false

      , paths = {
          grunt: gruntFolder
        , less: './stylesheets'
        , widgetAssets: path.resolve(gruntFolder, 'widget-assets.json')
        , storefrontLess: path.resolve('./stylesheets', 'storefront.less')
        , dest: {
            labels: './labels',
            hypr:   './templates/widgets',
            less:   './stylesheets/widgets',
            js:     './scripts/widgets',
            vendor: './scripts/vendor',
            icons:  './resources/admin/widgets'
          }
        , widgetsSrc: path.resolve('.', '.components', 'widgets', '**', 'widget.json')
        , pageHypr: path.resolve('.','templates','page.hypr')
        }

      , assets    = []
      , lessFiles = []
      , labels    = {}

      , basepathLength = path.resolve(__dirname, '..').length
      , currentDir
      , writeDir
      , temp

      , destPath = function(path) {
          return path.substr(basepathLength).replace(/\\/g, '/');
        }
      ;


    // make widgets.less a standalone import for page.hypr
    lessFiles.push('// base styles/configs');
    lessFiles.push('@import "/stylesheets/base/colors.less";');
    lessFiles.push('@import "/stylesheets/base/variables.less";');
    lessFiles.push('');
    lessFiles.push('// widget imports');


    // check if there is a reference to widgets.less in page.hypr
    if (grunt.file.exists(paths.pageHypr)) {
      temp = grunt.file.read(path.resolve('.','templates','page.hypr'));

      if (!temp.match('widgets.less')) {
        grunt.log.warn('You should add the following snippet to /templates/page.hypr:');
        grunt.log.warn(chalk.yellow(
          '{{ "stylesheets/widgets.less"|stylesheet_tag("default") }}'
        ));
      }

    } else {
      grunt.log.warn('You should probably add /templates/page.hypr to your theme.');
    }


    // get our assets listing and delete all files
    if (grunt.file.exists(paths.widgetAssets)) {

      grunt.log.subhead('Deleting widget asset files');

      // delete all of our assets
      _.each(grunt.file.readJSON(paths.widgetAssets), function(filepath) {
        grunt.log.warn('deleting:', chalk.red(destPath(filepath)));

        // some widgets use duplicated assets like icons and templates
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('file already deleted:', chalk.yellow(destPath(filepath)));
        } else {
          grunt.file.delete(filepath);
        }
      });
    }


    // reset our data caches
    theme.widgets = [];
    assets = [];


    // labels files
    labels.origin = grunt.file.expand(path.resolve('.', 'labels', '*.json'));
    labels.langs  = [];

    _.each(labels.origin, function(lang) {
      labels.langs.push({
        name:   path.basename(lang, '.json')
      , labels: grunt.file.readJSON(lang)
      });
    });


    // iterate over each widget.json config we find
    _.each(grunt.file.expand(paths.widgetsSrc), function(widgetJsonFile) {

      // get our widget config
      var widgetDef = "";

      widgetDef = grunt.file.read(widgetJsonFile);
      widgetDef = widgetDef.replace(/^[\s\t]*\/\/.+/gmi, '');
      widgetDef = JSON.parse(widgetDef);


      // get directory paths
      currentDir  = path.dirname(widgetJsonFile);
      writeDir    = path.dirname(widgetDef.displayTemplate);


      grunt.log.subhead('Widget:', _.unescape(widgetDef.displayName.replace(/<\/?\w+>/g, '')));


      // add our widget config to theme.json 'widgets'
      grunt.log.ok('appending widget config into', chalk.cyan('theme.json'), chalk.magenta('> widgets'));
      theme.widgets.push(widgetDef);


      // merge label definitions
      grunt.log.ok('merging label definitions');

      // collect all widget labels files
      labels.files  = grunt.file.expand(path.resolve(currentDir, 'labels', '*.json'));

      // iterate over labels files
      _.each(labels.files, function(langFile) {

        var ext       = path.basename(langFile, '.json')
          , langIndex =
              _.findIndex(labels.langs, function(lang) {
                return lang.name == ext;
              })
          ;

        // if the lang file doesn't exist, generate it
        if (!labels.langs[langIndex]) {
          labels.langs.push({
            name: ext
          , labels: {}
          });

          // reindex our new langs def
          langIndex =
            _.findIndex(labels.langs, function(lang) {
              return lang.name == ext;
            });
        }

        labels.langs[langIndex].labels = _.merge(labels.langs[langIndex].labels, grunt.file.readJSON(langFile));

      });


      // iterate over all files in the widget directory
      grunt.file.recurse(currentDir, function(abspath, rootdir, subdir, filename) {


        // skip 'widget.json'
        if (filename === 'widget.json' && rootdir) {
          return;
        }

        // copy our vendor scripts
        if (subdir === 'vendor') {
          temp = path.resolve(paths.dest.vendor, filename);
          grunt.log.ok('copying', chalk.cyan(filename), 'to', chalk.yellow(destPath(temp)));
          grunt.file.copy(abspath, temp);
          assets.push(temp);
        }

        // copy our js files over
        if (subdir === undefined && filename.match(/\.js$/)) {
          temp = path.resolve(paths.dest.js, filename);
          grunt.log.ok('copying', chalk.cyan(filename), 'to', chalk.yellow(destPath(temp)));
          grunt.file.copy(abspath, temp);
          assets.push(temp);
        }

        // copy our less files over
        if (filename.match(/\.less$/)) {
          temp = path.resolve(paths.dest.less, filename);
          grunt.log.ok('copying', chalk.cyan(filename), 'to', chalk.yellow(destPath(temp)));
          grunt.file.copy(abspath, temp);
          lessFiles.push('@import "' + paths.dest.less.substr(1) + '/' + filename + '";');
          assets.push(temp);
        }

        // copy our hypr and hypr.live files over
        if (filename.match(/\.hypr(?:\.live)?$/)) {
          temp = path.resolve(paths.dest.hypr, writeDir, filename);
          grunt.log.ok('copying', chalk.cyan(filename), 'into', chalk.yellow(destPath(temp)));
          grunt.file.copy(abspath, temp);
          assets.push(temp);
        }

        // TODO: task for copying images into theme

        // copy our widget icons to our resources/admin/widgets directory
        if (subdir === undefined && filename.match(/\.(png|jpeg|jpg|gif)$/)) {
          temp = path.resolve(paths.dest.icons, filename);
          grunt.log.ok('copying', chalk.cyan(filename), 'to', chalk.yellow(destPath(temp)));
          grunt.file.copy(abspath, temp);
          assets.push(temp);
        }

      });

    });


    // write all labels we updated
    grunt.log.subhead('Writing new labels files...');

    _.each(labels.langs, function(lang) {
      temp = path.resolve(paths.dest.labels, lang.name+'.json');
      grunt.log.ok('writing', chalk.cyan(destPath(temp)));
      grunt.file.write(temp, JSON.stringify(lang.labels, null, 2));
    });


    grunt.log.subhead('Cacheing...');


    // write our assets.json data
    temp = paths.widgetAssets;
    grunt.log.ok('writing', chalk.cyan(destPath(temp)));
    grunt.file.write(temp, JSON.stringify(assets, null, 2));

    // write our widgets.less file
    temp = path.resolve(paths.less, 'widgets.less');
    grunt.log.ok('writing', chalk.cyan(destPath(temp)));
    grunt.file.write(temp, lessFiles.join('\n'));

    // write our changes to theme.json
    temp = path.resolve('theme.json');
    grunt.log.ok('writing', chalk.cyan(destPath(temp)));
    grunt.file.write(temp, JSON.stringify(theme, null, 2));

  });
};
