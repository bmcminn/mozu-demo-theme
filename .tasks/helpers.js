var chalk = require('chalk')
  ;

module.exports = {

  jsonify: function(data, color, space) {
    color = color ? color : 'cyan';
    space = space ? space : 2;
    return chalk[color](JSON.stringify(data, null, space));
  }

};
