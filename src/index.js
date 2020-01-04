/* global SC */

import * as PIXI from 'pixi.js';
import * as Menu from './menu.js';
import * as MixCodeFactory from './mix.js';
import AssetData from './assets/asset-data.json';
import MixUrls from './mixurls.json';

const MIX_COUNT = 26;

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

let backgroundContainer = new PIXI.Container();

let widget = null;

const injectSoundcloud = async (src, targetContainer) => {
  const oldIframe = document.querySelector('body > iframe');
  console.log(oldIframe);
  if (oldIframe) {
    document.body.removeChild(oldIframe);
  }
  const iframe = document.createElement('iframe');

  iframe.id = 'sc-widget';

  iframe.setAttribute('allow', 'autoplay');

  iframe.src = src;

  document.body.appendChild(iframe);

  widget = SC.Widget(iframe);
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

  targetContainer.addChild(container);

  widget.bind(SC.Widget.Events.READY, () => {

    container.on('pointerdown', () => {
      const gfx = new PIXI.Graphics();
      gfx.lineStyle(5, 0xffff1a);

      gfx.beginFill(0xffffff, 1);
      gfx.drawPolygon(25, 120, 25 + 80, 120 + 50, 25, 120 + 100);

      gfx.endFill();
      container.addChild(gfx);
      console.log(':: playing audio');
      widget.play();
    });
  });
};

const renderPage = () => {
  app.stage.removeChild(backgroundContainer);
  backgroundContainer = new PIXI.Container();

  renderContainers.menu = Menu.renderMenu([
    'home',
    'mix series',
    'radio show'
  ]);

  /* routing ... */

  if (window.location.hash === '') {
    window.location.hash = `#mix${MIX_COUNT}`;
  }

  const mixName = window.location.hash.replace('#', '');

  const PageRenderer = MixCodeFactory.getMixCode(mixName);

  const layers = PageRenderer.getLayers();
  for (const layer of layers) {
    const container = new PIXI.Container();
    container.sortableChildren = true;
    container.zIndex = layer.zIndex;
    const files = getAssets(AssetData, mixName, layer.name);
    layer.renderer.bind(layer)(files, container);
    backgroundContainer.addChild(container);
  }

  app.stage.addChild(backgroundContainer);

  if (mixName in MixUrls) {
    injectSoundcloud(MixUrls[mixName], backgroundContainer);
  }

  renderContainers.menu.zIndex = 1000;
  app.stage.addChild(renderContainers.menu);
};

renderPage();

const changeMix = (difference) => {
  if (window.location.hash !== '') {
    const mixNum = Number(window.location.hash.replace('#mix', ''));

    if (difference > 0 && mixNum + difference <= MIX_COUNT) {
      window.location.hash = `#mix${mixNum + difference}`;
      renderPage();
    }

    if (difference < 0 && mixNum + difference > 0) {
      const paddedMixNum = `0000${mixNum + difference}`.slice(-2);

      window.location.hash = `#mix${paddedMixNum}`;
      renderPage();
    }
  }
};

document.addEventListener('keydown', (e) => {
  console.log(':: doing the switch');
  e = e || window.event;
  if (e.keyCode === 37) {
    changeMix(-1);
  } else if (e.keyCode === 39) {
    changeMix(+1);
  }
});
