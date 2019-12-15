import * as Renderers from 'Strategies/Renderers';
import * as Painters from 'Strategies/Painters';

import AssetData from '~/assets/asset-data.json';

const layerMapping = {
  samples: {
    renderer: Renderers.samples,
    painter: Painters.moving
  },
  background: {
    renderer: Renderers.background,
    painter: Painters.background
  },
  default: {
    renderer: Renderers.samples,
    painter: Painters.moving
  }
};

const getMixImports = () => {
  return require.context('babel-loader!./assets', true, /_specific.js/);
};

const getMixCode = (mix) => {
  const mixAbstraction = {
    getLayers () {
      const layers = Object.keys(AssetData[mix]);

      return layers.map(layer => ({
        name: layer,
        ...getLayerRenderer(mix, layer)
      }));
    },
    sayHi () {
      console.log('%c hi', 'background: #222; color: #bada55');
    }
  };
  return mixAbstraction;
};

const getLayerRenderer = (mix, layer) => {
  let layerRenderer;

  if (layerMapping[layer] === undefined) {
    layerRenderer = layerMapping.default;
    console.log(`:: ${layer} has no renderer specificed, defaulting....`);
  } else {
    layerRenderer = layerMapping[layer];
    console.log(`:: ${layer} renderer found`);
  }

  const imports = getMixImports();
  const filename = `./${mix}/${layer}/_specific.js`;
  if (imports.keys().includes(filename)) {
    const importedModule = imports(filename);
    Object.assign(layerRenderer, importedModule.mixClass);
  }
  return layerRenderer;
};

export {
  getMixCode
};
