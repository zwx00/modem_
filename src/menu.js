import * as PIXI from 'pixi.js';

const constructTextEntry = (textContent) => {
  const text = new PIXI.Text(textContent, {
    fontFamily: 'Arial',
    fontSize: 23,
    fill: 'black',
    fontStretch: 'extra-condensed'
  });

  const textBG = new PIXI.Sprite(PIXI.Texture.WHITE);

  text.x = 16;
  textBG.width = 130;
  textBG.height = 28;

  textBG.interactive = true;
  textBG.tint = 0xffff1a;

  textBG.mouseover = (mouseData) => {
    textBG.tint = 0xffffff;
  };

  textBG.mouseout = (mouseData) => {
    textBG.tint = 0xffff1a;
  };
  const cage = new PIXI.Container();

  cage.addChild(textBG, text);
  return cage;
};

const renderMenu = (nameArray) => {
  const cage = new PIXI.Container();

  for (let i = 0; i < nameArray.length; i++) {
    const entry = constructTextEntry(nameArray[i]);

    entry.y = entry.height * i;

    cage.addChild(entry);
  }
  return cage;
};

export { renderMenu };
