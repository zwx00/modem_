import Utils from '~/utils';

class MistPainter {
  constructor (sprite) {
    this.surfaceWidth = window.innerWidth;
    this.surfaceHeight = window.innerHeight;

    this.sprite = sprite;

    this.sprite.alpha = Math.random() * 0.75;

    this.sprite.width = this.surfaceWidth * 2;
    this.sprite.height = this.surfaceHeight * 2;

    this.spriteData = {
      xChange: Math.random() * Utils.randomDirection() * 0.085,
      yChange: Math.random() * Utils.randomDirection() * 0.085,
      rotationSpeed: Math.random() * 0.00000002,
      alpha: Math.random() * 3,
      alphaChange: Math.random()
    };

    this.sprite.zIndex = 1;
  }

  updateSprite (delta) {
    this.sprite.rotation += delta * this.spriteData.rotationSpeed;

    if (this.sprite.x + delta * this.spriteData.xChange > this.surfaceWidth) {
      this.spriteData.xChange = -1 * this.spriteData.xChange;
    }
    if (this.sprite.y + delta * this.spriteData.xChange > this.surfaceHeight) {
      this.spriteData.yChange = -1 * this.spriteData.yChange;
    }

    if (this.sprite.x + delta * this.spriteData.xChange < 0) {
      this.spriteData.xChange = -1 * this.spriteData.xChange;
    }
    if (this.sprite.y + delta * this.spriteData.xChange < 0) {
      this.spriteData.yChange = -1 * this.spriteData.yChange;
    }

    this.sprite.x += delta * this.spriteData.xChange;
    this.sprite.y += delta * this.spriteData.yChange;

    this.spriteData.alpha += delta * 0.01 * this.spriteData.alphaChange;
    this.sprite.alpha = Math.sin(this.spriteData.alpha);
  }
}

export { 
  MistPainter };
