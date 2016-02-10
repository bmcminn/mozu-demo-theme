module.exports = {

  /**
   * Removes all line comments from JSON content
   * @param  {string} str JSON content containing line comments
   * @return {string}     Commentless JSON content
   */
  minify: function(str) {

    return JSON.parse(str.replace(/^[\s\t]*\/\/.+/g, ''));

  }

};
