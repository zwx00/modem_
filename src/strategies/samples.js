import Utils from '~/utils';
import Framework from '~/framework';

const samplesLayerRenderer = function (fileNames, container) {
  Utils.shuffle(fileNames).forEach((object, index) => {
    Utils.sleep(Math.random() * 10000 * index)
      .then(() => {
        Framework.paintSprite.bind(this)(object, container);
      });
  });
};

export { samplesLayerRenderer };
