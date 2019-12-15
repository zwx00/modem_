import Framework from '~/framework';

const backgroundLayerRenderer = function (fileNames, container) {
  fileNames.forEach((filename) => {
    Framework.paintSprite.bind(this)(filename, container);
  });
};

export { backgroundLayerRenderer };
