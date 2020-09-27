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

((async () => {
  /*
   * entrypoint
   */

  const mixes = fs.readdir('src/assets', { withFileTypes: true });
  (await mixes).filter(d => d.isDirectory()).map(async mix => {
    const layers = fs.readdir(path.join('src/assets', mix.name), { withFileTypes: true });
    (await layers).filter(d => d.isDirectory()).map(async layer => {

      const pictures = fs.readdir(path.join('src/assets', mix.name, layer.name));
      (await pictures).filter(f => (f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg'))).map(async picture => {
        var image = new Jimp(path.join('src/assets', mix.name, layer.name, picture), function (err, image) {
            if (image.bitmap.width > 3379 || image.bitmap.height > 3379) {
              console.log(chalk.red(`:: ${path.join('src/assets', mix.name, layer.name, picture)} is too large`));
            }
        });


      })
    });
  });
  /*
  */
})());
