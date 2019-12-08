import * as PIXI from 'pixi.js';
import Utils from './utils';
const ticker = PIXI.Ticker.shared;

const randomDirection = () => {
  return Math.random() > 0.5 ? -1 : 1;
};

const getSprite = (resource, meta) => {
  return new Promise((resolve, reject) => {
    if (meta.type === 'static') {
      resolve(new PIXI.Sprite(resource.texture));
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
      resolve(sprite);
    } else {
      reject(new Error('Unknown filetype'));
    }
  });
};

const paintMovingSprite = ({ meta, resource, container, surfaceWidth, surfaceHeight }) => {
  let spriteData = {};
  return getSprite(resource, meta).then((sprite) => {
    const ratio = (surfaceHeight / sprite.height / 5) * Math.random();
    sprite.width = sprite.width * ratio + 50;
    sprite.height = sprite.height * ratio + 50;

    sprite.x = Math.random() * surfaceWidth - sprite.width / 2;
    sprite.y = Math.random() * surfaceHeight - sprite.height / 2;

    spriteData = {
      xChange: Math.random() * randomDirection() * 0.000005,
      yChange: Math.random() * randomDirection() * 0.000005,
      rotationSpeed: Math.random() * 0.00000002,
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
  return fileNames.map((object, index) => {
    return Utils.sleep(2000 * index)
      .then(() => {
        console.log(object);
        console.log(index);
        return new Promise(resolve => {
          new PIXI.Loader()
            .add(object.filename)
            .load((_, resources) =>
              resolve(paintMovingSprite({ meta: object, resource: resources[object.filename], surfaceWidth, surfaceHeight }))
            );
        });
      });
  });
};

export { renderBackground };
