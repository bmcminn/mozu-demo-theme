/* jshint laxbreak:true, laxcomma:true */
/* global module, require, process */

module.exports = function(grunt) {

  'use strict';

  // load modules
  var _     = require('lodash')
    , chalk = require('chalk')
    , fs    = require('grunt').file
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



  var MESSAGE = require('./messages.js');



  // rename task
  grunt.registerTask(
    'check:deprecated'
  , 'Static analysis missing theme setting references in theme files'
  , function() {

      var settings  = []
        , passed    = true
        , files     = fs.expand([
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

      , theme = fs.readJSON(path.resolve('.', 'theme.json'))






      , regex = {
          HYPR_FILTER: /\|[\w_]+\([\s\S]*\)/gi
        // , HYPR_DEPRECATED_FILTERS: /\|[\w_]+(\:)[\w\d \S\'\"]+/gi
        , HYPR_DEPRECTATED_TAGS: new RegExp([
              '(?:\{\%|\{\{)\s*('
            , require('./deprecated-tags.js').join('|')
            , ')'
            ].join(''), 'gi')
        , HYPR_DEPRECTATED_FILTERS: new RegExp([
              '\|('
            , require('./deprecated-filters.js').join('|')
            , ')'
            ].join(''), 'gi')
        , HYPR_DEPRECTATED_FILTER_FORMAT: /\|[\w]+\:(?:['"][\w\S]+['"]|null|true|false|[\w\.]{1,})/gi
        }
      ;


      console.log(regex.HYPR_DEPRECTATED_TAGS);
      console.log(regex.HYPR_DEPRECTATED_FILTERS);

      return;

      // get all the theme settings
      settings = theme.settings;



      // iterate over all templates
      var templates = fs.expand(path.resolve('templates', '**', '*.hypr*'));

      _.each(templates, function(filepath, index) {

        var file = {
              content: fs.read(filepath).split('\n')
            }

        _.each(file.content, function(line, number) {

          number += 1; // make sure we're reading non-zero line numbers

          if (line.match(regex.HYPR_DEPRECATED_FILTER_FORMAT)) {
            var newLine = line
              .match(regex.HYPR_DEPRECATED_FILTER_FORMAT)
              ;

            newLine = newLine[0]
              .replace(/\:/, chalk.bgRed.white(':'))
              ;

            grunt.log.error(MESSAGE.DEPRECATED_FILTER, newLine, number);
            grunt.log.warn('file name:', chalk.cyan(filepath));
            grunt.log.writeln('');
          }

        })

        // console.log(file.content);

      });





      // // iterate over each file for references to theme settings
      // grunt.log.debugHeading('Looking for theme setting references');

      // _.each(files, function(filePath) {

      //   var file = {
      //         location:   filePath
      //       , content:    fs.read(path.resolve('.', filePath))
      //       , ext:        path.extname(filePath).replace(/\./, '')
      //       }
      //     ;


      //   // for each file type, process the necessary themeSetting accessor
      //   switch(file.ext) {
      //     case 'js':
      //       file.settings = file.content.match(/getThemeSetting\((['"\w\d]{1,})\)/gi);
      //       break;

      //     case 'hypr':
      //     case 'live':
      //     case 'less':
      //       file.settings = file.content.match(/themeSettings\.([\w\d]{1,})/gi);
      //       break;
      //   }

      //   // if we found file settings
      //   if (file.settings) {

      //     grunt.log.debug(
      //       chalk.yellow(file.location)
      //     , jsonify(file.settings)
      //     );


      //     // iterate against each one and validate if they exist
      //     _.each(file.settings, function(setting) {

      //       var settingName;

      //       // for JS files
      //       if (file.ext == 'js') {
      //         settingName = setting.replace(/getThemeSetting|[\(\)\'\"]/gi, '');

      //       // for everything else
      //       } else {
      //         settingName = setting.replace(/themeSettings\./gi, '');

      //       }


      //       // check if we have defined the current theme setting
      //       if (!settings[''+settingName+''] && settings[''+settingName+''] !== false) {

      //         passed = false;

      //         grunt.log.warn([
      //           chalk.bgYellow.bold.black(settingName)
      //         , 'is not defined'
      //         , chalk.magenta('>>')
      //         , 'referenced in'
      //         , chalk.red(file.location)
      //         ].join(' '));

      //       }

      //     });

      //   }

      // });


      // grunt.log.writeln('');

      // setup messaging for end of task
      if (passed) {
        grunt.log.ok('Looks good to me! :)');
      } else {
        grunt.log.warn(EOL, EOL, "Looks like you've got some more work to do...");
      }

    });

};
