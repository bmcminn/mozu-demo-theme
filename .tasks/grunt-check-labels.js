/* jshint laxbreak:true, laxcomma:true */
/* global module, require, __dirname */

module.exports = function(grunt) {

  'use strict';

  // load modules
  var helpers = require('./helpers.js')
    , jsonify = helpers.jsonify

    , _       = require('lodash')
    , chalk   = require('chalk')
    , path    = require('path')
    , EOL     = require('os').EOL
    , theme   = grunt.file.readJSON('./theme.json')

    , temp
    ;


  // rename task
  grunt.registerTask(
    'check:labels'
  , 'Static analysis missing label references in theme files'
  , function() {

      var files   = grunt.file.expand('templates/**/*.hypr*')
        , i18ns   = grunt.file.expand('labels/**/*.json')
        , labels  = []
        , passed  = true
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


      grunt.log.debug('labels found:', jsonify(labels));

      // iterate over each language file we've defined and validate it
      _.each(i18ns, function(i18n) {
        var lang  = i18n.match(/\/([\S]+.json)$/)[1]
          ;

        grunt.log.writeln('');
        grunt.log.ok('Checking', chalk.yellow(i18n));
        grunt.log.ok('--------------------------------------------------');

        // get the language file
        i18n = grunt.file.readJSON(i18n);

        // reset passed flag for each label file check
        passed = true;


        // iterate over the labels collection we pulled from our templates and make sure they are defined
        _.each(labels, function(label) {

          if (!i18n[label.label]) {

            // set fail condition
            passed = false;

            var maxLength = 24
              , refFile = label.file
              , labelString = 'labels.'+label.label
              , message = ''
              , spaceDepth = 30
              , spacer = labelString.length > spaceDepth ? null : new Array(Math.abs(spaceDepth-labelString.length)).join(' ')
              ;

            message = [
                chalk.bgCyan.black(labelString)
              , spacer
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


        // setup messaging for end of task
        if (passed) {
          grunt.log.ok('Looks good to me! :)');

        } else {
          grunt.log.writeln('');
          grunt.log.warn("Looks like you've got some more work to do...");
          grunt.log.writeln('');

        }

      });


      grunt.log.writeln('');
      grunt.log.writeln('');


      grunt.log.writeln('');

  });
};
