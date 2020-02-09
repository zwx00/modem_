import * as PIXI from 'pixi.js';
import { SlowBuffer } from 'buffer';

class SplashPainter {
  constructor(sprite) {

    
    this.spriteSplash = sprite;

    this.sprite = new PIXI.Container();
    this.sprite.addChild(this.spriteSplash);

    this.surfaceWidth = window.innerWidth;
    this.surfaceHeight = window.innerHeight;
    this.spriteSplash.anchor.set(0);

    this.spriteData = {
      deltax: 0
    };

    // this.spriteSplash
    this.spriteSplash.scale.set(0.5, 0.5);

    this.spriteSplash.y = 100;
    this.spriteSplash.x = 0;

    this.spriteSplash.interactive = true;

    const splashbutton = new PIXI.Graphics();

    splashbutton.lineStyle(20, 0xffff1a);
    splashbutton.position.set(0, 120);
    splashbutton.moveTo(0, 0);
    splashbutton.lineTo(0, 120);
    
    const renderer = PIXI.autoDetectRenderer();

    const texture = renderer.generateTexture(splashbutton);

    const splashcontainer = new PIXI.Sprite(texture);

    splashcontainer.interactive = true;
    splashcontainer.buttonMode = true;
    splashcontainer.hitArea = new PIXI.Rectangle(0, 120, 50, 120);
    splashcontainer.on('mouseover', (e) => {
      console.log('over');
      if (this.spriteSplash.x < -10 ) {
        this.spriteData.deltax = 10;
      };
    })

    splashcontainer.addChild(splashbutton);
    this.sprite.addChild(splashcontainer);

    this.onTimepass = () => {
      this.spriteData.deltax = -10;
    };

    setTimeout(this.onTimepass.bind(this), 2000);
  }

  updateSprite(delta) {
    this.spriteSplash.x = this.spriteSplash.x + this.spriteData.deltax;

    if (this.spriteSplash.x < -800 && this.spriteData.deltax < 0) {
      this.spriteData.deltax = 0;
    }


    if (this.spriteSplash.x > -10 && this.spriteData.deltax > 0) {
      this.spriteData.deltax = 0;
      setTimeout(this.onTimepass.bind(this), 2000);

    }

  }
}



export {
  SplashPainter
};
