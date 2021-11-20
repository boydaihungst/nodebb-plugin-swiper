'use strict';

const nconf = require.main.require('nconf');
const winston = require.main.require('winston');
const controllers = require('./lib/controllers');
const meta = require.main.require('./src/meta');
const routeHelpers = require.main.require('./src/routes/helpers');
const cheerio = require('cheerio');
const plugin = {};
const startSwiperTag = '##image-slider-start';
const endSwiperTag = '##image-slider-end';
plugin.init = async (params) => {
  const { router, middleware /* , controllers */ } = params;
  /**
   * We create two routes for every view. One API call, and the actual route itself.
   * Use the `setupPageRoute` helper and NodeBB will take care of everything for you.
   *
   * Other helpers include `setupAdminPageRoute` and `setupAPIRoute`
   * */
  routeHelpers.setupPageRoute(
    router,
    '/swiper',
    middleware,
    async (req, res) => {
      winston.info(
        `[plugins/swiper] Navigated to ${nconf.get('relative_path')}/swiper`,
      );
      // Extra data send to template
      if ((await meta.settings.get('swiper')) == null) {
        // meta.settings.set();
      }
      res.render('swiper', { uid: req.uid });
    },
  );

  routeHelpers.setupAdminPageRoute(
    router,
    '/admin/plugins/swiper',
    middleware,
    [],
    controllers.renderAdminPage,
  );
};

plugin.appendConfigToClient = async function (config) {
  config['swiper'] = await meta.settings.get('swiper');
  return config;
};

plugin.addAdminNavigation = (header) => {
  header.plugins.push({
    route: '/plugins/swiper',
    icon: 'fa-tint',
    name: 'Swiper',
  });

  return header;
};

const transform = async function (data, isParsedFromComposerPreview = false) {
  if (!data) return data;
  let postHTML = data;
  // Parse for different hook
  if (data.postData && data.postData.content) {
    postHTML = data.postData.content;
  } else if (data.userData && data.userData.signature) {
    postHTML = data.userData.signature;
  }
  // Using like jquery
  const isNeedParsed =
    postHTML.includes(startSwiperTag) && postHTML.includes(endSwiperTag);
  if (!isNeedParsed) return data;
  // Split by delemeter ##image-slider-start | ##image-slider-end
  const allBlock = postHTML.split(
    /(?:##image-slider-start)|(?:##image-slider-end)/g,
  );
  // final content after parsed
  let parsedHtml = '';
  allBlock.forEach(function (block, index) {
    // case index is odd. > (ex: 1,3,5,7,9....)
    // Only even block has list image.
    if (!index / 2) {
      parsedHtml += block;
    } else {
      // even
      let imagesBlock = block;
      const $ = cheerio.load(
        imagesBlock,
        { recognizeSelfClosing: true },
        false,
      );
      const galleryParagraph = $.root();

      const images = [];
      galleryParagraph.find('img').each(function () {
        // Hack prevent wrap image under <a> tag
        images.push($(this).addClass('emoji'));
      });

      if (images.length != 0) {
        const lazyLoad = !isParsedFromComposerPreview;
        galleryParagraph.html(
          '<div class="swiper image-swiper"><div class="swiper-wrapper"></div><div class="swiper-pagination"></div><div class="swiper-button-next"></div><div class="swiper-button-prev"></div></div>',
        );
        const collectionContainer = $.root().find('div.swiper-wrapper');

        images.forEach((image) => {
          const src = $(image).attr('src');
          let imageDom = null;
          if (lazyLoad) {
            imageDom = $(image)
              .attr('data-srcset', src)
              .removeAttr('src')
              .removeAttr('alt')
              .addClass('swiper-lazy');
          } else {
            imageDom = $(image);
          }

          $('<div class="swiper-slide"></div>')
            .prepend(imageDom)
            .append(lazyLoad ? '<div class="swiper-lazy-preloader"></div>' : '')
            .appendTo(collectionContainer);
        });
      }

      parsedHtml += $.html();
    }
  });
  const parsedContent = parsedHtml;
  if (typeof data === 'string') {
    data = parsedContent;
  } else if (data.postData && data.postData.content) {
    data.postData.content = parsedContent;
  } else if (data.userData && data.userData.signature) {
    data.userData.signature = parsedContent;
  }
  return data;
  // });
};

plugin.parse = async function (data) {
  return transform(data, false);
};

plugin.parseRaw = async function (data) {
  return transform(data, true);
};

module.exports = plugin;
