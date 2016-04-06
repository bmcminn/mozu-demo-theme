/* jshint laxcomma:true, laxbreak: true */
require([
  'modules/jquery-mozu'
, 'hyprlive'
], function($, Hypr) {

    var template = ''
      , model = {
          locals: {
          },
          set: function(name, data) {
            this.locals[name] = data;
          }
        }
      ;

    // configure base model values


    // run examples example
    $('[data-mz-template]').each(function() {
      var $this     = $(this)
        , template  = $this.data('mzTemplate')
        ;
      $this.html(Hypr.engine.render(template, model));
    });

});
