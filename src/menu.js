import * as PIXI from 'pixi.js';

const constructTextEntry = (textContent) => {
  
  let text = new PIXI.Text(textContent, {
    fontFamily: 'Arial',
    fontSize: 24,
    fill: 'black',
    align: 'left'
  });
  
  const textBG = new PIXI.Sprite(PIXI.Texture.WHITE);
  
  textBG.width = text.width;
  textBG.height = text.height;
  
  text.interactive = true;
  textBG.tint = 0xffff1a;


  text.mouseover = (mouseData) => {
    textBG.tint = 0xffffff;
  };
  
  text.mouseout = (mouseData) => {
    textBG.tint = 0xffff1a;
  };
  const cage = new PIXI.Container();
  
  cage.addChild(textBG, text);
    return cage;
};

const renderMenu = (nameArray) => {
  const cage = new PIXI.Container();

  for (let i = 0; i < nameArray.length; i++) {
    
    let entry = constructTextEntry(nameArray[i]);

    entry.y = entry.height * i;

    cage.addChild(entry);  

  }
  return cage;
};

export { renderMenu };
