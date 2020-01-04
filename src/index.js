/* global SC */

import * as PIXI from 'pixi.js';
import * as Menu from './menu.js';
import * as MixCodeFactory from './mix.js';
import AssetData from './assets/asset-data.json';
import MixUrls from './mixurls.json';

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

const injectSoundcloud = async (src) => {
  const iframe = document.createElement('iframe');

  iframe.id = 'sc-widget';

  iframe.setAttribute('allow', 'autoplay');

  iframe.src = src;

  document.body.appendChild(iframe);

  const widget = SC.Widget(iframe);
  const graphics = new PIXI.Graphics();

  graphics.lineStyle(5, 0xffff1a);

  graphics.beginFill(0xffff1a, 1);
  graphics.drawPolygon(25, 120, 25 + 80, 120 + 50, 25, 120 + 100);

  graphics.endFill();
  const container = new PIXI.Container();

  container.addChild(graphics);

  container.buttonMode = true;
  container.interactive = true;
  container.zIndex = 2000;

  app.stage.addChild(container);

  widget.bind(SC.Widget.Events.READY, () => {
    container.on('pointerdown', () => {
      console.log(':: playing audio');
      widget.play();
    });
  });
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

  if (mixName in MixUrls) {
    injectSoundcloud(MixUrls[mixName]);
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
