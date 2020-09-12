import * as PIXI from 'pixi.js';
import { renderPage } from './index.js';

const MIX_COUNT = 36;

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
  txtBG.width = text.height, txtBG.height = text.height;
  const cage = new PIXI.Container();
  cage.interactive = true;
  cage.buttonMode = true;

  cage.mouseover = (mouseData) => {
    txtBG.tint = 0xffffff;
  };

  cage.mouseout = (mouseData) => {
    txtBG.tint = 0xffff1a;
  };

  cage.addChild(txtBG, text);
  return cage;
};


const initSwitcher = (app) => {
  const fwdButton = constructTextEntry('>');

  const bwButton = constructTextEntry('<');
  fwdButton.zIndex = 1200
  bwButton.zIndex = 1200;
  bwButton.x = window.innerWidth - 31;
  bwButton.y = window.innerHeight - 80;
  fwdButton.x = window.innerWidth - 31;
  fwdButton.y = window.innerHeight - 160;
  app.stage.addChild(fwdButton, bwButton);

  function changeMixFwd() {
    changeMix(1);
  }
  function changeMixBw() {
    changeMix(-1);
  }
  fwdButton.on("click", changeMixFwd);
  bwButton.on("click", changeMixBw);
}

export {
  initSwitcher
};