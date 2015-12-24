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
      , files:        expands.themeSettings
      , renderTarget: paths.themeJson
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
      , files:        expands.backofficeTemplates
      , renderTarget: paths.themeJson
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
      , files:        expands.pageTypes
      , renderTarget: paths.themeJson
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

      // asign the new about collection to theme settings
      theme.about = _.merge(contract, about);

      // write the theme.json file updates to disk
      grunt.file.writeJSON(paths.themeJson, theme);

    });



  /**
   * [description]
   * @return null
   */
  grunt.registerTask(
    'theme:editors'
  , 'Gathers up all editor configs and assets to disseminate into theme folders.'
  , function() {
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

        // add in the editor config to theme.json
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
      , files:        expands.themeUISettings
      , mergeType:    'push'
      , baseModel:    { "title": "Navigation" }
      , subhead: [
          'Merging theme-ui from'
        , chalk.cyan('.components/theme-ui') + chalk.white('...')
        ].join(' ')
      });

    });

};
