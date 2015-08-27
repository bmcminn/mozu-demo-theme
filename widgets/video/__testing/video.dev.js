
(function($) {


    var temp
      , base = {
          youtube:  'https://www.youtube.com/embed/'
        , vimeo:    'https://player.vimeo.com/video/'
        , autoPlay: 'autoplay=false'
        }
      , regex = {
          videoTime:      /#?t=(\d{1,}s?)/i
        , vimeoID:        /^(\d{6,})/i
        , vimeoUrl:       /\/(\d{6,})/i
        , youtubeID:      /^([\w\d-_]{1,})/i
        , youtubeVideo:   /(?:v=([\w\d-_]{1,}))/i
        , youtubeList:    /(list=[\w\d-_]{1,})/i
        , youtubePrivacy: /youtube-nocookie/i
        , youtubeUrl:     /youtu.?be/i
        }
      ;


    // Iterate over our video widget collection
    $('[data-mz-widget="video-embed"]').each(function() {

      var $this = $(this);

      // $this.addClass('fade');
      $this.video = {
        'config': $this.data('mzVideoData').toString().replace(/https?:/i, '')
      , 'url':    null
      , 'time':   ''
      };


      // if it's a vimeo ID
      if ($this.video.config.match(regex.vimeoID)) {
        $this.video.id = $this.video.config.match(regex.vimeoID)[0];
      }

      // if it's a vimeo link
      if ($this.video.config.match(regex.vimeoUrl)) {
        $this.video.id = $this.video.config.match(regex.vimeoUrl)[1];
      }

      // set the video type
      $this.video.type = 'vimeo';


      // if we haven't figured out what the video is...
      if (!$this.video.id) {

        // if it's a youtube ID
        if ($this.video.config.match(regex.youtubeID)) {
          $this.video.id = $this.video.config.match(regex.youtubeID)[0];
        }

        // if it's a youtube link
        if ($this.video.config.match(regex.youtubeVideo)) {
          $this.video.id = $this.video.config.match(regex.youtubeVideo)[1];
        }

        $this.video.type = 'youtube';
      }


      // if we have a list
      if ($this.video.config.match(regex.youtubeList)) {
        $this.video.list = $this.video.config.match(regex.youtubeList)[0];
      }


      // if it's a time
      if ($this.video.config.match(regex.videoTime)) {
        $this.video.time = $this.video.config.match(regex.videoTime)[0];
      }


      // build the url depending what type of video it is
      switch($this.video.type) {
        case 'youtube':
          $this.video.url = [
            base.youtube
          , $this.video.id
          , '?'
          , $this.video.list
          // , $this.video.time ? '?' + $this.video.time : ''
          ].join('');

          break;

        case 'vimeo':
          $this.video.url = [
            base.vimeo
          , $this.video.id
          , $this.video.time
          , '?'
          ].join('');

          break;
      }


      // if the youtube link has a privacy url
      if ($this.video.config.match(regex.youtubePrivacy)) {
        $this.video.url = $this.video.url.replace(regex.youtubeUrl, 'youtube-nocookie');
      }


      // TODO: accomodate all these variable settings...

      // https://player.vimeo.com/video/129806257?
      //   autoplay=1
      // & loop=1
      // & color=6c6e95
      // & title=0
      // & byline=0
      // & portrait=0


      // https://www.youtube-nocookie.com/embed/UkV46gvgXSM?
      //   rel=0
      // & controls=0
      // & showinfo=0
      // & autoplay=1



      // <iframe
      //   width="420"
      //   height="315"
      //   src="https://www.youtube.com/embed/d0dD59FYxJ4?rel=0&controls=0&showinfo=0"
      //   frameborder="0"
      //   allowfullscreen>
      // </iframe>


      // append any other URL arguments here
      $this.video.url += '&autoplay=false';

      $this.video.config = $this.video.type;


      $this.attr('data-mz-widget-config', JSON.stringify($this.video, null));

      console.log($this.video);


      // If we couldn't figure out what the video was, pass back an error message
      if (!$this.video.url) {
        console.error('WIDGET_ERROR', {
          type: 'INVALID_DATA'
        , message: 'The video data provided was not a valid Youtube or Vimeo video.'
        , widgetId: 'video-widget'
        , data: $this.video
        });
        return;
      }



      // Append the video into the video container module
      $this
        .html([
            '<iframe width="560" height="315"'
          , 'src="' + $this.video.url + '"'
          , 'frameborder="0"'
          , 'webkitallowfullscreen'
          , 'mozallowfullscreen'
          , 'allowfullscreen></iframe>'
        ].join(' '))
        ;

      // Enable fitvids on this video widget
      $this.fitVids();

      // Fade-in the widget module
      // $this.addClass('fade-in');

    });


})(jQuery);
