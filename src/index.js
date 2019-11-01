import * as PIXI from 'pixi.js';
import axios from 'axios';

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

let fileNames = null; 

const renderPage = () => {
  renderContainers.menu = Menu.renderMenu([
    'home',
    'mix series',
    'radio show'
  ]);
  
  const backgroundContainer = new PIXI.Container();

  axios.get('assets/asset-data.json').then((resp) => {
    fileNames = resp.data['mix12'];

    Background.renderBackground({
       fileNames, 
       surfaceWidth: app.renderer.width,
       surfaceHeight: app.renderer.height,
    }).map( task => {
      task.then(element => {
        backgroundContainer.addChild(element);
      });
    });
  });

  app.stage.addChild(backgroundContainer);

  renderContainers.menu.zIndex = 1000;
  app.stage.addChild(renderContainers.menu);

};

// const resizePage = () => {
//   renderContainers.menu.destroy();
//   renderContainers.background.destroy();
// 
//   app.renderer.resize(window.innerWidth, window.innerHeight);
//   renderPage();
// };
// 
// window.addEventListener('resize', resizePage);
// 
renderPage();
