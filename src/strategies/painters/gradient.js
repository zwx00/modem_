import * as PIXI from 'pixi.js';

class GradientPainter {
    constructor (sprite) {
      this.sprite = sprite;
      this.surfaceWidth = window.innerWidth;
      this.surfaceHeight = window.innerHeight;
  
      this.spriteData = {
      };

      this.sprite.width = this.surfaceWidth;
      this.sprite.height = this.surfaceHeight;
       
    }

    updateSprite (delta) {  
  }
}

 
  
    export {
    GradientPainter
  };

  