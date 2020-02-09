import * as PIXI from 'pixi.js';
import { SlowBuffer } from 'buffer';

class SplashPainter {
  constructor(sprite, rootStage) {

    
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
    this.spriteSplash.scale.set(0.55, 0.55);

    this.spriteSplash.y = 70;
    this.spriteSplash.x = 0;

    this.spriteSplash.interactive = true;

    const splashbutton = new PIXI.Graphics();

    splashbutton.lineStyle(30, 0xffff1a);
    splashbutton.position.set(0, 95);
    splashbutton.moveTo(0, 0);
    splashbutton.lineTo(0, 116);

    const splashcontainer = new PIXI.Container();
    
    splashcontainer.interactive = true;
    splashcontainer.buttonMode = true;
    splashcontainer.hitArea = new PIXI.Rectangle(0, 95, 50, 120);
    splashcontainer.on('mouseover', (e) => {

      if (this.spriteSplash.x < -10 ) {
        this.spriteData.deltax = 100;
      };
    })

    let initialPassed = false;

    this.onInitialTimepass = () => {
      initialPassed = true;

      const m = rootStage.renderer.plugins.interaction.mouse.global;

      if (!this.spriteSplash.containsPoint(m) && m.x > 50 || m.x === -999999 && m.y === -999999) {
        this.spriteData.deltax = -100;
      }
    }

    this.onTimepass = () => {
      if (initialPassed) { 
        this.spriteData.deltax = -100;
      }
    };

    this.timeMovetimeout = setTimeout(this.onInitialTimepass.bind(this), 8000);

    this.spriteSplash.mouseover = (e) => {
      if (initialPassed) {
        clearTimeout(this.timeMovetimeout);
      }
    }
    
    this.spriteSplash.mouseout = (e) => {
      if (e.data.global.x > 50) {
        this.timeMovetimeout = setTimeout(this.onTimepass.bind(this), 500);
      }
    }

    splashcontainer.addChild(splashbutton);
    this.sprite.addChild(splashcontainer);


  }

  updateSprite(delta) {
    this.spriteSplash.x = this.spriteSplash.x + this.spriteData.deltax;

    if (this.spriteSplash.x < -1000 && this.spriteData.deltax < 0) {
      this.spriteData.deltax = 0;
    }
    

    if (this.spriteSplash.x > -10 && this.spriteData.deltax > 0) {
      this.spriteData.deltax = 0;
    }

  }
}



export {
  SplashPainter
};
