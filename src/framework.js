import * as PIXI from 'pixi.js';

const ticker = PIXI.Ticker.shared;

const getSprite = (resource, meta) => {
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
};

const paintSprite = function (assetDefinition, container) {
  new PIXI.Loader()
    .add(assetDefinition.filename)
    .load((_, resources) => {
      const sprite = getSprite(resources[assetDefinition.filename], assetDefinition);

      // eslint-disable-next-line
      const currentSpritePainter = new this.painter(sprite);

      ticker.add(currentSpritePainter.updateSprite.bind(currentSpritePainter));

      container.addChild(sprite);
    });
};

export default {
  paintSprite
};
