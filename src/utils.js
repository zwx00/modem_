import * as PIXI from 'pixi.js';

export default {
  sleep (t) {
    return new Promise(resolve => {
      setTimeout(resolve, t);
    });
  },
  getSprite (resource, meta) {
    if (meta.type === 'static') {
      return new PIXI.Sprite(resource.texture);
    } else if (meta.type === 'animation') {
      const textures = [];
      for (let i = 0; i < meta.frames; i++) {
        textures.push(new PIXI.Texture(resource.texture, new PIXI.Rectangle(
          i * meta.offset, 0, meta.offset, resource.texture.height
        )));
      }
      const sprite = new PIXI.AnimatedSprite(textures);
      sprite.gotoAndPlay(0);
      sprite.animationSpeed = 0.1;
      return sprite;
    } else {
      throw new Error('Unknown filetype');
    }
  },
  randomDirection () {
    return Math.random() > 0.5 ? -1 : 1;
  }
};
