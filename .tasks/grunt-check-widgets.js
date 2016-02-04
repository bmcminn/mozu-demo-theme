/* jshint laxbreak:true, laxcomma:true */
/* global require, module */
module.exports = function(grunt) {

  'use strict';

  var path    = require('path')
    , chalk   = require('chalk')
    , _       = require('lodash')
    , EOL     = require('os').EOL

    , helpers = require('./helpers.js')
    , jsonify = helpers.jsonify


    // Sizing for widget preview stuff
    , maxWidth      = 80
    , leftMargin    = 2
    , pipeCount     = 2
    , spacer        = new Array(leftMargin+1).join(' ')
    , dropdownWidth = 70

    ;


  /**
   * [colorizeMetaInfo description]
   * @param  {[type]} name  [description]
   * @param  {[type]} value [description]
   * @param  {[type]} color [description]
   * @return {[type]}       [description]
   */
  helpers.colorizeMetaInfo = function(name, value, color) {
    if (!color) { color = 'cyan'; }

    if (value) {
      value = chalk[color](value);
    } else {
      value = '';
    }

    return [chalk.gray('>'), name+':', value, EOL].join(' ');
  };


  /**
   * [writeLine description]
   * @param  {[type]} message   [description]
   * @param  {[type]} color     [description]
   * @param  {[type]} highlight [description]
   * @return {[type]}           [description]
   */
  helpers.writeLine = function(message, color, highlight) {
    if (!color) { color = 'white'; }

    if (highlight) {
      color = ['bg', color.toUpperCase().substr(0,1), color.substr(1)].join('');
    }

    return [
        '|'
      , spacer
      , chalk[color](message)
      , new Array(maxWidth - leftMargin - pipeCount - message.length).join(' ')
      // , '|'
    ].join('');
  };

  // , drawDropdown: function(conf) {
  //     // TODO: make this a real thing...
  //   }


  grunt.registerTask(
    'check:widgets'
  , 'Provides an ASCII rendering of your widget config'
  , function () {

      var theme     = path.resolve('./theme.json')
        , themeui   = path.resolve('./theme-ui.json')
        , paths = {
            widgetsDir:    './templates/widgets/'
          , referencesDir:  './references/'
          }
        ;


      // get theme.json
      theme = require(theme);


      // check if our files exist
      if (grunt.file.exists(themeui)) {
        themeui = require(themeui);
      } else {
        if (theme.about.extends) {
          themeui = require(path.resolve(paths.referencesDir, theme.about.extends, 'theme-ui.json'));
        } else {
          themeui = null;
        }
      }


      // run through the widgets and render their admin UI
      _.each(theme.widgets, function(widget) {
        var meta        = ''
          , filePath    = path.resolve(paths.widgetsDir, widget.displayTemplate + '.hypr')
          , temp        = paths.widgetsDir + widget.displayTemplate
          ;


        // build metadata about widget
        meta += helpers.colorizeMetaInfo('Name', widget.displayName, 'green');
        meta += helpers.colorizeMetaInfo('ID', widget.id, 'yellow');


        // TODO: add check to see if widget even has a template

        // does the HYPR template exist?
        if(grunt.file.exists(filePath)) {
          widget.displayTemplate = temp + '.hypr';

        // does the HYPRLIVE template exist?
        } else {
          filePath += '.live';

          // if the HYPRLIVE file exists
          if (grunt.file.exists(filePath)) {
            widget.displayTemplate = temp + '.hypr.live';

          // the template doesn't exist
          } else {
            widget.displayTemplate = [
              chalk.red('ERROR')
            , EOL + chalk.red('> displayTemplate:')
            , chalk.cyan(temp)
            , chalk.red('doesn\'t exist...')
            , EOL + chalk.red('> Are you inheriting from')
            , chalk.yellow(theme.about.extends)+chalk.white('?')
            , EOL
            ].join(' ');
          }
        }

        // does the HYPRLIVE template exist?
        meta += helpers.colorizeMetaInfo('Template', widget.displayTemplate);


        //
        // RENDER THE WIDGET CONFIG PREVIEW
        //

        if (widget.editViewFields) {
          var widgetAdmin = []
            , defaults    = widget.defaultConfig || null
            , adminStrings = {
                top:    ' ' + new Array(maxWidth-leftMargin).join('_')
              , airgap: '|' + new Array(maxWidth-leftMargin).join(' ') + '|'
              , bottom: '|' + new Array(maxWidth-leftMargin).join('_') + '|' + EOL + EOL
              }
            ;

          meta += helpers.colorizeMetaInfo('Widget Admin');


          widgetAdmin.push(adminStrings.top);


          // iterate over each config field and render it's view
          _.each(widget.editViewFields, function(conf) {

            widgetAdmin.push(adminStrings.airgap);

            // check for defaults
            if (defaults) {
              // check for xtype defaults
              if (defaults.xtype && !conf.xtype) {
                conf.xtype = defaults.xtype;
              }
            }


            // check if we have a fieldLabel
            if (!conf.fieldLabel) {
              if (!conf.xtype.match(/mz-input-/)) {
                conf.fieldLabel = '';
              } else {
                conf.fieldLabel = chalk.red('missing field label');
              }
            }


            // what xtype should we render?
            if (conf.xtype) {

              if (conf.allowBlank === false) {
                conf.fieldLabel += chalk.red(' <- *required');
              }

              // if (!conf.fieldLabel === '') {
                // widgetAdmin.push(helpers.writeLine(conf.fieldLabel));
              // }

              switch(conf.xtype) {

                // text field?
                case 'mz-input-text': {

                  widgetAdmin.push(helpers.writeLine(conf.fieldLabel));

                  var opts = {
                        text: '(text goes here)'
                      }
                    ;

                  if (defaults) {
                    if (defaults[conf.name]) {
                      console.log(defaults[conf.name]);
                      opts.highlight = true;
                      opts.text = [defaults[conf.name], ' (', conf.name, ')'].join();
                    }
                  }

                  widgetAdmin.push(helpers.writeLine(opts.text, 'yellow', opts.highlight));
                  break;
                }


                // image?
                case 'mz-input-image': {
                  widgetAdmin.push(helpers.writeLine(conf.fieldLabel));

                  widgetAdmin.push(helpers.writeLine(' _________________',  'yellow'));
                  widgetAdmin.push(helpers.writeLine('|                 |', 'yellow'));
                  widgetAdmin.push(helpers.writeLine('|      Image      |', 'yellow'));
                  widgetAdmin.push(helpers.writeLine('|     Preview     |', 'yellow'));
                  widgetAdmin.push(helpers.writeLine('|      Here       |', 'yellow'));
                  widgetAdmin.push(helpers.writeLine('|_________________|', 'yellow'));
                  break;
                }


                // category?
                case 'mz-input-category': {
                  widgetAdmin.push(helpers.writeLine(conf.fieldLabel));

                  widgetAdmin.push(helpers.writeLine(' -------------------------',  'green'));
                  widgetAdmin.push(helpers.writeLine('| Category Dropdown     ^ |', 'green'));
                  widgetAdmin.push(helpers.writeLine('|=========================|', 'green'));
                  widgetAdmin.push(helpers.writeLine('| Category 1 (id=1)       |', 'bgGreen'));
                  widgetAdmin.push(helpers.writeLine('|-------------------------|', 'green'));
                  widgetAdmin.push(helpers.writeLine('| Category 2 (id=2)       |', 'green'));
                  widgetAdmin.push(helpers.writeLine('|-------------------------|', 'green'));
                  widgetAdmin.push(helpers.writeLine('| Category 3 (id=3)       |', 'green'));
                  widgetAdmin.push(helpers.writeLine('|-------------------------|', 'green'));
                  widgetAdmin.push(helpers.writeLine('| ...                     |', 'green'));
                  widgetAdmin.push(helpers.writeLine(' -------------------------',  'green'));
                  break;
                }


                // category multi?
                case 'mz-input-categorymulti': {
                  widgetAdmin.push(helpers.writeLine(conf.fieldLabel));

                  widgetAdmin.push(helpers.writeLine(' -------------------------',  'green'));
                  widgetAdmin.push(helpers.writeLine('| Category Dropdown     ^ |', 'green'));
                  widgetAdmin.push(helpers.writeLine('|=========================|', 'green'));
                  widgetAdmin.push(helpers.writeLine('| Category 1 (id=1)       |', 'bgGreen'));
                  widgetAdmin.push(helpers.writeLine('|-------------------------|', 'green'));
                  widgetAdmin.push(helpers.writeLine('| Category 2 (id=2)       |', 'green'));
                  widgetAdmin.push(helpers.writeLine('|-------------------------|', 'green'));
                  widgetAdmin.push(helpers.writeLine('| Category 3 (id=3)       |', 'bgGreen'));
                  widgetAdmin.push(helpers.writeLine('|-------------------------|', 'green'));
                  widgetAdmin.push(helpers.writeLine('| ...                     |', 'green'));
                  widgetAdmin.push(helpers.writeLine(' -------------------------',  'green'));
                  break;
                }


                // dropdown?
                case 'mz-input-dropdown': {
                  widgetAdmin.push(helpers.writeLine(conf.fieldLabel));

                  var dropdown = {
                        topBottom:    [' ', new Array(dropdownWidth - pipeCount).join('-'), ''].join('')
                      , top:          ['|', new Array(dropdownWidth - pipeCount).join('='), '|'].join('')
                      , divider:      ['|', new Array(dropdownWidth - pipeCount).join('-'), '|'].join('')
                      , titleOption:  ['| Dropdown', new Array(dropdownWidth - 13).join(' '), '^ |'].join('')
                      , color:        'green'
                      }
                    ;

                  widgetAdmin.push(helpers.writeLine(dropdown.topBottom, dropdown.color));
                  widgetAdmin.push(helpers.writeLine(dropdown.titleOption, dropdown.color));

                  if (conf.store) {
                    _.each(conf.store, function(option, index) {
                      var opts = {};

                      opts.string = '| ' + option[1].toString() + ' (' + option[0].toString() + ')';
                      opts.string = opts.string + new Array(dropdownWidth - opts.string.length - 1).join(' ') + '|';

                      if (defaults) {
                        if (defaults[conf.name] == option[0]) {
                          opts.highlight = true;
                        }
                      }

                      if (index === 0) {
                        widgetAdmin.push(helpers.writeLine(dropdown.top, dropdown.color));
                      } else {
                        widgetAdmin.push(helpers.writeLine(dropdown.divider, dropdown.color));
                      }

                      widgetAdmin.push(helpers.writeLine(opts.string, dropdown.color, opts.highlight));
                    });
                  }

                  widgetAdmin.push(helpers.writeLine(dropdown.topBottom, dropdown.color));

                  break;
                }


                // product?
                case 'mz-input-product': {
                  widgetAdmin.push(helpers.writeLine(conf.fieldLabel));

                  widgetAdmin.push(helpers.writeLine(' ---------------------------',  'green'));
                  widgetAdmin.push(helpers.writeLine('| Product Dropdown        ^ |', 'green'));
                  widgetAdmin.push(helpers.writeLine('|===========================|', 'green'));
                  widgetAdmin.push(helpers.writeLine('| Product 1 (id=1)          |', 'green'));
                  widgetAdmin.push(helpers.writeLine('|---------------------------|', 'green'));
                  widgetAdmin.push(helpers.writeLine('| Product 2 (id=2)          |', 'bgGreen'));
                  widgetAdmin.push(helpers.writeLine('|---------------------------|', 'green'));
                  widgetAdmin.push(helpers.writeLine('| Product 3 (id=3)          |', 'green'));
                  widgetAdmin.push(helpers.writeLine('|---------------------------|', 'green'));
                  widgetAdmin.push(helpers.writeLine('| ...                       |', 'green'));
                  widgetAdmin.push(helpers.writeLine(' ---------------------------',  'green'));
                  break;
                }


                // product multi?
                case 'mz-input-productmulti': {
                  widgetAdmin.push(helpers.writeLine(conf.fieldLabel));

                  widgetAdmin.push(helpers.writeLine(' ---------------------------',  'green'));
                  widgetAdmin.push(helpers.writeLine('| Product Multi Dropdown  ^ |', 'green'));
                  widgetAdmin.push(helpers.writeLine('|===========================|', 'green'));
                  widgetAdmin.push(helpers.writeLine('| Product 1 (id=1)          |', 'bgGreen'));
                  widgetAdmin.push(helpers.writeLine('|---------------------------|', 'green'));
                  widgetAdmin.push(helpers.writeLine('| Product 2 (id=2)          |', 'green'));
                  widgetAdmin.push(helpers.writeLine('|---------------------------|', 'green'));
                  widgetAdmin.push(helpers.writeLine('| Product 3 (id=3)          |', 'bgGreen'));
                  widgetAdmin.push(helpers.writeLine('|---------------------------|', 'green'));
                  widgetAdmin.push(helpers.writeLine('| ...                       |', 'green'));
                  widgetAdmin.push(helpers.writeLine(' ---------------------------',  'green'));
                  break;
                }


                // TODO: Add remaining control preview types below
                case 'mz-input-checkbox': {

                  // TODO: add check for default "true"
                  widgetAdmin.push(helpers.writeLine('[ ] ' + conf.fieldLabel, 'green'));
                  break;
                }


                case 'label': {
                  conf.text = conf.text ? conf.text : chalk.red('missing `text` field');
                  widgetAdmin.push(helpers.writeLine(chalk.bold(conf.text), 'yellow'));
                  break;
                }


                case 'mz-input-number': {
                  widgetAdmin.push(helpers.writeLine(conf.fieldLabel));

                  break;
                }

                case 'mz-input-discount': {
                  widgetAdmin.push(helpers.writeLine(conf.fieldLabel));

                  break;
                }

                case 'mz-input-discountmulti': {
                  widgetAdmin.push(helpers.writeLine(conf.fieldLabel));

                  break;
                }

                case 'mz-input-navnode': {
                  widgetAdmin.push(helpers.writeLine(conf.fieldLabel));

                  break;
                }

                case 'mz-input-navnodemulti': {
                  widgetAdmin.push(helpers.writeLine(conf.fieldLabel));

                  break;
                }

                case 'mz-input-date': {
                  widgetAdmin.push(helpers.writeLine(conf.fieldLabel));

                  break;
                }

                case 'mz-input-code': {
                  widgetAdmin.push(helpers.writeLine(conf.fieldLabel));

                  break;
                }

                case 'mz-input-richtext': {
                  widgetAdmin.push(helpers.writeLine(conf.fieldLabel));

                  break;
                }

                case 'mz-input-textarea': {
                  widgetAdmin.push(helpers.writeLine(conf.fieldLabel));

                  break;
                }

                case 'mz-input-selectmulti': {
                  widgetAdmin.push(helpers.writeLine(conf.fieldLabel));

                  break;
                }

                case 'mz-input-color': {
                  widgetAdmin.push(helpers.writeLine(conf.fieldLabel));

                  break;
                }


                default: {
                  break;
                }

              }

            } else {
              grunt.log.error(widget.displayName, 'is missing an xtype for field', chalk.cyan(conf.name));
            }

            widgetAdmin.push(adminStrings.airgap);

          });


          // close our widget admin panel
          widgetAdmin.push(adminStrings.bottom);

          // join all of the strings we built for the output
          meta += widgetAdmin.join(EOL);
        }


        console.log(meta);

        return;
      });

    }
  );
};
