import Utils from '~/utils';

class BackgroundPainter {
  constructor (sprite) {
    this.surfaceWidth = window.innerWidth;
    this.surfaceHeight = window.innerHeight;

    this.sprite = sprite;

    this.sprite.alpha = Math.random();

    this.sprite.width = this.surfaceWidth;
    this.sprite.height = this.surfaceHeight;

    this.sprite.x = Math.random() * this.surfaceWidth - sprite.width / 2;
    this.sprite.y = Math.random() * this.surfaceHeight - sprite.height / 2;

    this.spriteData = {
      xChange: Math.random() * Utils.randomDirection() * 0.085,
      yChange: Math.random() * Utils.randomDirection() * 0.085,
      alpha: Math.random() * 10,
      alphaChange: Math.random(),
      rotationSpeed: Math.random() * 0.00000002
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

    this.spriteData.alpha += delta * 0.005 * this.spriteData.alphaChange;
    this.sprite.alpha = Math.sin(this.spriteData.alpha);
  }
}

export { BackgroundPainter };
