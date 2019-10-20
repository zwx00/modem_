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

app.loader.add("assets/reptilianexpo.json").load((loader, resources) => {
  let sheet = loader.resources['assets/reptilianexpo.json'];
  Object.keys(sheet.textures).forEach((each) => {
    let texture = new PIXI.Sprite(sheet.textures[each]);
    texture.width = texture.width % 200;
    texture.height = texture.height % 200;
    texture.x = 200;
    texture.y = 200;
    app.stage.addChild(texture);
  });
});

app.stage.addChild(menuContainer);
// app.loader.add('test', 'assets/test.png').load((loader, resources) => {
//   const test = new PIXI.Sprite(resources.test.texture);
// 
//   app.stage.addChild(test);
// });
