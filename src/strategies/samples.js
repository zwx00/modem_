import Utils from '~/utils';
import Framework from '~/framework';
import { MovingSpritePainter } from 'Strategies/painters/moving';

const samplesLayerRenderer = (fileNames, container) => {
  Utils.shuffle(fileNames).forEach((object, index) => {
    Utils.sleep(Math.random() * 10000 * index)
      .then(() => {
        Framework.paintSprite(object, MovingSpritePainter, container);
      });
  });
};

export { samplesLayerRenderer };
