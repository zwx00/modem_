import Utils from '~/utils';
import fn from 'periodic-function';
import * as PIXI from 'pixi.js';

class MistPainter {
  constructor (sprite) {
    this.surfaceWidth = window.innerWidth;
    this.surfaceHeight = window.innerHeight;

    this.sprite = sprite;

    this.sprite.width = this.surfaceWidth * 1.5;
    this.sprite.height = this.surfaceHeight * 1.5;

    this.sprite.x = Math.random() * this.surfaceWidth - sprite.width / 2;
    this.sprite.y = Math.random() * this.surfaceHeight - sprite.height / 2;

    this.spriteData = {
      xChange: Math.random() * Utils.randomDirection() * 0.085,
      yChange: Math.random() * Utils.randomDirection() * 0.085,
      alpha: Math.random() * 37,
      alphaChange: Math.random()
    };
    
  }

  updateSprite (delta) {

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

    this.spriteData.alpha += delta * 0.004 * this.spriteData.alphaChange;
    this.sprite.alpha = fn.triangle(this.spriteData.alpha * 0.1);

  }
}

export { 
  MistPainter };
