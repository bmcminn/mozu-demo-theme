/* jshint laxbreak:true, laxcomma:true */
/* global define:true */

// TODO: cleanup file, kinda jumbled up a bit, could streamline this into an app structure with a minimal business logic section at the bottom
// TODO: instead of manually mapping the vimeo/youtube settings, just generate from video.props data
// TODO: look into integrating image thumbnail overlays until video resolves
//    - http://stackoverflow.com/questions/2068344/how-do-i-get-a-youtube-video-thumbnail-from-the-youtube-api
//    - http://stackoverflow.com/questions/1361149/get-img-thumbnails-from-vimeo



define([
  // 'modules/jquery-mozu'
  'underscore'
],

function(_) {

  'use strict';

  var radix = 10

    , base = {
        youtube:    '//www.youtube.com/embed/'
      , ytNoCookie: '//www.youtube-nocookie.com/embed/'
      , vimeo:      '//player.vimeo.com/video/'
      , autoPlay:   'autoplay=false'
      }

    , regex = {
        number:         /^[\d\.]+/
      , vimeoIdFormat:  /^[\d]{6,}/
      , videoID:        /(?:^[^<>htps\:\/]\/|(?:v=|\/(?!\/|embed|iframe|watch|vimeo|video|channels|staff|www|player|youtu\.?be)))([A-z0-9\-\_]{3,})/i
      , t:              /[^\d\w][\&\?\#]?t=["]?([\dms]+)/i
      , list:           /[\&\?]?list=([\d\w-_]+)/i
      // , props:          /[\?&](t|list|controls|showinfo|rel|autoplay|loop|color|title|byline|portrait)=([\d\w\-\_]*)/gi
      , props:          /[\?\&]([\w\d]+)=([\d\w\-\_]*)/gi
      , serviceName:    /(vimeo|youtu.?be)/i
      , ytNoCookie:     /youtube-nocookie/i
      }
    ;


  var pageContext = require.mozuData('pageContext');
  var videos      = document.querySelectorAll('[data-mz-widget="bcm~video"]');
  var videosList  = Array.apply(null, videos);


  // iterate over our video widgets and try to make them work
  videosList.forEach(function(model, index) {

    // get our widget model data
    model = JSON.parse(model.dataset.mzConfig);


    // build video schema object
    var $videoUrl = model.config.url;

    var video = {
      url:          $videoUrl
    , id:           $videoUrl.match(regex.videoID)
    , service:      $videoUrl.match(regex.serviceName)
    , list:         $videoUrl.match(regex.list)
    , t:            $videoUrl.match(regex.time)
    , props:        $videoUrl.match(regex.props)
    , ytNoCookie:   $videoUrl.match(regex.ytNoCookie) ? true : false
    };


    // if we don't know what video to show
    if (!video.id && !video.list) {
      console.error({
        message: "ERROR: Video widget URL value is misconfigured. Try a different URL"
      , url: video.url
      , widgetId: model.id
      });
      return;

    // if we found an id
    } else {
      video.id = video.id[1];

    }


    // do we have a service ID?
    if (video.service) {
      video.service = video.service[1].replace(/\./, '');

    } else {
      // check if we have a vimeo ID format
      if (video.id.match(regex.vimeoIdFormat)) {
        video.service = 'vimeo';

      // it's a youtube video
      } else {
        video.service = 'youtube';
      }

    }


    // get the time of the video
    if (video.t) {
      video.t = video.t[1];
    }


    // flatten the props list
    if (video.props) {
      video.props = video.props.forEach(function(prop, index) {

        prop = prop.split('=');

        // coerce numerical values to a proper number type
        if (prop[1].match(regex.number)) {
          prop[1] = parseInt(prop[1], radix);
        }

        // map value back into the video definition
        video[prop[0]] = prop[1];

        // return ;

      });
    }


    // map widget overrides to video object
    video = _.extend(video, model.config);


    // format the arguments we need for either service
    var embedArguments = [];

    if (video.service === 'youtube') {
      embedArguments.push(
        '&list='      + video.list
      , '&controls='  + video.controls
      , '&showinfo='  + video.showinfo
      , '&rel='       + video.rel
      );
    }


    if (video.service === 'vimeo') {
      embedArguments.push(
        '&color='     + video.color
      , '&badge='     + video.badge
      , '&title='     + video.title
      , '&byline='    + video.byline
      , '&portrait='  + video.portrait
      );
    }


    // compose the video embed
    var embed = [
        '<iframe src="'
      , video.ytNoCookie ? base.ytNoCookie : base[video.service]
      , video.id
      , '?'
      , embedArguments.join('')
      , '&allowfullscreen='   + video.allowfullscreen
      , '&autoplay='          + video.autoplay
      , '&loop='              + video.loop
      , '&time='              + video.t
      , '" '
      , 'width="" height="" '
      // , 'webkitallowfullscreen mozallowfullscreen allowfullscreen'
      , '></iframe>'
      ].join('')
    ;

    embed = embed
      .replace(/\?\&/, '?')
      .replace(/\?"/, '"')
      ;


    // write video embed into widget container
    videos[index].innerHTML = embed;


    // debug our model if we're in debugMode
    if (pageContext.isDebugMode) {
      console.debug('widget:', model.id, model, video);
    }


    // return the instance of this video
    return video;

  });

});
