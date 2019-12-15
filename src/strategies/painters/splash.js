class SplashPainter {
  constructor (sprite) {
    this.sprite = sprite;
    this.surfaceWidth = window.innerWidth;
    this.surfaceHeight = window.innerHeight;
    this.sprite.anchor.set(0.5);

    this.spriteData = {
      tint: Math.random()
    };
    const rx = this.surfaceWidth / this.sprite.width;
    const ry = this.surfaceHeight / this.sprite.height;
    
    console.log (this.sprite.scale)
    if (rx < ry) {
      this.sprite.width = rx * this.sprite.width;
      this.sprite.height = rx * this.sprite.height;
    } else { 
      this.sprite.height = ry * this.sprite.height;
      this.sprite.width = ry * this.sprite.width;
    }

    this.sprite.width = this.sprite.width * 0.65;
    this.sprite.height = this.sprite.height * 0.65;

    this.sprite.y = this.surfaceHeight / 2;
    this.sprite.x = this.surfaceWidth / 2;

    console.log (this.sprite.scale)
  }
  updateSprite (delta) {
  }
}

export {
  SplashPainter
};
