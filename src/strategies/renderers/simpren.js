import Utils from '~/utils';
import Framework from '~/framework';
import * as PIXI from 'pixi.js';

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

const simprenLayerRenderer = async function (fileNames, container, rootStage) {

  let painted = [];
  while (true) {
    await Utils.sleep(Math.random() * 2000);

    const selectedFile = randomElement(fileNames, painted);

    Framework.paintSprite.bind(this)(selectedFile, container, rootStage);
    painted.push(selectedFile.filename);

    if (painted.length > 25) {
      const randomChild = randomElement(container.children);

      container.removeChild(randomChild);

      randomChild.destroy();

      if (randomChild.textures) {
        for (let t of randomChild.textures) {
          for (let id of t["baseTexture"].textureCacheIds) {
            delete PIXI.utils.TextureCache[id];
          }
        }
      } else if (randomChild.texture) {
        for (let id of randomChild.texture["baseTexture"].textureCacheIds) {
          delete PIXI.utils.TextureCache[id];
        }
      }

      painted = painted.filter(file => randomChild._filename !== file);
    }
  }
};

export { simprenLayerRenderer };
