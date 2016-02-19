/**
 *
 * @sauce: http://www.mathieusavard.info/threesixty/demo.html
 * @alternative: http://www.jqueryscript.net/demo/jQuery-Plugin-For-Draggable-360-Degrees-Product-Image-View-j360/
 *
 */

define([
  'underscore'
// , 'clog'
, 'modules/jquery-mozu'
// , 'vendor/jquery.three-sixty'
, 'shim!vendor/jquery.three-sixty[jquery=jQuery]'
],
function(_, $) {

  'use strict';

  var pageContext       = require.mozuData('pageContext');
  var threeSixtys       = document.querySelectorAll('[data-mz-widget="bcm~three-sixty"]');
  var threeSixtysList   = Array.apply(null, threeSixtys);


  // iterate over our video widgets and try to make them work
  threeSixtysList.forEach(function(threeSixty, index) {

    var $this = threeSixty
      , model = JSON.parse($this.dataset.mzConfig)
      , image = model.config
      , frame
      , i = 0
      ;


    image.frameWidth  = image.width/image.frameCount;
    image.speed       = 1200;


    model.$images = [];


    for (i=0; i<image.frameCount; i+=1) {

      image.frame = [
        i * image.frameWidth
      , 0
      , (i+1) * image.frameWidth
      , image.height
      ].join(',');

      model.$images.push([
        image.URL.imageUrl
      , '?quality=', image.quality
      , '&crop=', image.frame
      ].join(''));

      delete(image.frame);
    }


    // TODO: make all of these settings within widget.json
    model.sliderConfig = {
        images:     model.$images
      , method:     'mousemove'
      , cycle:      2
      // , direction:  'backward'
      // , width:  image.frameWidth
      // , height: image.height
      // , speed:  1200
      // , speed: image.speed
      };


    $(document).ready(function() {

      $(threeSixty)
        .append('<img>')
        .find('img')
          .attr('height', image.height)
          .attr('width',  image.frameWidth)
        .threesixty(model.sliderConfig)
      ;

    });


    // debug our model if we're in debugMode
    if (pageContext && pageContext.isDebugMode) {
      console.debug(model.widgetName + ':', model.id, model);
    }

  });


});
