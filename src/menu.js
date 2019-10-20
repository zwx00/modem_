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
  text.mouseover = (mouseData) => {
    textBG.alpha = 0.1;
  };
  
  text.mouseout = (mouseData) => {
    textBG.alpha = 1;
  };
  
  const cage = new PIXI.Container();
  
  cage.addChild(textBG, text);
    return cage;
};

const constructMenu = (nameArray) => {
  const cage = new PIXI.Container();

  for (let i = 0; i < nameArray.length; i++) {
    
    let entry = constructTextEntry(nameArray[i]);

    entry.y = entry.height * i;

    cage.addChild(entry);  

  }
  return cage;
};

export { constructMenu };
