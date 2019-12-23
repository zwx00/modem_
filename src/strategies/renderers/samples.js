import Utils from '~/utils';
import Framework from '~/framework';

const randomElement = (arr, exclude = []) => {
  let candidate;
  while (candidate === undefined || exclude.includes(candidate.filename)) {
    const selectedIndex = Math.floor(Math.random() * arr.length);
    candidate = arr[selectedIndex];
  }

  return candidate;
};

const samplesLayerRenderer = async function (fileNames, container) {
  let painted = [];

  while (true) {
    await Utils.sleep(Math.random() * 2000);

    const selectedFile = randomElement(fileNames, painted);

    Framework.paintSprite.bind(this)(selectedFile, container);
    painted.push(selectedFile.filename);

    if (painted.length > 16) {
      const randomChild = randomElement(container.children);

      container.removeChild(randomChild);

      painted = painted.filter(file => randomChild._filename !== file);
    }
  }
};

export { samplesLayerRenderer };
