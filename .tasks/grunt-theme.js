/* jshint laxbreak:true, laxcomma:true */
/* global module, require, __dirname */

module.exports = function(grunt) {

  'use strict';

  // Load modules
  var _           = require('lodash')
    , path        = require('path')
    , chalk       = require('chalk')
    , jsonHelper  = require('./helpers-json.js')

    , paths = {
        themeJson:            path.resolve('.', 'theme.json')
      , themeUIJSON:          path.resolve('.', 'theme-ui.json')
      , aboutJson:            path.resolve('.', '.components', 'about.json')
      , editorsJS:            path.resolve('.', 'admin', 'editors')
      }

    , expands = {
        themeSettings:        path.resolve('.', '.components', 'theme-settings', '*.json')
      , themeUISettings:      path.resolve('.', '.components', 'theme-ui', '*.json')
      , pageTypes:            path.resolve('.', '.components', 'page-types', '*.json')
      , backofficeTemplates:  path.resolve('.', '.components', 'backoffice-templates', '*.json')
      , editors:              path.resolve('.', '.components', 'editors', '**', '*.json')
      }
    ;


  // load JSON.minify
  JSON.minify = jsonHelper.minify;


  /**
   * [writeJSON description]
   * @param  {[type]} path [description]
   * @param  {[type]} data [description]
   * @return null
   */
  grunt.file.writeJSON = function(path, data) {
    grunt.file.write(path, JSON.stringify(data, null, 2));
  };


  grunt.mozu = {};


  /**
   * [mergeThemeComponents description]
   * @param  {[type]} config [description]
   * @return {[type]}        [description]
   */
  grunt.mozu.mergeThemeComponents = function(overrides) {

    var config = {
          target:     null  // theme.[target here]
        , files:      null  // location where
        , subhead:    null  // message to the user what you're doing
        , mergeType:  null  // push or merge
        }
      ;

    // merge config with overrides
    config = _.merge(config, overrides);

    // message the client
    grunt.log.subhead(config.subhead);


    // setup variables
    var theme       = grunt.file.readJSON(paths.themeJson)
      , targetFiles = grunt.file.expand(config.files)
      ;


    // init or reset the settings collection in theme.json
    if (config.mergeType === 'push') {

      // init or reset the target collection
      theme[config.target] = [];

    }


    if (config.mergeType === 'merge') {

      // init or reset target object
      theme[config.target] = {};

      // iterate over each theme settings config and merge them into the settings collection
      _.each(targetFiles, function(targetFile) {
        targetFile = grunt.file.readJSON(targetFile);

        theme[config.target] = _.merge(theme[config.target], targetFile);
      });

    }





    // write theme back to system
    // grunt.file.writeJSON(paths.themeJson, theme);

    console.log(config);
  };




  /**
   * Compiles all JSON configs in components/themeSettings and writes them to theme.json as the new "settings" property.
   * @return null
   */
  grunt.registerTask('theme-settings', 'Aggregates all theme settings configs.', function() {

    grunt.mozu.mergeThemeComponents('theme settings', {
      target:     'settings'
    , files:      expands.themeSettings
    , mergeType:  {}
    , subhead: [
        'Merging themeSettings from'
      , chalk.cyan('.components/theme-settings') + chalk.white('...')
      ].join(' ')
    });


    // var theme     = grunt.file.readJSON(paths.themeJson)
    //   , settings  = grunt.file.expand(expands.themeSettings)
    //   ;

    // // init or reset the settings collection in theme.json
    // theme.settings = {};

    // grunt.log.subhead('Merging themeSettings from', chalk.cyan('.components/theme-settings') + chalk.white('...'));

    // grunt.log.debug(JSON.stringify(settings, null, 2));

    // // iterate over each theme settings config and merge them into the settings collection
    // _.each(settings, function(settingsFile) {
    //   settingsFile = grunt.file.readJSON(settingsFile);
    //   theme.settings = _.merge(theme.settings, settingsFile);
    // });

    // // write theme back to system
    // grunt.file.writeJSON(paths.themeJson, theme);

  });




  /**
   * [description]
   * @return null
   */
  grunt.registerTask('theme-about', 'Inserts theme About data into theme config', function() {

    var theme = grunt.file.readJSON(paths.themeJson)
      , about = grunt.file.readJSON(paths.aboutJson)
      , contract = {
          name: about.projectName + ' v' + about.version,
          projectName: "Mozu Theme",
          version: "0.0.1",
          defaultLanguage: "en-US",
          baseCoreVersion: 8,
          extends: null,
          isDesktop: true,
          isTablet: true,
          isMobile: true,
          allowProduction: true
        }
      ;

    // init or reset the about collection in theme.json
    grunt.log.subhead('Getting about data from', chalk.cyan('.components/about.json') + chalk.white('...'));

    grunt.log.debug(JSON.stringify(about, null, 2));

    // asign the new about collection to theme settings
    theme.about = _.merge(contract, about);

    // write the theme.json file updates to disk
    grunt.file.writeJSON(paths.themeJson, theme);

  });



  /**
   * Compiles all components/pageTypes configs
   * @return null
   */
  grunt.registerTask('theme-pagetypes', 'Gather pagetype configs into theme.json.', function() {

    var theme     = grunt.file.readJSON(paths.themeJson)
      , pageTypes = grunt.file.expand(expands.pageTypes)
      ;

    // init or reset the target collection
    theme.pageTypes = [];

    grunt.log.subhead('Merging pageType configurations from', chalk.cyan('.components/page-types') + chalk.white('...'));

    grunt.log.debug(JSON.stringify(pageTypes, null, 2));

    // iterate over each pagetype config and push it into the pageTypes collection
    _.each(pageTypes, function(fileLoc) {
      theme.pageTypes.push(grunt.file.readJSON(fileLoc));
    });

    // write theme.json back to the file system
    grunt.file.write(path.resolve('.', 'theme.json'), JSON.stringify(theme, null, 2));

  });






  /**
   * [description]
   * @return null
   */
  grunt.registerTask('theme-editors', 'Gathers up all editor configs and assets to disseminate into theme folders.', function() {
    var theme   = grunt.file.readJSON(paths.themeJson)
      , editors = grunt.file.expand(expands.editors)
      ;

    // init or reset the target collection
    theme.editors = [];

    grunt.log.subhead('Merging pageType configurations from', chalk.cyan('.components/editors') + chalk.white('...'));

    _.each(editors, function(fileLoc) {
      // push the config back into theme.json
      var editorJson  = grunt.file.readJSON(fileLoc)
        , editorJS    = grunt.file.expand(path.resolve(path.dirname(fileLoc), '*.js'))[0]
        ;

      // grunt.log.debug(editorJS);

      theme.editors.push(editorJson);

      // check if the
      if (path.basename(editorJS) !== editorJson.path) {
        grunt.log.debug('file:', path.basename(editorJS), '!== editor.path:', editorJson.path);
        grunt.log.debug('expected:', editorJS);

      // copy the editor file to the editors directory
      } else {
        grunt.file.copy(editorJS, path.resolve(paths.editorsJS, editorJson.path));

      }

    });

    // write theme back to system
    grunt.file.writeJSON(paths.themeJson, theme);

  });


	// /**
	//  * Compiles all JSON configs in components/themeSettings and writes them to theme.json as the new "settings" property.
	//  * @return null
	//  */
	// grunt.registerTask('theme-settings', 'Aggregates all theme settings configs.', function() {

	//  var theme     = grunt.file.readJSON(paths.themeJson)
	//    , settings  = grunt.file.expand(path.resolve('.', '.components', 'themeSettings', '*.json'))
	//    ;

	//  // init or reset the settings collection in theme.json
	//  theme.settings = {};

	//  grunt.log.subhead('Merging themeSettings from', chalk.cyan('.components/themeJson/themeSettings') + chalk.white('...'));

	//  grunt.log.debug(JSON.stringify(settings, null, 2));

	//  // iterate over each theme settings config and merge them into the settings collection
	//  _.each(settings, function(settingsFile) {
	//    settingsFile = grunt.file.readJSON(settingsFile);
	//    theme.settings = _.merge(theme.settings, settingsFile);
	//  });

	//  grunt.file.writeJSON(paths.themeJson, theme);

	// });



	// /**
	//  * Compiles all components/pageTypes configs
	//  * @return null
	//  */
	// grunt.registerTask('theme-pagetypes', 'Gather pagetype configs into theme.json.', function() {

	//  var theme     = grunt.file.readJSON(paths.themeJson)
	//    , pageTypes = grunt.file.expand(path.resolve('.', '.components', 'themeJson', 'pageTypes', '*.json'))
	//    ;

	//  // init or reset the pageTypes collection in theme.json
	//  theme.pageTypes = [];

	//  grunt.log.subhead('Merging pageType configurations from', chalk.cyan('.components/themeJson/pageTypes') + chalk.white('...'));

	//  grunt.log.debug(JSON.stringify(pageTypes, null, 2));

	//  // iterate over each pagetype config and push it into the pageTypes collection
	//  _.each(pageTypes, function(fileLoc) {
	//    theme.pageTypes.push(grunt.file.readJSON(fileLoc));
	//  });

	//  // write theme.json back to the file system
	//  grunt.file.write(path.resolve('.', 'theme.json'), JSON.stringify(theme, null, 2));

	// });



};
