
/**
 * @sauce: https://www.npmjs.com/package/grunt-jsbeautifier
 */

var path = require('path')
	;


module.exports = {

	"default": {
		src : [
			path.resolve('./scripts/**/*.js')
    , path.resolve('./components/**/*.js')
		],
		options: {
			mode: 'VERIFY_AND_WRITE'
		}
	},

	"git-pre-commit": {
		src : [
			path.resolve('./scripts/**/*.js')
		],
		options : {
			mode:'VERIFY_ONLY'
		}
	},

  options: {
    js: {
      braceStyle: "end-expand",
      breakChainedMethods: false,
      e4x: false,
      evalCode: false,
      indentChar: " ",
      commafirst: true,
      indentLevel: 5,
      indentSize: 2,
      indentWithTabs: false,
      jslintHappy: true,
      keepArrayIndentation: false,
      keepFunctionIndentation: false,
      maxPreserveNewlines: 3,
      preserveNewlines: true,
      spaceBeforeConditional: true,
      spaceInParen: false,
      unescapeStrings: false,
      wrapLineLength: 0,
      endWithNewline: true
    }
  }

};
