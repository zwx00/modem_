import Utils from './utils';
import Framework from './framework';

class MovingSpritePainter {
  constructor (sprite) {
    this.surfaceWidth = window.innerWidth;
    this.surfaceHeight = window.innerHeight;

    const ratio = (this.surfaceHeight / sprite.height / 5) * Math.random();

    this.sprite = sprite;

    this.sprite.width = sprite.width * ratio + 50;
    this.sprite.height = sprite.height * ratio + 50;

    this.sprite.x = Math.random() * this.surfaceWidth - sprite.width / 2;
    this.sprite.y = Math.random() * this.surfaceHeight - sprite.height / 2;

    this.spriteData = {
      xChange: Math.random() * Utils.randomDirection() * 0.000005,
      yChange: Math.random() * Utils.randomDirection() * 0.000005,
      rotationSpeed: Math.random() * 0.00000002
    };
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

const backgroundLayerRenderer = (fileNames, container) => {
  Utils.shuffle(fileNames).forEach((object, index) => {
    Utils.sleep(2000 * index)
      .then(() => {
        Framework.paintSprite(object, MovingSpritePainter, container);
      });
  });
};

export { backgroundLayerRenderer };
