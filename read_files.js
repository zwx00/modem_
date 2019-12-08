/* globals require, console */
const fs = require('fs').promises;
const chalk = require('chalk');
const { convertGif } = require('./convert_gifs.js');
const Promise = require('bluebird');

const ASSET_DATA = 'src/assets/asset-data.json';

const readFolderSafe = async (mix, path) => {
  try {
    await fs.access(path);
  } catch (e) {
    console.log(chalk.red(':: WARNING could not access folder'));

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

  const spriteSheets = transformedFiles.filter(file => (
    file.endsWith('.spritesheet.png')
  ));

  const cachedFiles = await fs.readFile(ASSET_DATA);
  const parsedCachedFiles = JSON.parse(cachedFiles);
  const processedSpriteSheets = spriteSheets.map(file => {
    const cachedMetadata = parsedCachedFiles[mix].find(meta => (meta.filename.endsWith(file)));

    if (!cachedMetadata) {
      console.log(chalk.red(`${file} has no metadata in ${ASSET_DATA}.`));
      console.log(chalk.red('Delete this spritesheet and run again'));
      return null;
    } else {
      return cachedMetadata;
    }
  }).filter(x => x); // drop problematic spritesheets

  const processedGifs = await Promise.map(gifs, async (file) => {
    const spriteSheetName = file.replace('gif', 'spritesheet.png');

    if (files.includes(spriteSheetName)) {
      return undefined; // will be handled as spritesheet
    }
    try {
      const meta = await convertGif(`${path}/${file}`);
      return {
        ...meta,
        filename: `assets/${mix}/${spriteSheetName}`,
        type: 'animation'
      };
    } catch (e) {
      console.log(chalk.red(`couldn't convert ${file}`));
      return undefined;
    }
  }).filter(x => x);

  const processedStatics = statics.map(file => ({
    filename: `assets/${mix}/${file}`,
    type: 'static'
  }));

  return [...processedStatics, ...processedGifs, ...processedSpriteSheets];
};

const getMixFiles = async () => {
  const folders = await fs.readdir('src/assets');

  const transformedFolders = folders
    .filter(folder => folder.startsWith('mix'));

  const files = await Promise.map(transformedFolders,
    folder => readFolderSafe(
      folder,
      'src/assets/' + folder
    ));

  const foldersObj = transformedFolders
    .map((folder, index) => ({
      [folder]: files[index]
    }))
    .reduce((acc, x) => ({
      ...acc, ...x
    }));

  const out = {};
  for (const [key, val] of Object.entries(foldersObj)) {
    out[key] = val;
  }

  return out;
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
