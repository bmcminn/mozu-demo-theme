/* jshint laxbreak:true, laxcomma:true */
/* global module, require, process */

module.exports = function(grunt) {

  'use strict';

  // TODO: figure out how to parse themeSetting references from theme-ui.json and widget configs

  // load modules
  var _     = require('lodash')
    , chalk = require('chalk')
    , path  = require('path')
    , EOL   = require('os').EOL
    , temp

    , helpers = require('./helpers.js')
    , jsonify = helpers.jsonify
    ;


  grunt.log.debugHeading = function(message) {
    grunt.log.writeln('');
    grunt.log.debug(message);
    grunt.log.debug(new Array(message.length+1).join('-'));
    grunt.log.writeln('');
  };


  // rename task
  grunt.registerTask(
    'check:settings'
  , 'Static analysis missing theme setting references in theme files'
  , function() {

      var settings  = []
        , passed    = true
        , files     = grunt.file.expand([
              'templates/**/*.hypr*'
            , 'scripts/**/*.js'
            , 'stylesheets/**/*.less'
            // , '!templates/widgets/**/*.hypr*'
            // , '!scripts/widgets/**/*.js'
            // , '!stylesheets/widgets/**/*.less'
            // , '.components/**/*.json'
            // , '.components/**/*.less'
            // , '.components/**/*.hypr'
            ])

      , theme = grunt.file.readJSON(path.resolve('.', 'theme.json'))
      ;


      // get all the theme settings
      settings = theme.settings;


      // iterate over each file for references to theme settings
      grunt.log.debugHeading('Looking for theme setting references');

      _.each(files, function(filePath) {

        // check if isDir (because typeahead.js/...)
        if (grunt.file.isDir(filePath)) {
          return;
        }

        var file = {
              location:   filePath
            , content:    grunt.file.read(path.resolve('.', filePath))
            , ext:        path.extname(filePath).replace(/\./, '')
            }
          ;


        // for each file type, process the necessary themeSetting accessor
        switch(file.ext) {
          case 'js':
            file.settings = file.content.match(/getThemeSetting\((['"\w\d]{1,})\)/gi);
            break;

          case 'hypr':
          case 'live':
          case 'less':
            file.settings = file.content.match(/themeSettings\.([\w\d]{1,})/gi);
            break;
        }


        // if we found file settings
        if (file.settings) {

          grunt.log.debug(
            chalk.yellow(file.location)
          , jsonify(file.settings)
          );


          // iterate against each one and validate if they exist
          _.each(file.settings, function(setting) {

            var settingName;

            // for JS files
            if (file.ext == 'js') {
              settingName = setting.replace(/getThemeSetting|[\(\)\'\"]/gi, '');

            // for everything else
            } else {
              settingName = setting.replace(/themeSettings\./gi, '');

            }


            // check if we have defined the current theme setting
            if (!settings[''+settingName+''] && settings[''+settingName+''] !== false) {

              passed = false;

              grunt.log.warn([
                chalk.bgYellow.bold.black(settingName)
              , 'is not defined'
              , chalk.magenta('>>')
              , 'referenced in'
              , chalk.red(file.location)
              ].join(' '));

            }

          });

        }

      });


      // grunt.log.writeln('');

      // setup messaging for end of task
      if (passed) {
        grunt.log.ok('Looks good to me! :)');
      } else {
        grunt.log.warn(EOL, EOL, "Looks like you've got some more work to do...");
      }

    });

};
