import Utils from '~/utils';
import fn from 'periodic-function';

class BackgroundPainter {
  constructor (sprite) {
    this.surfaceWidth = window.innerWidth;
    this.surfaceHeight = window.innerHeight;

    this.sprite = sprite;

    this.sprite.alpha = Math.random();

    this.sprite.width = this.surfaceWidth;
    this.sprite.height = this.surfaceHeight;

    this.sprite.x = Math.random() * this.surfaceWidth;
    this.sprite.y = Math.random() * this.surfaceHeight;

    this.sprite.anchor.set(0.5);

    this.spriteData = {
      xChange: Math.random() * Utils.randomDirection() * 0.085,
      yChange: Math.random() * Utils.randomDirection() * 0.085,
      alpha: Math.random() * 100,
      alphaChange: Math.random()
    };

    this.sprite.zIndex = 1;
  }

  updateSprite (delta) {

    if (this.sprite.x + delta * this.spriteData.xChange > this.surfaceWidth) {
      this.spriteData.xChange = -1 * this.spriteData.xChange;
    }
    if (this.sprite.y + delta * this.spriteData.yChange > this.surfaceHeight) {
      this.spriteData.yChange = -1 * this.spriteData.yChange;
    }

    if (this.sprite.x + delta * this.spriteData.xChange < 0) {
      this.spriteData.xChange = -1 * this.spriteData.xChange;
    }
    if (this.sprite.y + delta * this.spriteData.yChange < 0) {
      this.spriteData.yChange = -1 * this.spriteData.yChange;
    }

    this.sprite.x += delta * this.spriteData.xChange;
    this.sprite.y += delta * this.spriteData.yChange;

    this.spriteData.alpha += delta * 0.004 * this.spriteData.alphaChange;
    this.sprite.alpha = fn.triangle(this.spriteData.alpha * 0.2);
  }
}

export { 
  BackgroundPainter };
