import * as PIXI from 'pixi.js';
import gifFrames from 'gif-frames';
import Utils from './utils';

const ticker = PIXI.Ticker.shared;

const randomDirection = () => {
  return Math.random() > 0.5 ? -1 : 1;
};

const getSprite = (resource) => {
  if (resource.name.endsWith('.png') || resource.name.endsWith('.jpg') || resource.name.endsWith('.jpeg')) {
    return new Promise((resolve) => resolve(new PIXI.Sprite(resource.texture)));
  } else if (resource.name.endsWith('.gif')) {
    return gifFrames({ url: resource.url, frames: 'all', outputType: 'canvas' })
      .then((frameData) => {
        const textures = frameData.map((frame) => PIXI.Texture.from(frame.getImage()));
        const sprite = new PIXI.AnimatedSprite(textures);
        sprite.gotoAndPlay(0);
        sprite.animationSpeed = 0.1;
        return sprite;
      });
  } else {
    throw new Error('Unknown filetype');
  }
};

const paintMovingSprite = ({ resource, container, surfaceWidth, surfaceHeight }) => {
  let spriteData = {};

  return getSprite(resource).then((sprite) => {
    const ratio = (surfaceHeight / sprite.height / 3) * Math.random();
    sprite.width = sprite.width * ratio + 50;
    sprite.height = sprite.height * ratio + 50;

    sprite.x = Math.random() * surfaceWidth - sprite.width / 2;
    sprite.y = Math.random() * surfaceHeight - sprite.height / 2;

    spriteData = {
      xChange: Math.random() * randomDirection() * 0.05,
      yChange: Math.random() * randomDirection() * 0.05,
      rotationSpeed: Math.random() * 0.0002,
      sprite: sprite
    };

    ticker.add((delta) => {
      spriteData.sprite.rotation += delta * spriteData.rotationSpeed;

      if (spriteData.sprite.x + delta * spriteData.xChange > surfaceWidth) {
        spriteData.xChange = -1 * spriteData.xChange;
      }
      if (spriteData.sprite.y + delta * spriteData.xChange > surfaceHeight) {
        spriteData.yChange = -1 * spriteData.yChange;
      }

      if (spriteData.sprite.x + delta * spriteData.xChange < 0) {
        spriteData.xChange = -1 * spriteData.xChange;
      }
      if (spriteData.sprite.y + delta * spriteData.xChange < 0) {
        spriteData.yChange = -1 * spriteData.yChange;
      }

      spriteData.sprite.x += delta * spriteData.xChange;
      spriteData.sprite.y += delta * spriteData.yChange;
    });

    return sprite;
  });
};

const renderBackground = ({ fileNames, surfaceWidth, surfaceHeight }) => {
  return fileNames.map((file, index) => {
    return Utils.sleep(2000 * index)
      .then(() => {
        const isGif = file.endsWith('.gif');
        const options = {
          loadType: isGif ? PIXI.LoaderResource.LOAD_TYPE.XHR : PIXI.LoaderResource.LOAD_TYPE.DEFAULT,
          xhrType: isGif ? PIXI.LoaderResource.XHR_RESPONSE_TYPE.BUFFER : PIXI.LoaderResource.XHR_RESPONSE_TYPE.BUFFER,
          crossOrigin: ''
        };

        const newLoader = new PIXI.Loader();
        return new Promise(resolve => {
          newLoader
            .add(file, options)
            .load((_, resources) =>
              resolve(paintMovingSprite({ resource: resources[file], surfaceWidth, surfaceHeight }))
            );
        });
      });
  });
};

export { renderBackground };
