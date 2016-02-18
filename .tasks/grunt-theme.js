/* jshint laxbreak:true, laxcomma:true */
/* global module, require, __dirname */

module.exports = function(grunt) {

  'use strict';

  // Load modules
  var _           = require('lodash')
    , path        = require('path')
    , chalk       = require('chalk')
    , jsonHelper  = require('./helpers-json.js')

    , cwd         = process.cwd()

    , paths = {
        themeJSON:            path.resolve(cwd, 'theme.json')
      , themeUIJSON:          path.resolve(cwd, 'theme-ui.json')
      , adminEditors:         path.resolve(cwd, 'admin', 'editors')

      , aboutJSON:            path.resolve(cwd, '.theme', 'about', 'about.json')
      , themeSettings:        path.resolve(cwd, '.theme', 'settings', '*.json')
      , pageTypes:            path.resolve(cwd, '.theme', 'pageTypes', '*.json')
      , backofficeTemplates:  path.resolve(cwd, '.theme', 'backOfficeTemplates', '*.json')
      , editors:              path.resolve(cwd, '.theme', 'editors', '**', '*.json')
      , themeUISettings:      path.resolve(cwd, '.theme-ui', '*.json')
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
  grunt.file.writeJSON = function(path, data, spaces) {
    if (!spaces) {
      spaces = 2;
    }
    grunt.file.write(path, JSON.stringify(data, null, spaces));
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
    var renderModel = config.baseModel || grunt.file.readJSON(config.renderTarget)
      , targetFiles = grunt.file.expand(config.files)
      ;

    // init or reset the settings collection in renderModel.json
    renderModel[config.target] = config.mergeType === 'push' ? [] : {};

    // iterate over each renderModel settings config and merge them into the
    //  settings collection
    _.each(targetFiles, function(targetFile) {
      targetFile = grunt.file.readJSON(targetFile);

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
    grunt.file.writeJSON(config.renderTarget, renderModel);

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
      , files:        paths.themeSettings
      , renderTarget: paths.themeJSON
      , mergeType:    'merge'
      , subhead: [
          'Merging themeSettings from'
        , chalk.cyan('.components/theme-settings') + chalk.white('...')
        ].join(' ')
      });

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
      , files:        paths.backofficeTemplates
      , renderTarget: paths.themeJSON
      , mergeType:    'push'
      , subhead: [
          'Merging backofficeTemplates from'
        , chalk.cyan('.components/backoffice-templates') + chalk.white('...')
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
      , files:        paths.pageTypes
      , renderTarget: paths.themeJSON
      , mergeType:    'push'
      , subhead: [
          'Merging pageTypes from'
        , chalk.cyan('.components/page-types') + chalk.white('...')
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

      var theme = grunt.file.readJSON(paths.themeJSON)
        , about = grunt.file.readJSON(paths.aboutJSON)
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

      // asign the new about collection to theme settings
      theme.about = _.merge(contract, about);

      // write the theme.json file updates to disk
      grunt.file.writeJSON(paths.themeJSON, theme);

    });



  /**
   * [description]
   * @return null
   */
  grunt.registerTask(
    'theme:editors'
  , 'Gathers up all editor configs and assets to disseminate into theme folders.'
  , function() {
      var theme   = grunt.file.readJSON(paths.themeJSON)
        , editors = grunt.file.expand(paths.editors)
        ;

      // init or reset the target collection
      theme.editors = [];

      grunt.log.subhead('Merging editors configurations from', chalk.cyan('.components/editors') + chalk.white('...'));

      _.each(editors, function(fileLoc) {
        // push the config back into theme.json
        var editorJson  = grunt.file.readJSON(fileLoc)
          , editorJS    = grunt.file.expand(path.resolve(path.dirname(fileLoc), '*.js'))[0]
          ;

        // add in the editor config to theme.json
        theme.editors.push(editorJson);

        // check if the
        if (path.basename(editorJS) !== editorJson.path) {
          grunt.log.debug('file:', path.basename(editorJS), '!== editor.path:', editorJson.path);
          grunt.log.debug('expected:', editorJS);

        // copy the editor file to the editors directory
        } else {
          grunt.file.copy(editorJS, path.resolve(paths.adminEditors, editorJson.path));

        }

      });

      // write theme back to system
      grunt.file.writeJSON(paths.themeJSON, theme);

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
      , renderTarget: paths.themeUIJSON
      , files:        paths.themeUISettings
      , mergeType:    'push'
      , baseModel:    { "title": "Navigation" }
      , subhead: [
          'Merging theme-ui from'
        , chalk.cyan('.components/theme-ui') + chalk.white('...')
        ].join(' ')
      });

    });

};
