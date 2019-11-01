import * as PIXI from 'pixi.js';
import * as Menu from './menu.js';
import * as Background from './background.js';

PIXI.utils.sayHello();

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xffffff
});

document.body.appendChild(app.view);

/* config */
app.renderer.backgroundColor = 0x33ff3f;
app.stage.sortableChildren = true;

const menuContainer = Menu.renderMenu([
  'home',
  'mix series',
  'radio show'
]);

const backgroundContainer = Background.renderBackground({
 sheetName: 'reptilianexpo', 
 surfaceWidth: app.renderer.width,
 surfaceHeight: app.renderer.height,
});

menuContainer.zIndex = 1000;
app.stage.addChild(menuContainer);
app.stage.addChild(backgroundContainer);
