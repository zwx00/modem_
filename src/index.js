/* global SC */

import * as PIXI from 'pixi.js';
import * as Menu from './menu.js';
import * as MixCodeFactory from './mix.js';
import AssetData from './assets/asset-data.json';
import MixUrls from './mixurls.json';
import _ from 'lodash';

const MIX_COUNT = 30;

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

let widget = null;

//gumba naprej nazaj
const constructTextEntry = (textContent) => {
  const text = new PIXI.Text(textContent, {
    fontFamily: 'Arial',
    fontSize: 55,
    fill: 'black',
    fontStretch: 'extra-condensed',
  });
  text.anchor.set(0.5);
  const txtBG = new PIXI.Sprite(PIXI.Texture.WHITE);
  txtBG.anchor.set(0.5);
  txtBG.tint = 0xffff1a;
  txtBG.width = text.height,txtBG.height = text.height;
  const cage = new PIXI.Container();
  cage.interactive = true;
  cage.buttonMode = true;

  cage.mouseover = (mouseData) => {
    txtBG.tint = 0xffffff;
  };

  cage.mouseout = (mouseData) => {
    txtBG.tint = 0xffff1a;
  };

  cage.addChild(txtBG,text);
  return cage;
};

const fwdButton = constructTextEntry('>');

const bwButton = constructTextEntry('<');
fwdButton.zIndex = 1200
bwButton.zIndex = 1200;
bwButton.x = window.innerWidth - 31;
bwButton.y = window.innerHeight - 80;
fwdButton.x = window.innerWidth - 31;
fwdButton.y = window.innerHeight - 160;
app.stage.addChild(fwdButton, bwButton);



//

const injectSoundcloud = async (src, targetContainer) => {
  const oldIframe = document.querySelector('body > iframe');
  console.log(oldIframe);
  if (oldIframe) {
    document.body.removeChild(oldIframe);
  }
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none'
  iframe.id = 'sc-widget';

  iframe.setAttribute('allow', 'autoplay');

  iframe.src = src;

  document.body.appendChild(iframe);

  widget = SC.Widget(iframe);
  

  
  const playGfx = new PIXI.Graphics();
  playGfx.position.set(0, 0);

  playGfx.lineStyle(5, 0xffff1a);

  playGfx.beginFill(0xffff1a, 1);
  playGfx.drawPolygon(0, 10, 80, 55, 0, 100);

  playGfx.endFill();

  const pauseGfx = new PIXI.Graphics();

  pauseGfx.position.set(0, 0);

  pauseGfx.lineStyle(2, 0xffff1a);
  pauseGfx.beginFill(0xffff1a, 1);

  pauseGfx.drawRect(0, 10, 25, 80);
  pauseGfx.drawRect(45, 10, 25, 80);

  pauseGfx.endFill();
  
  
  const playPauseSprite = new PIXI.AnimatedSprite( 
    [
      app.renderer.generateTexture(playGfx, 0, 1, new PIXI.Rectangle(0, 0, 100, 120)),
      app.renderer.generateTexture(pauseGfx, 0, 1, new PIXI.Rectangle(0, 0, 100, 120))
    ]
  );

  playPauseSprite.gotoAndStop(0);
  playPauseSprite.x = 500;
  playPauseSprite.y = 500;

  playPauseSprite.zIndex = 12000;
  playPauseSprite.interactive = true;
  playPauseSprite.buttonMode = true;

  playPauseSprite.x = 25;
  playPauseSprite.y = window.innerHeight - 150;
  targetContainer.addChild(playPauseSprite);

  let playing = false;

  widget.bind(SC.Widget.Events.READY, () => {
    playPauseSprite.on('pointerdown', () => {
      if (playing) {
        widget.pause();
        playPauseSprite.gotoAndStop(0);
        playing = false;
      } else {
        playing = true;
        playPauseSprite.gotoAndStop(1);
        widget.play();
      }
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
    myGraph.position.set(0, window.innerHeight);
    myGraph.lineStyle(40, 0xffff1a)
      .moveTo(0, 0)
      .lineTo(progress.relativePosition * window.innerWidth, 0)
  })

  container2.hitArea = new PIXI.Rectangle(0, window.innerHeight - 50, window.innerWidth, 50);

  container2.on('pointerdown', (e) => {
    widget.getDuration(function (duration) {
      widget.seekTo(duration * e.data.global.x / window.innerWidth);
    })
  })
};

const renderPage = () => {
  app.stage.removeChild(backgroundContainer);
  backgroundContainer = new PIXI.Container();
  backgroundContainer.sortableChildren = true;

  renderContainers.menu = Menu.renderMenu([
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
    layer.renderer.bind(layer)(files, container, app);
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

function changeMix(difference) {
  if (window.location.hash !== '') {
    const mixNum = Number(window.location.hash.replace('#mix', ''));

    if ((difference < 0 && mixNum + difference > 0) || (difference > 0 && mixNum + difference <= MIX_COUNT)) {
      const paddedMixNum = `0000${mixNum + difference}`.slice(-2);

      window.location.hash = `#mix${paddedMixNum}`;
      renderPage();
    }
  }
};



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

document.addEventListener('keydown', (e) => {
  console.log(':: doing the switch');
  e = e || window.event;
  if (e.keyCode === 37) {
    changeMix(-1);
  } else if (e.keyCode === 39) {
    changeMix(+1);
  }
});

function changeMixFwd() {
  changeMix(1);
}
function changeMixBw() {
  changeMix(-1);
}
fwdButton.on("click", changeMixFwd);
bwButton.on("click", changeMixBw);