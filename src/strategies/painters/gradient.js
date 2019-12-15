class GradientPainter {
    constructor (sprite) {
      this.sprite = sprite;
      this.surfaceWidth = window.innerWidth;
      this.surfaceHeight = window.innerHeight;
  
      this.spriteData = {
      };

      this.sprite.width = this.surfaceWidth;
      this.sprite.height = this.surfaceHeight;
      
      this.sprite.zIndex = 0;
      console.log ('vtf')
    }

   updateSprite (delta) {
    }
  }
   
  export {
    GradientPainter
  };

  