
module.exports = {

  check: {
    command: 'check'
  },

  fullcompile: {
    command: 'compile'
  },

  quickcompile: {
    command: 'compile',
    opts: {
      skipminification: true
    }
  }

};
