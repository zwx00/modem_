/* global SC */

import * as PIXI from 'pixi.js';
import * as Menu from './menu.js';
import * as MixCodeFactory from './mix.js';
import MixUrls from './mixurls.json';
import _ from 'lodash';
import * as Soundcloud from './soundcloud.js';
import * as Switcher from './switcher.js';


PIXI.utils.sayHello();

let app = new PIXI.Application({
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
document.body.style.width = "100%";
document.body.style.height = "100%";


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

const renderPage = () => {
  fetch(
    `${IMAGE_HOST}/assets/asset-data.json`
  ).then(response => response.json()).then(AssetData => {
    app.stage.removeChild(backgroundContainer);
    backgroundContainer = new PIXI.Container();
    backgroundContainer.sortableChildren = true;

    renderContainers.menu = Menu.renderMenu([
    ]);

    Switcher.initSwitcher(app);
    /* routing ... */
    if (window.location.hash === '') {
      window.location.hash = `#mix${MIX_COUNT}`;
    }

    const mixName = window.location.hash.replace('#', '');

    const PageRenderer = MixCodeFactory.getMixCode(AssetData, mixName);

    const layers = PageRenderer.getLayers();

    for (const layer of layers) {
      const container = new PIXI.Container();
      container.sortableChildren = true;
      container.zIndex = layer.zIndex;
      const files = getAssets(AssetData, mixName, layer.name);
      layer.renderer.bind(layer)(files, container, app);
      backgroundContainer.addChild(container);
    }

    app.stage.addChild(backgroundContainer);

    if (mixName in MixUrls) {
      Soundcloud.injectSoundcloud(MixUrls[mixName], backgroundContainer, app);
    }

    renderContainers.menu.zIndex = 1000;
    app.stage.addChild(renderContainers.menu);
  })
};
renderPage();

let tout;
window.onresize = () => {  
  clearTimeout(tout);
  tout = setTimeout(() => {
    app.height = window.innerHeight;
    app.width = window.innerWidth;
    app.resize(window.innerHeight, window.innerWidth);
    renderPage();
  }, 250);  
};

export {
  renderPage
};