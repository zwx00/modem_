import * as PIXI from 'pixi.js';
import * as Menu from './menu.js';

PIXI.utils.sayHello();

const app = new PIXI.Application();

document.body.appendChild(app.view);

/* config */
app.renderer.backgroundColor = 0x061639;
app.stage.sortableChildren = true;

const menuContainer = Menu.constructMenu([
  'my first entry',
  'my second entry',
  'my third entry'
]);

menuContainer.zIndex = 1000;

const randomDirection = () => {
  return Math.random() > 0.5 ? -1 : 1;
};

app.loader.add("assets/reptilianexpo.json").load((loader, resources) => {
  let spriteData = new Object();

  let sheet = loader.resources['assets/reptilianexpo.json'];
  Object.keys(sheet.textures).forEach((each) => {
    let texture = new PIXI.Sprite(sheet.textures[each]);

    let ratio = (app.renderer.height / texture.height / 3) * Math.random();
    texture.width = texture.width * ratio;
    texture.height = texture.height * ratio;

    texture.x = Math.random() * app.renderer.width;
    texture.y = Math.random() * app.renderer.height;

    spriteData[each] = {
      xChange: Math.random() * randomDirection(),
      yChange: Math.random() * randomDirection(),
      rotationSpeed: Math.random() * 0.0005,
      sprite: texture
    };

    app.stage.addChild(texture);
  });

  app.ticker.add((delta) => {
    Object.keys(spriteData).forEach((each) => {
      spriteData[each].sprite.rotation += delta * spriteData[each].rotationSpeed;

      if (spriteData[each].sprite.x + delta * spriteData[each].xChange > app.renderer.width) {
        spriteData[each].xChange = -1 * spriteData[each].xChange;
      }
      if (spriteData[each].sprite.y + delta * spriteData[each].xChange > app.renderer.height) {
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
});

app.stage.addChild(menuContainer);
// app.loader.add('test', 'assets/test.png').load((loader, resources) => {
//   const test = new PIXI.Sprite(resources.test.texture);
// 
//   app.stage.addChild(test);
// });
