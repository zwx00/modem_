import Framework from '~/framework';
import { BackgroundPainter } from 'Strategies/painters/background';

const backgroundLayerRenderer = (fileNames, container) => {
  fileNames.forEach((filename) => {
    Framework.paintSprite(filename, BackgroundPainter, container);
  });
};

export { backgroundLayerRenderer };
