import Utils from './utils';
import Framework from './framework';

class BackBackPainter {
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
      xChange: Math.random() * Utils.randomDirection() * 0.0000005,
      yChange: Math.random() * Utils.randomDirection() * 0.0000005,
      rotationSpeed: Math.random() * 0.00000002
    };
  }

  updateSprite (delta) {
    
  }
}

const backbackLayerRenderer = (fileNames, container) => {
  fileNames.forEach((filename) => {
    Framework.paintSprite(filename, BackBackPainter, container);
  });
};

export { backbackLayerRenderer };
