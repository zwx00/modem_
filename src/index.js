import * as PIXI from 'pixi.js';

import * as Menu from './menu.js';

import * as MixCodeFactory from './mix.js';

import AssetData from './assets/asset-data.json';

PIXI.utils.sayHello();

const app = new PIXI.Application({
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: 0xffffff,
  autoResize: true
});

document.body.appendChild(app.view);

/* css for fullscreen */
document.body.style.overflow = 'hidden';
document.body.style.padding = 0;
document.body.style.margin = 0;

/* config */
app.renderer.backgroundColor = 0xA9A9A9;
app.stage.sortableChildren = true;

const renderContainers = {
  menu: null
};

const getAssets = (assetsData, mix, layer) => {
  return assetsData[mix][layer].map(
    assetObj => ({
      ...assetObj,
      filename: `assets/${mix}/${layer}/${assetObj.filename}`
    })
  );
};

const renderPage = () => {
  renderContainers.menu = Menu.renderMenu([
    'home',
    'mix series',
    'radio show'
  ]);

  const backgroundContainer = new PIXI.Container();

  /* routing ... */

  let mixName = window.location.hash.replace('#', '');
  if (mixName === '') {
    mixName = 'mix01';
  }

  const PageRenderer = MixCodeFactory.getMixCode(mixName);

  const layers = PageRenderer.getLayers();
  for (const layer of layers) {
    const container = new PIXI.Container();
    container.sortableChildren = true;
    container.zIndex = layer.zIndex;
    const files = getAssets(AssetData, mixName, layer.name);
    layer.renderer.bind(layer)(files, container);
    app.stage.addChild(container);
  }

  app.stage.addChild(backgroundContainer);

  renderContainers.menu.zIndex = 1000;
  app.stage.addChild(renderContainers.menu);
};

renderPage();
