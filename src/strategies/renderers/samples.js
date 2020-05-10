import Utils from '~/utils';
import Framework from '~/framework';

const randomElement = (arr, exclude = []) => {
  if (arr.length === 1) {
    return arr[0];
  }

  let candidate;
  while (candidate === undefined || exclude.includes(candidate.filename)) {
    const selectedIndex = Math.floor(Math.random() * arr.length);
    candidate = arr[selectedIndex];
  }

  return candidate;
};

const samplesLayerRenderer = async function (fileNames, container, rootStage) {

  let painted = [];
  while (true) {
    await Utils.sleep(Math.random() * 5000);

    const selectedFile = randomElement(fileNames, painted);

    Framework.paintSprite.bind(this)(selectedFile, container, rootStage);
    painted.push(selectedFile.filename);

    if (painted.length > 13) {
      const randomChild = randomElement(container.children);

      container.removeChild(randomChild);

      painted = painted.filter(file => randomChild._filename !== file);
    }
  }
};

export { samplesLayerRenderer };
