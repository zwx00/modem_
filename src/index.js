import * as PIXI from 'pixi.js';
import axios from 'axios';

import * as Menu from './menu.js';

import * as MixCodeFactory from './mix.js';

PIXI.utils.sayHello();

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xffffff,
  autoResize: true
});

document.body.appendChild(app.view);

/* config */
app.renderer.backgroundColor = 0xA9A9A9;
app.stage.sortableChildren = true;

const renderContainers = {
  menu: null,
  background: null
};

const renderPage = () => {
  renderContainers.menu = Menu.renderMenu([
    'home',
    'mix series',
    'radio show'
  ]);

  const backgroundContainer = new PIXI.Container();

  axios.get('assets/asset-data.json').then((resp) => {
    /* routing ... */

    let mixName = window.location.hash.replace('#', '');
    if (mixName === '') {
      mixName = 'mix01';
    }

    /* rendering ... */
    const PageRenderer = MixCodeFactory.getMixCode(mixName);

    PageRenderer.sayHi();

    const layers = PageRenderer.getLayers();

    for (const layer of layers) {
      const container = new PIXI.Container();
      layer.renderer(resp.data[mixName], container);
      app.stage.addChild(container);
    }
  });

  app.stage.addChild(backgroundContainer);

  renderContainers.menu.zIndex = 1000;
  app.stage.addChild(renderContainers.menu);
};

renderPage();
