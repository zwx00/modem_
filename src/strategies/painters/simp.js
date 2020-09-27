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

class SimpPainter {
  constructor (sprite) {
    this.surfaceWidth = window.innerWidth;
    this.surfaceHeight = window.innerHeight;
    const i = randn_bm(450, 9000, 7)
    const ratio = i / sprite.width;
    
    this.sprite = sprite;

    this.sprite.anchor.set(0.5);

    this.sprite.width = i
    this.sprite.height = sprite.height * ratio; 

    this.sprite.x = Math.random() * this.surfaceWidth;
    this.sprite.y = Math.random() * this.surfaceHeight;

    this.sprite.zIndex = 10;
  }

  updateSprite (delta) {
    

  }
}

export { 
  SimpPainter };
