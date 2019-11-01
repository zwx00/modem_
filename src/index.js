import * as PIXI from 'pixi.js';
import * as Menu from './menu.js';
import * as Background from './background.js';

PIXI.utils.sayHello();

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xffffff,
  autoResize: true,
});

document.body.appendChild(app.view);

/* config */
app.renderer.backgroundColor = 0x33ff3f;
app.stage.sortableChildren = true;

const renderContainers = {
  menu: null,
  background: null,
};

const renderPage = () => {
  renderContainers.menu = Menu.renderMenu([
    'home',
    'mix series',
    'radio show'
  ]);
    
  renderContainers.background = Background.renderBackground({
     sheetName: 'reptilianexpo', 
     surfaceWidth: app.renderer.width,
     surfaceHeight: app.renderer.height,
  });

  renderContainers.menu.zIndex = 1000;
  app.stage.addChild(renderContainers.menu);
  app.stage.addChild(renderContainers.background);
};

const resizePage = () => {
  renderContainers.menu.destroy();
  renderContainers.background.destroy();

  app.renderer.resize(window.innerWidth, window.innerHeight);
  renderPage();
};

window.addEventListener('resize', resizePage);

renderPage();
