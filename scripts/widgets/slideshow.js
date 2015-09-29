define([
  'modules/jquery-mozu'
, 'shim!vendor/slick[jQuery=jquery]'
], function($) {

		var temp
			, regex = {
				}
			, $slideshow = $('[data-mz-widget="slideshow"]')
			;

		$slideshow.slick();



});
