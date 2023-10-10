'use strict';

define('admin/plugins/swiper', ['settings'], function (
  settings,
) {
  var ACP = {};

  ACP.init = function () {
    settings.load('swiper', $('.swiper-settings'));
    $('#save').on('click', function () {
      settings.save('swiper', $('.swiper-settings'));
    });
  };

  return ACP;
});
