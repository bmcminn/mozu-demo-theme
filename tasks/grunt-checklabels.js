/* jshint laxbreak:true, laxcomma:true */
/* global module, require, __dirname */

module.exports = function(grunt) {

  'use strict';

  // load modules
  var _     = require('lodash')
    , chalk = require('chalk')
    , path  = require('path')
    , EOL   = require('os').EOL
    , theme = grunt.file.readJSON('./theme.json')
    ;

  // rename task
  grunt.registerTask(
    'checklabels'
  , 'Checks your template files for label references that don\'t exist'
  , function() {

      var files   = grunt.file.expand('templates/**/*.hypr*')
        , i18ns   = grunt.file.expand('labels/**/*.json')
        , core    = theme.about.extends
        , labels  = []
        ;

      // iterate over our template files and build a collectoin of labels we find
      _.each(files, function(file) {
        var matches = grunt.file.read(file).match(/(labels\..+?)[\)\%\}\|]/gi) || []
          ;

        // if we have labels
        if (matches.length>0) {
          _.each(matches, function(label) {
            labels.push({
              label: label
                      .replace(/\s+|[\)\%\}\|]/g, '')
                      .replace(/labels\./gi, '')
            , file: file
            });
          });
        }

      });

      grunt.log.debug('labels found:', JSON.stringify(labels, null, 2));

      // iterate over each language file we've defined and validate it
      _.each(i18ns, function(i18n) {
        var lang      = i18n.match(/\/([\S]+.json)$/)[1]
          , coreFile  = ''
          ;

        grunt.log.ok(
          'Checking'
        , chalk.yellow(i18n)
        );

        // check if we're extending the core theme and grab the original i18n file if available
        if (core && core.match(/core/)) {
          coreFile = path.resolve(process.cwd(), 'references', core, 'labels', lang);

          // if the core label file doesn't exist
          if (!grunt.file.exists(coreFile)) {

            // we'll just ignore it
            coreFile = null;
          }
        }


        // merge the current labels file into the core file we found
        if (coreFile) {
          i18n = _.merge(
            grunt.file.readJSON(coreFile) || {}
          , grunt.file.readJSON(i18n)
          );
        // or just get the current labels file contents
        } else {
          i18n = grunt.file.readJSON(i18n);
        }


        // iterate over the labels collection we pulled from our templates and make sure they are defined
        _.each(labels, function(label) {
          if (!i18n[label.label]) {
            var maxLength = 24
              , refFile = label.file
              , label = 'labels.'+label.label
              , message = ''
              ;

            if (label.length < maxLength) {
              label += Array(maxLength-label.length).join(' ');
            }

            message = [
                chalk.cyan(label)
              , 'is not defined in'
              , chalk.yellow(lang)
              ].join(' ')
              ;

            grunt.log.warn(
              message
            , chalk.magenta('>>')
            , 'referenced in'
            , chalk.red(refFile)
            );
          }
        });

        grunt.log.writeln('');

      });
  });
};
