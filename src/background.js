import * as PIXI from 'pixi.js';
import axios from 'axios';
import gifFrames from 'gif-frames';

const ticker = PIXI.Ticker.shared;

const randomDirection = () => {
  return Math.random() > 0.5 ? -1 : 1;
};

const getSprite = (resource) => {
  return new Promise( (resolve, reject) => {

    if (resource.name.endsWith(".png")) {
      resolve(new PIXI.Sprite(resource.texture));
    } else if (resource.name.endsWith(".gif")) {
      gifFrames({ url: resource.url, frames: 'all', outputType: 'canvas' })
        .then((frameData) => {
          const textures = frameData.map((frame) => PIXI.Texture.from(frame.getImage()));
          const sprite = new PIXI.AnimatedSprite(textures);
          sprite.gotoAndPlay(0);
          sprite.animationSpeed = 0.01;
          resolve(sprite);
        });
    } else {
      reject("Unknown filetype");
    }
  });
};

const paintMovingSprite = ({ resource, container, surfaceWidth, surfaceHeight }) => {
  
  let spriteData = new Object();

  return getSprite(resource).then((sprite) => {
  
  let ratio = (surfaceHeight / sprite.height / 3) * Math.random();
  sprite.width = sprite.width * ratio + 50;
  sprite.height = sprite.height * ratio + 50;

  sprite.x = Math.random() * surfaceWidth - sprite.width / 2;
  sprite.y = Math.random() * surfaceHeight - sprite.height / 2;

  spriteData = {
    xChange: Math.random() * randomDirection() * 0.05,
    yChange: Math.random() * randomDirection() * 0.05,
    rotationSpeed: Math.random() * 0.0005,
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

const paintAnimatedMovingSprite = ({ resource, surfaceWidth, surfaceHeight }) => {
  return null;
};

const renderBackground = ({ fileNames, surfaceWidth, surfaceHeight }) => {
  return fileNames.map((file, index) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const isGif = file.endsWith('.gif');
        const options = {
          loadType: isGif ? PIXI.LoaderResource.LOAD_TYPE.XHR : PIXI.LoaderResource.LOAD_TYPE.DEFAULT,
          xhrType: isGif ? PIXI.LoaderResource.XHR_RESPONSE_TYPE.BUFFER : PIXI.LoaderResource.XHR_RESPONSE_TYPE.BUFFER,
          crossOrigin: ''
        };

        new PIXI.Loader()
          .add(file, options)
          .load((_, resources) => {
            resolve(
              paintMovingSprite({ resource: resources[file], surfaceWidth, surfaceHeight })
            );
       });
      }, index * 250);
    });
  });
};

export { renderBackground };
