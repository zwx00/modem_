import * as PIXI from 'pixi.js';

const renderBackground = ({ sheetName, surfaceWidth, surfaceHeight }) => {
  const fileName = `assets/${sheetName}.json`;

  const loader = PIXI.Loader.shared;
  const ticker = PIXI.Ticker.shared;
  
  const container = new PIXI.Container();
  
  const randomDirection = () => {
    return Math.random() > 0.5 ? -1 : 1;
  };

  const paintBackground = (sheet) => {

    let spriteData = new Object();

    Object.keys(sheet.textures).forEach((each) => {
      let texture = new PIXI.Sprite(sheet.textures[each]);
  
      let ratio = (surfaceHeight / texture.height / 3) * Math.random();
      texture.width = texture.width * ratio + 50;
      texture.height = texture.height * ratio + 50;
  
      texture.x = Math.random() * surfaceWidth - texture.width / 2;
      texture.y = Math.random() * surfaceHeight - texture.height / 2;
  
      spriteData[each] = {
        xChange: Math.random() * randomDirection() * 0.05,
        yChange: Math.random() * randomDirection() * 0.05,
        rotationSpeed: Math.random() * 0.0005,
        sprite: texture
      };
  
      container.addChild(texture);
    });
  
    ticker.add((delta) => {
      Object.keys(spriteData).forEach((each) => {
        spriteData[each].sprite.rotation += delta * spriteData[each].rotationSpeed;
  
        if (spriteData[each].sprite.x + delta * spriteData[each].xChange > surfaceWidth) {
          spriteData[each].xChange = -1 * spriteData[each].xChange;
        }
        if (spriteData[each].sprite.y + delta * spriteData[each].xChange > surfaceHeight) {
          spriteData[each].yChange = -1 * spriteData[each].yChange;
        }
  
        if (spriteData[each].sprite.x + delta * spriteData[each].xChange < 0) {
          spriteData[each].xChange = -1 * spriteData[each].xChange;
        }
        if (spriteData[each].sprite.y + delta * spriteData[each].xChange < 0) {
            spriteData[each].yChange = -1 * spriteData[each].yChange;
        }
  
        spriteData[each].sprite.x += delta * spriteData[each].xChange;
        spriteData[each].sprite.y += delta * spriteData[each].yChange;
      });
    });
  };


  if (loader.resources[fileName]) {
    paintBackground(loader.resources[fileName]);
  } else {
    loader.add(fileName).load((_, resources) => {
      paintBackground(resources[fileName]);
    });
  };
  

  return container;
};

export { renderBackground };
