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
    let ratio = (app.renderer.height / texture.height / 3) * Math.random () 
    texture.width = texture.width * ratio;
    texture.height = texture.height * ratio;
    texture.x = Math.random() * app.renderer.width  ;
    texture.y = Math.random() * app.renderer.height;
    app.stage.addChild(texture);
  });
});

app.stage.addChild(menuContainer);
// app.loader.add('test', 'assets/test.png').load((loader, resources) => {
//   const test = new PIXI.Sprite(resources.test.texture);
// 
//   app.stage.addChild(test);
// });
