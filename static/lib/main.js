'use strict';

$(document).ready(function () {
  /*
    This file shows how client-side javascript can be included via a plugin.
    If you check `plugin.json`, you'll see that this file is listed under "scripts".
    That array tells NodeBB which files to bundle into the minified javascript
    that is served to the end user.

    Some events you can elect to listen for:

    $(document).ready();      Fired when the DOM is ready
    $(window).on('action:ajaxify.end', function(data) { ... });      "data" contains "url"
  */

  console.log('nodebb-plugin-swiper: loaded');
  // Note how this is shown in the console on the first load of every page
});

const swiperDefaultConfig = {
  loop: true,
  // Warn: Hack prevent preview editor flickering + scroll to top.
  // Dont edit these 3 lines
  autoHeight: false,
  lazy: true,
  preloadImages: false,
  //
  loadPrevNext: true,
  centeredSlides: true,
  observer: false,
  setWrapperSize: true,
  keyboard: { enabled: true },
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    hideOnClick: true,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
    hideOnClick: true,
  },
};

var initSwiper = function (isComposerPreview = false) {
  if (typeof isComposerPreview !== 'boolean')
    isComposerPreview = !!isComposerPreview;
  require(['swiper'], function (
    /**
     * @type {typeof import('swiper').Swiper}
     */
    Swiper
  ) {
    let swiperConfig = {
      ...swiperDefaultConfig,
    };
    // const adminSwiperConfig = eval(config['swiper'].swiperConfig);
    // if (
    //   !!config &&
    //   !!config['swiper'] &&
    //   typeof adminSwiperConfig === 'object'
    // ) {
    //   swiperConfig = {
    //     ...swiperConfig,
    //     ...adminSwiperConfig,
    //     lazy: true,
    //     preloadImages: false,
    //     autoHeight: false,
    //   };
    // }
    if (isComposerPreview) {
      swiperConfig = {
        ...swiperConfig,
        lazy: false,
        preloadImages: true,
      };
    }
    const swiperElm = document.querySelectorAll(
      '.swiper:not(.swiper-initialized)'
    );
    if (swiperElm.length != 0) {
      swiperElm.forEach(function (elm) {
        new Swiper(elm, swiperConfig);
      });
    }
  });
};

// Hack: prevent flicker every time user type in editor. Turn off lazy for editor only
function initSwiperInComposerPreview() {
  initSwiper(true);
}
// Re-bind swiper when preview update
$(window).on('action:composer.preview', initSwiperInComposerPreview);
$(window).on('action:ajaxify.end', function (...args) {
  initSwiper(false);
});

$(window).on(
  'action:posts.loaded action:topic.loaded action:posts.edited',
  function () {
    initSwiper(false);
  }
);

// hide mouse after X second
