/* jshint laxbreak:true, laxcomma:true */
/* global define */
define([
  'modules/jquery-mozu'
, 'shim!vendor/fitvids[jQuery=jquery]'
],

function($) {

  $(document).ready(function() {

    var base = {
            youtube:'//www.youtube.com/embed/',
            vimeo:'//player.vimeo.com/video/'
        }
      , autoPlayFalse = 'autoplay=false'
      , videoId
      , videoUrl
      ;

    // Iterate over our video widget collection
    $('[data-mz-widget="video-embed"]').each(function(index, value) {

      var $this       = $(this)
        , videoConfig = $this.data('mzVideoData').toString()
        ;

      $this.addClass('fade');
      $this.config = $this.data('mzWidgetConfig') || videoData;


      if (videoConfig) {

        // if (videoConfig.)

      }



          // // Determine if the videoData is valid and figure out the vendor
          // if (videoData && 0 < videoData.length) {

          //     // Is it Youtube?
          //     if (videoData.match(/youtu\.?be/)) {
          //         videoId = videoData.match(/(?:list=|v=|embed|youtu.be\/)([\d\w-_]+)/);
          //         videoId = videoId[1] ? videoId[1] : videoId[2];

          //         if (videoData.match(/list=/)) {
          //             videoUrl = base.youtube + '?list=' + videoId + '&' + autoPlayFalse;
          //         } else {
          //             videoUrl = base.youtube + videoId + '?' + autoPlayFalse;
          //         }


          //     // Is it Vimeo?
          //     } else if (videoData.match(/vimeo/)) {
          //         videoId = videoData.match(/\/(\d+)$|video\/(\d+)/);
          //         videoId = videoId[1] ? videoId[1] : videoId[2];

          //         videoUrl = base.vimeo + videoId;

          //     // Heuristically determine if the video is vimeo OR youtube
          //     } else {

          //         // is the video ID all numbers? It's vimeo!
          //         if (videoData.match(/^\d{3,}$/)) {
          //             videoUrl = base.vimeo + videoData;

          //         // it's probably youtube
          //         } else {
          //             videoUrl = base.youtube + videoData + '?' + autoPlayFalse;
          //         }
          //     }
          // }

        // If we couldn't figure out what the video was, pass back an error message
        if (!videoUrl) {
            console.error('WIDGET_ERROR', {
                type:'INVALID_DATA',
                message: 'The video data provided was not a valid Youtube or Vimeo video.',
                widgetId: 'video-widget',
                data: $this
            });
            return;
        }

        // Append the video into the video container module
        $this
            .html([
                '<iframe width="560" height="315"',
                'src="' + videoUrl + '"',
                'frameborder="0"',
                'webkitallowfullscreen',
                'mozallowfullscreen',
                'allowfullscreen></iframe>'
            ].join(' '));

        // Enable fitvids on this video widget
        $this.fitVids();

        // Fade-in the widget module
        $this.addClass('fade-in');

        // reset our fields
        videoId = videoUrl = videoData = undefined;

    });
  });
});
