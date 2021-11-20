# nodebb-plugin-swiper

## NOTE

This is a fork from package <https://github.com/me-cooper/nodebb-plugin-makesmart-gallery>.

## What news?

- Support composer preview (Not lazy loading => to prevent flickering)
- Default lazy loading in post/topic/user signature
- Configable Swipe (WIP)
- Add to npm for easy install through ACP
- Keyboard swipe control, click on image to hide nav arrow, pagination
- Add swiper button to composer toolbar.

## Install

Install from nodebb Admin control panel > extend > Plugins > nodebb-plugin-swiper

or

```console
npm install nodebb-plugin-swiper
```

or

```console
yarn add nodebb-plugin-swiper
```

### Preview:

[![Preview:](https://img.youtube.com/vi/jkPJ-IaDk-Q/0.jpg)](https://www.youtube.com/watch?v=jkPJ-IaDk-Q)

### Syntax

```markdown
##image-slider-start
![fun](https://media.tenor.com/images/11fc14bb1b8dc3efbf7aa496432601d4/tenor.gif)
![dance](https://media.tenor.com/images/82f7d090429ddc3e5ae33d7244d369c2/tenor.gif)
![happy](https://media.tenor.com/images/a12ac6302bccc01652b7f4b33a034777/tenor.gif)
##image-slider-end
```

This simple syntax creates a slim and nice image-gallery:

---

It uses [Swiper](https://swiperjs.com/) as slider. You can look trough the examples to customize your slider if you want. To change behaviour edit [static/lib/main.js](static/lib/main.js).

```javascript
const swiperDefaultConfig = {
  ...
  // Dont edit these lines.
  autoHeight: false,
  lazy: true,
  preloadImages: false,
}
```

_To-Do:_

- [x] Display Image-Slider in the composer preview as well
