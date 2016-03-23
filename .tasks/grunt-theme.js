/* jshint laxbreak:true, laxcomma:true */
/* global module, require, process, __dirname */

module.exports = function(grunt) {

  'use strict';

  // Load modules
  var _           = require('lodash')
    , path        = require('path')
    , fs          = grunt.file
    , chalk       = require('chalk')
    , jsonHelper  = require('./helpers-json.js')

    , PATHS = {
        ABOUT_JSON:             path.resolve(process.cwd(), '.theme', 'about', 'about.json')
      , THEME_JSON:             path.resolve(process.cwd(), 'theme.json')
      , THEME_UI_JSON:          path.resolve(process.cwd(), 'theme-ui.json')
      , ADMIN_EDITORS:          path.resolve(process.cwd(), 'admin', 'editors')
      }

    , GLOBS = {
        THEME_SETTINGS:         path.resolve(process.cwd(), '.theme', 'settings', '*.json')
      , PAGE_TYPES:             path.resolve(process.cwd(), '.theme', 'pageTypes', '*.json')
      , BACKOFFICE_TEMPLATES:   path.resolve(process.cwd(), '.theme', 'backOfficeTemplates', '*.json')
      , EDITORS:                path.resolve(process.cwd(), '.theme', 'editors', '**', '*.json')
      , LAYOUT_WIDGETS:         path.resolve(process.cwd(), '.theme', 'layoutWidgets', '**', '*.json')
      , THEME_UI_SETTINGS:      path.resolve(process.cwd(), '.theme-ui', '*.json')
      }
    ;


  // load JSON.minify
  JSON.minify = jsonHelper.minify;


  function checkForThemes() {
    if (!fs.exists(PATHS.THEME_JSON)) {
      fs.write(PATHS.THEME_JSON, JSON.stringify({}));
    }

    if (!fs.exists(PATHS.THEME_UI_JSON)) {
      fs.write(PATHS.THEME_UI_JSON, JSON.stringify({}));
    }
  }



  /**
   * [writeJSON description]
   * @param  {[type]} path [description]
   * @param  {[type]} data [description]
   * @return null
   */
  fs.writeJSON = function(path, data, spaces) {
    if (!spaces) {
      spaces = 4;
    }
    fs.write(path, JSON.stringify(data, null, spaces));
  };



  // initialize a mozu object on the grunt instance we can bind stuff to
  grunt.mozu = {};



  /**
   * [mergeThemeComponents description]
   * @param  {[type]} config [description]
   * @return {[type]}        [description]
   */
  grunt.mozu.mergeThemeComponents = function(overrides) {

    // merge config with overrides
    var config = _.merge({
          target:       null  // theme.[target here]
        , renderTarget: null  // file path of rendered file
        , files:        null  // location where
        , baseModel:    null  // supply your own base model object
        , subhead:      null  // message to the user what you're doing
        , mergeType:    null  // push or merge
        }, overrides)
      ;

    // message the client
    grunt.log.subhead(config.subhead);

    // setup variables
    var renderModel = config.baseModel || fs.readJSON(config.renderTarget)
      , targetFiles = fs.expand(config.files)
      ;

    // init or reset the settings collection in renderModel.json
    renderModel[config.target] = config.mergeType === 'push' ? [] : {};

    // iterate over each renderModel settings config and merge them into the
    //  settings collection
    _.each(targetFiles, function(targetFile) {
      targetFile = fs.readJSON(targetFile);

      // push targetFile results to target
      if (config.mergeType === 'push') {
        renderModel[config.target].push(targetFile);
      }

      // merge targetFile results to target
      if (config.mergeType === 'merge') {
        renderModel[config.target] = _.merge(renderModel[config.target], targetFile);
      }

    });

    // write renderModel back to system
    fs.writeJSON(config.renderTarget, renderModel);

  };



  /**
   * [description]
   * @return null
   */
  grunt.registerTask(
    'theme:settings'
  , 'Aggregates all theme settings configs.'
  , function() {



      grunt.mozu.mergeThemeComponents({
        target:       'settings'
      , files:        GLOBS.THEME_SETTINGS
      , renderTarget: PATHS.THEME_JSON
      , mergeType:    'merge'
      , subhead: [
          'Merging .theme/ from'
        , chalk.cyan('.theme/settings/') + chalk.white('...')
        ].join(' ')
      });

    });



  /**
   * [description]
   * @return null
   */
  grunt.registerTask(
    'theme:about'
  , 'Inserts theme About data into theme config'
  , function() {

      checkForThemes();

      var theme = fs.readJSON(PATHS.THEME_JSON) || {}
        , about = fs.readJSON(PATHS.ABOUT_JSON)
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
      grunt.log.subhead('Getting about config from', chalk.cyan('.theme/about.json') + chalk.white('...'));

      // asign the new about collection to theme settings
      theme.about = _.merge(contract, about);

      // write the theme.json file updates to disk
      fs.writeJSON(PATHS.THEME_JSON, theme);

    });



  /**
   * [description]
   * @return null
   */
  grunt.registerTask(
    'theme:backoffice'
  , 'Aggregates all backoffice configs.'
  , function() {

      grunt.mozu.mergeThemeComponents({
        target:       'backOfficeTemplates'
      , files:        GLOBS.BACKOFFICE_TEMPLATES
      , renderTarget: PATHS.THEME_JSON
      , mergeType:    'push'
      , subhead: [
          'Merging backofficeTemplates from'
        , chalk.cyan('.theme/backOfficeTemplates/') + chalk.white('...')
        ].join(' ')
      });

    });



  /**
   * [description]
   * @return null
   */
  grunt.registerTask(
    'theme:layoutWidgets'
  , 'Aggregates all layoutWidget configs.'
  , function() {

      grunt.mozu.mergeThemeComponents({
        target:       'layoutWidgets'
      , files:        GLOBS.LAYOUT_WIDGETS
      , renderTarget: PATHS.THEME_JSON
      , mergeType:    'push'
      , subhead: [
          'Merging layoutWidgets from'
        , chalk.cyan('.theme/layoutWidgets/') + chalk.white('...')
        ].join(' ')
      });

    });



  /**
   * Compiles all components/pageTypes configs
   * @return null
   */
  grunt.registerTask(
    'theme:pagetypes'
  , 'Gather pagetype configs into theme.json.'
  , function() {

      grunt.mozu.mergeThemeComponents({
        target:       'pageTypes'
      , files:        GLOBS.PAGE_TYPES
      , renderTarget: PATHS.THEME_JSON
      , mergeType:    'push'
      , subhead: [
          'Merging pageTypes from'
        , chalk.cyan('.theme/pageTypes/') + chalk.white('...')
        ].join(' ')
      });

    });



  /**
   * [description]
   * @return null
   */
  grunt.registerTask(
    'theme:editors'
  , 'Gathers up all editor configs and assets to disseminate into theme folders.'
  , function() {

      checkForThemes();

      var theme   = fs.readJSON(PATHS.THEME_JSON)
        , editors = fs.expand(GLOBS.EDITORS)
        ;

      // init or reset the target collection
      theme.editors = [];

      grunt.log.subhead('Merging editors configurations from', chalk.cyan('.theme/editors/') + chalk.white('...'));

      _.each(editors, function(fileLoc) {
        // push the config back into theme.json
        var editorJson  = fs.readJSON(fileLoc)
          , editorJS    = fs.expand(path.resolve(path.dirname(fileLoc), '*.js'))[0]
          ;

        // add in the editor config to theme.json
        theme.editors.push(editorJson);

        // check if the
        if (path.basename(editorJS) !== editorJson.path) {
          grunt.log.debug('file:', path.basename(editorJS), '!== editor.path:', editorJson.path);
          grunt.log.debug('expected:', editorJS);

        // copy the editor file to the editors directory
        } else {
          fs.copy(editorJS, path.resolve(PATHS.ADMIN_EDITORS, editorJson.path));

        }

      });

      // write theme back to system
      fs.writeJSON(PATHS.THEME_JSON, theme);

    });



  /**
   * Compiles all components/pageTypes configs
   * @return null
   */
  grunt.registerTask(
    'theme:ui'
  , 'Gather theme-ui configs into theme-ui.json.'
  , function() {

      grunt.mozu.mergeThemeComponents({
        target:       'items'
      , renderTarget: PATHS.THEME_UI_JSON
      , files:        GLOBS.THEME_UI_SETTINGS
      , mergeType:    'push'
      , baseModel:    { "title": "Navigation" }
      , subhead: [
          'Merging theme-ui from'
        , chalk.cyan('.theme-ui/') + chalk.white('...')
        ].join(' ')
      });

    });

};
