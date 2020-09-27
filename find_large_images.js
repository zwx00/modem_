/* globals require, console */
const fs = require('fs').promises;
const fs_nopromise = require('fs');
const chalk = require('chalk');
const { convertGif } = require('./convert_gifs.js');
const Promise = require('bluebird');
const _ = require('lodash');
const path = require('path');
const { kMaxLength } = require('buffer');
var Jimp = require('jimp');


var JimpPromise = (fName) => new Promise((resolve, reject) => {
  new Jimp(fName, (err, image) => {
    if (err) {
      reject(err);
    } else {
      resolve(image);
    }
  });
});

((async () => {
  /*
   * entrypoint
   */

  const mixes = fs.readdir('src/assets', { withFileTypes: true });
  (await mixes).filter(d => d.isDirectory()).map(async mix => {
    const layers = fs.readdir(path.join('src/assets', mix.name), { withFileTypes: true });
    (await layers).filter(d => d.isDirectory()).map(async layer => {

      const pictures = fs.readdir(path.join('src/assets', mix.name, layer.name));

      for (const picture of (await pictures).filter(f => (f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')))) {
        try {
          const jImage = await JimpPromise(path.join('src/assets', mix.name, layer.name, picture));
          if (jImage.bitmap.width * jImage.bitmap.height > 11417641) {
            console.log(chalk.red(`:: ${path.join('src/assets', mix.name, layer.name, picture)} is too large`));
          } else {
            // console.log(chalk.green(`:: ${path.join('src/assets', mix.name, layer.name, picture)} is ok large`))
          }  
        } catch (e) {
          console.log(chalk.red(`:: couldnt open ${picture}`));
        }
      }
    });
  });
  /*
  */
})());
