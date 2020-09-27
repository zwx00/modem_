/* globals require, console */
const fs = require('fs').promises;
const chalk = require('chalk');
const { convertGif } = require('./convert_gifs.js');
const Promise = require('bluebird');
const _ = require('lodash');
const path = require('path');




((async () => {
  /*
   * entrypoint
   */

  const mixes = fs.readdir('src/assets', { withFileTypes: true });
  (await mixes).filter(d => d.isDirectory()).map(async mix => {
    const layers = fs.readdir(path.join('src/assets', mix.name), { withFileTypes: true });
    (await layers).filter(d => d.isDirectory()).map(async layer => {

      const pictures = fs.readdir(path.join('src/assets', mix.name, layer.name));
      (await pictures).filter(f => (f.endsWith('.gif') || f.endsWith('.png') || f.endsWith('.jpg') || f.endsWith('.jpeg')) && !f.endsWith('spritesheet.png')).map(async picture => {

        const rename = picture.match(/[A-Za-z0-9\.]/g).join('');
        if (rename != picture) {
          if (rename.length < 7) {
            console.log(chalk.red(`:::: Rename ${picture} manually`));
          } else {
            const newPath = path.join('src/assets', mix.name, layer.name, `${rename}`);

            if (fs.existsSync(newPath)) {
              console.log(chalk.red(`:::: Cannot copy ${picture}, ${rename} exists`));
            } else {
              await fs.rename(path.join('src/assets', mix.name, layer.name, picture), );
              console.log(`:: renaming ${picture} to ${rename}`);  
            }

          }
        }

      })
    });
  });
  /*
  */
})());
