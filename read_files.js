/* globals require, console */
const fs = require('fs').promises;
const chalk = require('chalk');
const { convertGif } = require('./convert_gifs.js');
const Promise = require('bluebird');
const _ = require('lodash');

const DRY = false;

const ASSET_DATA = 'src/assets/asset-data.json';

const readFolderSafe = async (mix, layer) => {
  const path = `src/assets/${mix}/${layer}`;

  try {
    await fs.access(path);
  } catch (e) {
    console.log(chalk.red(`:: WARNING could not access folder ${path}`));

    return [];
  }
  const files = await fs.readdir(path);
  const transformedFiles = files.sort().reverse();

  const gifs = transformedFiles.filter(file => (
    file.endsWith('.gif')
  ));

  const statics = transformedFiles.filter(file => (
    (
      file.endsWith('.png') && !file.endsWith('.spritesheet.png')
    ) ||
    file.endsWith('.jpg') ||
    file.endsWith('.jpeg')
  ));

  const processedStatics = statics.map(file => ({
    filename: `${file}`,
    type: 'static'
  }));

  if (DRY) {
    return processedStatics;
  }

  const spriteSheets = transformedFiles.filter(file => (
    file.endsWith('.spritesheet.png')
  ));

  let cachedFiles;
  try {
    cachedFiles = await fs.readFile(ASSET_DATA);
  } catch (e) {
    console.log(chalk.red('No assets-data.json found! Rebudiling all...'));
    cachedFiles = null;
  }

  let processedSpriteSheets;

  if (cachedFiles) {
    const parsedCachedFiles = JSON.parse(cachedFiles);
    processedSpriteSheets = spriteSheets.map(file => {
      const relevantLayer = _.get(parsedCachedFiles, `${mix}.${layer}`, null);
      if (!relevantLayer) {
        console.log(chalk.red(`LAYER ${layer} has no metadata in ${ASSET_DATA}.`));
        console.log(chalk.red('Delete this spritesheet and run again'));
        throw Error('Delete then try again');
      }
      const cachedMetadata = relevantLayer.find(meta => (meta.filename.endsWith(file)));
      if (!cachedMetadata) {
        console.log(chalk.red(`FILE ${file} has no metadata in ${ASSET_DATA}.`));
        console.log(chalk.red('Delete this spritesheet and run again'));
        throw Error('Delete then try again');
      }

      return cachedMetadata;
    }).filter(x => x); // drop problematic spritesheets
  } else {
    processedSpriteSheets = [];
  }

  const processedGifs = await Promise.map(gifs, async (file) => {
    const spriteSheetName = file.replace(new RegExp('gif$'), 'spritesheet.png');

    if (files.includes(spriteSheetName)) {
      return undefined; // will be handled as spritesheet
    }
    try {
      const meta = await convertGif(`${path}/${file}`);
      return {
        ...meta,
        filename: `${spriteSheetName}`,
        type: 'animation'
      };
    } catch (e) {
      console.log(chalk.red(`couldn't convert ${file}`));
      console.log(e);
      return undefined;
    }
  }).filter(x => x);

  return [...processedStatics, ...processedGifs, ...processedSpriteSheets];
};

const getMixFiles = async () => {
  const mixFolders = await fs.readdir('src/assets');

  const mixObject = {};
  const transformedMixFolders = mixFolders
    .filter(folder => folder.startsWith('mix'));

  await Promise.map(transformedMixFolders, async mix => {
    const layers = await fs.readdir(`src/assets/${mix}`, { withFileTypes: true });

    const transformedLayers = layers.filter(layer => layer.isDirectory()).map(layer => layer.name);
    const layerObject = {};

    await Promise.map(transformedLayers, async layer => {
      const layerFilesArray = await readFolderSafe(mix, layer);
      layerObject[layer] = layerFilesArray;
    });

    mixObject[mix] = layerObject;
  });

  return mixObject;
};

((async () => {
  /*
   * entrypoint
   */

  const files = await getMixFiles();

  fs.writeFile(
    ASSET_DATA,
    JSON.stringify(files, null, 2)
  );

  /*
  */
})());
