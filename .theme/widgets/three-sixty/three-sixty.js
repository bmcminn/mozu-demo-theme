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
      , x = 0
      , y = 0
      ;


    image.frameWidth  = image.width/image.frameCount;
    image.speed       = 1200;


    model.$images = [];


    for (x=0; x<image.frameCount; x+=1) {

      // set the crop parameter offsets
      image.frame = [
        x * image.frameWidth      // x1
      , y                         // y1
      , (x+1) * image.frameWidth  // x2
      , image.height              // y2
      ].join(',');

      // append our new image reference to the image array list
      model.$images.push([
        image.URL.imageUrl
      , '?quality=', image.quality
      , '&crop=', image.frame
      ].join(''));

      // clean up the frame property
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



/// TESTING AUTOMATIC CAPTURING OF FRAME HEIGHT/WIDTHS
// var model = {
//     x: 0,
//     y: 0
//   },

//   image = {
//     numFrames: 90,
//     width: 24560,
//     height: 4800,
//     // frameWidth: 1228,
//     // frameHeight: 801,
//     xframes: 20,
//     yframes: 8,
//     MAX_SIZE: 30000
//   },

//   frames = [],
//   RADIX = 10
//   ;



// /**
//  * [sanityCheck description]
//  * @return {[type]} [description]
//  */
// var sanityCheck = function() {
//   if (image.width < image.MAX_SIZE && image.height < image.MAX_SIZE) {
//     return true;

//   } else {
//     console.error('The image can be no larger than', image.MAX_SIZE, 'pixels in either dimension', model.image);
//     return false;
//   }
// }



// /**
//  * [getFrames description]
//  * @return {[type]} [description]
//  */
// var getFrames = function() {

//   image.frameWidth = image.width / image.xframes;
//   image.frameHeight = image.height / image.yframes;

//   // check if the resulting number of x/y frames is not a whole number
//   if (parseInt(image.xframes, RADIX).toString().length < image.xframes.toString().length) {
//     console.warn('The given frame width', image.frameWidth, 'yields an uneven number of frames.', image.xframes);
//   }

//   if (parseInt(image.yframes, RADIX).toString().length < image.yframes.toString().length) {
//     console.warn('The given frame height', image.frameHeight, 'yields an uneven number of frames.', image.yframes);
//   }


//   console.log(image);

// }






// /**
//  * [init description]
//  * @return {[type]} [description]
//  */
// var init = function() {

//   if (!sanityCheck()) {
//     return;
//   }

//   getFrames();

// }


// // get the party started
// init();
