/* jshint laxbreak:true, laxcomma:true */
/* global define:true */

define([
  // 'modules/jquery-mozu'
  'underscore'
],

function(_) {

  'use strict';

  var radix = 10;

  var base = {
        youtube:    '//www.youtube.com/embed/'
      , ytNoCookie: '//www.youtube-nocookie.com/embed/'
      , vimeo:      '//player.vimeo.com/video/'
      , autoPlay:   'autoplay=false'
      }
    , regex = {
        number:         /^[\d\.]+/
      , vimeoIdFormat:  /^[\d]{6,}/
      , videoID:        /(?:^[^<>htps\:\/]\/|(?:v=|\/(?!\/|embed|iframe|watch|vimeo|video|channels|staff|www|player|youtu\.?be)))([A-z0-9\-\_]{3,})/i
      , time:           /[^\d\w][\&\?]?t=["]?([\dms]+)/i
      , listID:         /[\&\?]?list=([\d\w-_]+)/i
      , props:          /(controls|showinfo|rel|autoplay|loop|color|title|byline|portrait)=([\d\w]*)/gi
      , serviceName:    /(vimeo|youtu.?be)/i
      , ytNoCookie:     /youtube-nocookie/i
      }
    ;


  var videos = document.querySelectorAll('[data-mz-widget="bcm~video"]');
  var videosList = Array.apply(null, videos);


  console.log(videos);
  console.log(videosList);


  videosList.forEach(function(model, index) {

    model = model.dataset.mzConfig;

    var $videoUrl = model.config.url;

    // build video schema object
    var video = {
      url:          $videoUrl
    , id:           $videoUrl.match(regex.videoID)
    , service:      $videoUrl.match(regex.serviceName)
    , listId:       $videoUrl.match(regex.listID)
    , time:         $videoUrl.match(regex.time)
    , props:        $videoUrl.match(regex.props)
    , ytNoCookie:   $videoUrl.match(regex.ytNoCookie) ? true : false
    };


    // if we have a video list, configure it proper
    if (video.listId) {
      video.listId = video.listId[1];
    }


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
    if (video.time) {
      video.time = video.time[1];
    }


    // flatten the props list
    if (video.props) {
      video.props = video.props.map(function(prop, index) {

        prop = prop.split('=');

        // coerce numerical values to a proper number type
        if (prop[1].match(regex.number)) {
          prop[1] = parseInt(prop[1], radix);
        }

        // map value back into the video definition
        video[prop[0]] = prop[1];

        return ;

      });
    }


    // map widget overrides to video object
    video = _.extend(video, model.config);


    // format the arguments we need for either service
    var embedArguments = [];

    if (video.service === 'youtube') {
      embedArguments.push(
        '&list='      + video.list ? video.list : ''
      , '&controls='  + video.controls
      , '&showinfo='  + video.showinfo
      , '&rel='       + video.rel
      );
    }


    if (video.service === 'vimeo') {
      embedArguments.push(
        '&color='     + video.color
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
      , '&autoplay='  + video.autoplay
      , '&loop='      + video.loop
      , '&time='      + video.time
      , '" '
      , 'width="" height="" '
      , 'webkitallowfullscreen mozallowfullscreen allowfullscreen'
      , '></iframe>'
      ].join('')
    ;

    embed = embed
      .replace(/\?\&/, '?')
      .replace(/\?"/, '"')
      ;

    // console.log(video);
    console.log(embed);


    // console.debug(video);
    return video;

  });

});
