module.exports = {

  options: {},
    emails: {
      files: [{
        expand: true
      , cwd: '.theme/emails' // Src matches are relative to this path.
      , src: ['**/*.mjml.hypr'] // Actual pattern(s) to match.
      , dest: 'templates/email'   // Destination path prefix.
      , ext: '.hypr'   // Dest filepaths will have this extension.
      // , extDot: 'first'   // Extensions in filenames begin after the first dot
      }]
    }

};
