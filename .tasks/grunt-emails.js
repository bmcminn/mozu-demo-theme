
var _     = require('lodash')
  , path  = require('path')
  , chalk = require('chalk')
  , temp  = {}

  , helpers = require('./helpers.js')
  , jsonify = helpers.jsonify

  , paths = {
      themeJson:  path.resolve('.', 'theme.json')
    , emailConf:  path.resolve('.', '.components', 'emails', 'emailTemplates.json')
    , lessTarget: path.resolve('.', 'stylesheets', 'email.less')
    , lessGen:    path.resolve('.', 'stylesheets', 'src_email.less')
    }
  ;


/**
 * [exports description]
 * @param  {object}   grunt The initial grunt instance
 * @return {function}       [description]
 */
module.exports = function (grunt) {

  'use strict';

  /**
   * [writeJSON description]
   * @param  {[type]} path [description]
   * @param  {[type]} data [description]
   * @return null
   */
  grunt.file.writeJSON = function(path, data) {
    grunt.file.write(path, JSON.stringify(data, null, 2));
  };



  /**
   * [description]
   * @param  {Object} )                                      {    var                                  emails                                                [description]
   * @param  {[type]} emails.basepath)      .replace(/.less/gi, '')     ;   grunt.file.write(paths.lessGen, emails.less);   grunt.log.ok(chalk.cyan(paths.lessGen) [description]
   * @param  {[type]} 'written                               to                                       disc.');  }                                           [description]
   * @return {[type]}                                        [description]
   */
  grunt.registerTask('email-lessify', "Process email.less as needed.", function() {

    var emails = {};

    emails.basepath = '@import "';

    emails.less = grunt.file.read(paths.lessTarget);

    emails.less = emails.less
      .replace(/(@import\s*"(?:\.|\/)*stylesheets\/)/gi, emails.basepath)
      .replace(/\.less/gi, '')
      ;

    grunt.file.write(paths.lessGen, emails.less);
    grunt.log.ok(chalk.cyan(paths.lessGen), 'written to disc.');

  });



  /**
   * Update email configs to theme.json
   * @param  {[type]} ) {   var       theme [description]
   * @return {[type]}   [description]
   */
  grunt.registerTask('email-settings', "Add email configs to theme.json", function() {

    var theme       = require(paths.themeJson)
      , emailConfig = grunt.file.readJSON(paths.emailConf)
      ;

    // init or ovewrite emailTemplates object in theme.json
    theme.emailTemplates = emailConfig;

    grunt.log.subhead('Loading email configs into', chalk.cyan('theme.json'));
    grunt.file.writeJSON(paths.themeJson, theme);

  });



  /**
   * Remove generated parsable email.less file
   * @param  {[type]} ) {   if        (grunt.file.exists(paths.lessGen)) {      grunt.file.delete(paths.lessGen);     grunt.log.ok(chalk.cyan(paths.lessGen), 'deleted...');    } else {      grunt.log.warn(chalk.cyan(paths.lessGen), "doesn't exist...");    } } [description]
   * @return {[type]}   [description]
   */
  grunt.registerTask('email-delessify', "Process email.less as needed.", function() {

    if (grunt.file.exists(paths.lessGen)) {
      grunt.file.delete(paths.lessGen);
      grunt.log.ok(chalk.cyan(paths.lessGen), 'deleted...');
    } else {
      grunt.log.warn(chalk.cyan(paths.lessGen), "doesn't exist...");
    }
  });



  /**
   * Filters out unnecessary tags from email partials
   * @param  {[type]} partials) {   grunt.file.expand(partials).map(function(filePath) {      var oldHtml [description]
   * @return {[type]}           [description]
   */
  grunt.registerTask('email-strainer', "Remove unnecessary HTML tags in email partials.", function () {

    var conf = {};

    conf.emailsPath  = path.resolve('.', 'templates', 'email', '*.hypr');

    grunt.file
      .expand(conf.emailsPath)
      .map(function(filePath) {

        var oldHtml = grunt.file.read(filePath),

        newHtml = oldHtml
          .replace(/<html><body+\s+[^>]*>/g, '')
          .replace('</body></html>', '')
          ;

        grunt.file.write(filePath, newHtml);

        grunt.log.ok('File"', chalk.cyan(filePath), '"filtered.');

      })
    ;


    grunt.log.oklns('Email partials are now pulp-free and ready for production.');

  });

};
