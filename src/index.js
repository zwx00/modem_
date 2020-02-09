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
  graphics.drawPolygon(25, 975, 25 + 80, 975 + 50, 25, 975 + 100);

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
      gfx.drawPolygon(25, 975, 25 + 80, 975 + 50, 25, 975 + 100);

      gfx.endFill();
      container.addChild(gfx);
      console.log(':: playing audio');
      widget.play();
    });
  });

  let myGraph = new PIXI.Graphics();
  const container2 = new PIXI.Container();

  container2.addChild(myGraph);
  myGraph.buttonMode = true;
  myGraph.interactive = true;
  myGraph.zIndex = 3000;

  targetContainer.addChild(container2);

  container2.buttonMode = true;
  container2.interactive = true;
  container2.zIndex = 3000;


  widget.bind(SC.Widget.Events.PLAY_PROGRESS, (progress) => {
    myGraph.clear();
    myGraph.position.set(0, 1110);
    myGraph.lineStyle(20, 0xffff1a)
      .moveTo(0, 0)
      .lineTo(progress.relativePosition * window.innerWidth, 0)
  })

  container2.hitArea = new PIXI.Rectangle(0, 1050, 2000, 1050);

  container2.on('pointerdown', (e) => {
    widget.getDuration(function (duration) {
      widget.seekTo(duration)
    })
  })


  let splashbutton = new PIXI.Graphics();
  const container3 = new PIXI.Container();

  targetContainer.addChild(container3);

  container3.buttonMode = true;
  container3.interactive = true;
  container3.zIndex = 3001;

  container3.addChild(splashbutton);

  splashbutton.interactive = true;
  splashbutton.zIndex = 3001;

  splashbutton.position.set(0, 96);

  splashbutton.lineStyle(24, 0xffff1a)
    .moveTo(0, 0)
    .lineTo(0, 120)

  container2.hitArea = new PIXI.Rectangle(0, 1050, 2000, 1050);

  container3.mouseover = (mouseData) => {
    splashbutton.tint = 0xffffff;
  };

  container3.mouseout = (mouseData) => {
    splashbutton.tint = 0xffff1a;
  };


  let menubutton = new PIXI.Graphics();

  container.addChild(menubutton);

  menubutton.buttonMode = true;
  menubutton.interactive = true;
  menubutton.zIndex = 3002;

  menubutton.position.set(0, 0);

  menubutton.lineStyle(25, 0xffff1a)
    .moveTo(0, 0)
    .lineTo(0, 84)

  menubutton.interactive = true;

  menubutton.mouseover = (mouseData) => {
    menubutton.tint = 0xffffff;
  };

  menubutton.mouseout = (mouseData) => {
    menubutton.tint = 0xffff1a;
  };
};

const renderPage = () => {
  app.stage.removeChild(backgroundContainer);
  backgroundContainer = new PIXI.Container();
  backgroundContainer.sortableChildren = true;

  renderContainers.menu = Menu.renderMenu([
    'home',
    'dial-up',
    'radio show',
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

    if ((difference < 0 && mixNum + difference > 0) || (difference > 0 && mixNum + difference <= MIX_COUNT)) {
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
