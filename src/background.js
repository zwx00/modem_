import * as PIXI from 'pixi.js';
import axios from 'axios';

const ticker = PIXI.Ticker.shared;

const randomDirection = () => {
  return Math.random() > 0.5 ? -1 : 1;
};

const paintMovingSprite = ({ resource, container, surfaceWidth, surfaceHeight }) => {
  
  let spriteData = new Object();

  let texture = new PIXI.Sprite(resource.texture);
  
  let ratio = (surfaceHeight / texture.height / 3) * Math.random();
  texture.width = texture.width * ratio + 50;
  texture.height = texture.height * ratio + 50;

  texture.x = Math.random() * surfaceWidth - texture.width / 2;
  texture.y = Math.random() * surfaceHeight - texture.height / 2;

  spriteData = {
    xChange: Math.random() * randomDirection() * 0.05,
    yChange: Math.random() * randomDirection() * 0.05,
    rotationSpeed: Math.random() * 0.0005,
    sprite: texture
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

  return texture;
};


const renderBackground = ({ fileNames, surfaceWidth, surfaceHeight }) => {
  return fileNames.map((file, index) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
       new PIXI.Loader().add(file).load((_, resources) => {
         resolve(paintMovingSprite({ resource: resources[file], surfaceWidth, surfaceHeight }));
       });
      }, index * 250);
    });
  });
};

export { renderBackground };
