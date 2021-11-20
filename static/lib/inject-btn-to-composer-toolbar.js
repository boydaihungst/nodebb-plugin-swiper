$('document').ready(function () {
  //./plugins/nodebb-plugin-makesmart-gallery/static/lib/
  require([
    'composer',
    'composer/controls',
    'translator',
  ], function (composer, controls, translator) {
    translator.translate(
      '[[swiper:composer.icon.title]]',
      function (iconTitleOnComposerToolbar) {
        composer.addButton(
          'fas fa-images',
          function (textarea, selectionStart, selectionEnd) {
            const startSwiperTag = '##image-slider-start';
            const endSwiperTag = '##image-slider-end';
            if (selectionStart === selectionEnd) {
              controls.insertIntoTextarea(
                textarea,
                startSwiperTag + '\n\n' + endSwiperTag
              );
              controls.updateTextareaSelection(
                textarea,
                selectionStart + startSwiperTag.length + 1,
                selectionEnd + startSwiperTag.length + 1
              );
            } else {
              controls.wrapSelectionInTextareaWith(
                textarea,
                startSwiperTag + '\n',
                '\n' + endSwiperTag
              );
              controls.updateTextareaSelection(
                textarea,
                selectionStart + startSwiperTag.length + 1,
                selectionEnd + startSwiperTag.length + 1
              );
            }
          },
          iconTitleOnComposerToolbar
        );
      }
    );
  });
});
