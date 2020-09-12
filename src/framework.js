import * as PIXI from 'pixi.js';

const ticker = PIXI.Ticker.shared;

const getSprite = (texture, meta) => {
  if (meta.type === 'static') {
    return new PIXI.Sprite(texture);
  } else if (meta.type === 'animation') {
    const textures = [];
    for (let i = 0; i < meta.frames; i++) {
      textures.push(new PIXI.Texture(texture, new PIXI.Rectangle(
        i * meta.offset, 0, meta.offset, texture.height
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

const paintSpritePrivate = function (texture, fname, assetDefinition, container, rootStage) {
  try {
    const sprite = getSprite(texture, assetDefinition);
    sprite._filename = fname;
    // eslint-disable-next-line
    const currentSpritePainter = new this.painter(sprite, rootStage);
  
    ticker.add(currentSpritePainter.updateSprite.bind(currentSpritePainter));
  
    container.addChild(currentSpritePainter.sprite);
  
  } catch (e) {
    console.log(":::: could not build sprite for: " + fname);
  }
}

const paintSprite = function (assetDefinition, container, rootStage) {
  const fname = `${IMAGE_HOST}/${assetDefinition.filename}`;
  const cached_texture = PIXI.utils.TextureCache[fname];
  if (cached_texture) {
    paintSpritePrivate.bind(this)(cached_texture, fname, assetDefinition, container, rootStage)
  } else {
    try {
      new PIXI.Loader(fname)
      .add(fname)
      .load((_, resources) => {
        paintSpritePrivate.bind(this)(resources[fname].texture, fname, assetDefinition, container, rootStage)
      })
    } catch (e) {
      console.log(":::: could not load image for: " + fname);
    }
  }
};

export default {
  paintSprite
};
