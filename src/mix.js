import { backgroundLayerRenderer } from './background.js';

const getMixImports = () => {
  return require.context('babel-loader!./assets', true, /_mix.js/);
};

const getMixCode = (mix) => {
  const imports = getMixImports();
  const mixAbstraction = {
    getLayers () {
      return [
        {
          name: 'background',
          renderer: getLayerRenderer(mix, 'background')
        }
      ];
    },
    sayHi () {
      console.log('%c hi', 'background: #222; color: #bada55');
    }
  };
  const filename = `./${mix}/_mix.js`;
  if (imports.keys().includes(filename)) {
    const importedModule = imports(filename);
    Object.assign(mixAbstraction, importedModule.mixClass);
  }

  return mixAbstraction;
};

const getLayerRenderer = (mix, layer) => {
  if (layer === 'background') {
    return backgroundLayerRenderer;
  }
//  return import(`assets/${mix}/${layer}/_code.js`).catch((err) => {
//    return {
//      sayHi () {
//        console.log('hi..');
//      }
//    };
//  });
};

export {
  getMixCode
};
