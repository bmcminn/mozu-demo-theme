'use strict';
module.exports = function(grunt) {

  // Widgetize me Cap'n!
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
  var _     = require('lodash')
    , chalk = require('chalk')
    ;


  // if our grunt directory doesn't exist already, create it
  if (!grunt.file.exists('./.grunt')) {
    grunt.file.mkdir('./.grunt');
  }


  grunt.registerTask('widgetize', 'Add/remove widget configs and assets from a central widget collection directory.', function() {

    var pkg     = grunt.file.readJSON('package.json')
      , theme   = grunt.file.readJSON('theme.json')
      , debug   = grunt.option('dbg') ? true : false

      , less = {
          src:          './references/' + theme.about.extends + '/stylesheets/storefront.less'
        , dest:         './stylesheets/storefront.less'
        , widgetsFile:  './stylesheets/widgets.less'
        , widgetsDest:  './stylesheets/widgets/'
        }

      , hypr = {
          dest:   './templates/widgets/'
        }

      , glob = {
          less: {
            src:  './widgets/**/*.less'
          , dest: './stylesheets/widgets/*.less'
          }
        , hypr: {
            src:  './widgets/**/*.hypr*'
          , dest: './templates/widgets/custom/*.hypr*'
          }
        }

      , filename
      , config
      , dest
      , content
      ;

    // DEBUG delete storefront.less
    if (debug && grunt.file.exists(less.dest)) {
      grunt.file.delete(less.dest);
    }

    // if storefront.less doesn't exist in our theme
    if (!grunt.file.exists(less.dest)) {

      // get storefront.less from the core theme we're extending
      less.content = grunt.file.read(less.src);

      // append the "custom widgets" section so we can inject stuff
      less.content += [
        '',
        '// Imported Widgets',
        '@import "' + less.widgetsFile.substring(1) + '";'
      ].join('\n');

      grunt.log.ok('creating ', chalk.cyan(less.dest));

      // write our file to the stylesheets directory
      grunt.file.write(less.dest, less.content);
    }



    // Manage our widget styles
    // =========================================================================

    // delete all of our .less files in /stylesheets/widgets
    _.each(grunt.file.expand(glob.less.dest), function(filepath, index) {
      grunt.file.delete(filepath);
    });


    // get a list of all our active widget stylesheets
    less.widgetList = [];


    // iterate over our list of stylesheets and facilitate their integration
    _.each(grunt.file.expand(glob.less.src), function(filepath) {

      // read the file contents
      less.content = grunt.file.read(filepath);

      // get the file name
      filepath = less.widgetsDest + filepath.split('/').pop();

      // write the file into our /stylesheets/widgets directory
      grunt.file.write(filepath, less.content);

      // append our file path to the list of imports
      less.widgetList.push('@import "' + filepath.substring(1) + '";');

    });


    // write the widgets.less file
    grunt.file.write(less.widgetsFile, less.widgetList.join('\n'));

    // prune less
    less = false;



    // Manage our Hypr templates
    // =========================================================================

    var templates = [];

    if (grunt.file.exists('./.grunt/templates.json')){
      templates = grunt.file.readJSON('./.grunt/templates.json');
    }


    // delete all of our current templates
    _.each(templates, function(filepath) {
      if (grunt.file.exists(filepath)) {
        grunt.file.delete(filepath);
        grunt.log.ok(
          'deleting'
        , chalk.red(filepath)
        );
      }
    });


    // reset our templates array
    templates = [];


    // iterate over each plugin hypr file and add it to our plugins dir
    _.each(grunt.file.expand(glob.hypr.src), function(filepath, index) {

      // get template contents
      content   = grunt.file.read(filepath);

      // parse the filename
      filepath  = filepath.split('/');  // convert the filepath into an array
      filename  = filepath.pop();       // get the template filename
      filepath  = filepath.join('/');   // get the template path

      // get the template destination path
      dest  = grunt.file.readJSON(filepath + '/widget.json').displayTemplate;
      dest  = dest.split('/');
      dest.pop();

      dest  = hypr.dest + dest.join('/') + '/' + filename;

      // cache our current list of template files
      // filepath = filepath.split('/');

      templates.push(dest);

      console.log(dest);

      // console.log(filepath, '|', filename);

    });


    grunt.file.write('./.grunt/templates.json', JSON.stringify(templates));

  });
};
