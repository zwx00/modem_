import Utils from '~/utils';
import * as PIXI from 'pixi.js';

function randn_bm(min, max, skew) {
  var u = 0, v = 0;
  while(u === 0) u = Math.random(); //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random();
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );

  num = num / 10.0 + 0.5; // Translate to 0 -> 1
  if (num > 1 || num < 0) num = randn_bm(min, max, skew); // resample between 0 and 1 if out of range
  num = Math.pow(num, skew); // Skew
  num *= max - min; // Stretch to fill range
  num += min; // offset to min
  return num;
}
class MovingSpritePainter {
  constructor (sprite) {
    this.surfaceWidth = window.innerWidth;
    this.surfaceHeight = window.innerHeight;
    const i = randn_bm(100, 10000, 7)
    const ratio = i / sprite.width;
    this.sprite = sprite;

    this.sprite.width = i
    this.sprite.height = sprite.height * ratio; 

    this.sprite.x = Math.random() * this.surfaceWidth - sprite.width / 2;
    this.sprite.y = Math.random() * this.surfaceHeight - sprite.height / 2;

    this.spriteData = {
      xChange: Math.random() * Utils.randomDirection() * 0.0000005,
      yChange: Math.random() * Utils.randomDirection() * 0.0000005,
      rotationSpeed: Math.random() * 0.00000002
    };

    this.sprite.interactive = true;

    this.sprite.buttonMode = true;

    this.sprite.anchor.set(0.5);

    this.sprite
      .on('pointerdown', onDragStart)
      .on('pointerup', onDragEnd)
      .on('pointerupoutside', onDragEnd)
      .on('pointermove', onDragMove);

    function onDragStart (event) {
      this.data = event.data;
      this.alpha = 0.8;
      this.dragging = true;
    }

    function onDragEnd () {
      this.alpha = 1;
      this.dragging = false;
      this.data = null;
      this.sprite.scale.x *= 1.25;
      this.sprite.scale.y *= 1.25;
    }

    function onDragMove () {
      if (this.dragging) {
        const newPosition = this.data.getLocalPosition(this.parent);
        this.x = newPosition.x;
        this.y = newPosition.y;
      }
    }
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

  
  }
}

export {
  MovingSpritePainter
};
