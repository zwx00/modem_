const { GifUtil } = require('gifwrap');
const Jimp = require('jimp');
const fs = require('fs');

const convertGif = path => {
  return new Promise((resolve, reject) => {
    const outName = path.replace('gif', 'spritesheet.png');
    GifUtil.read(`${path}`).then(gif => {
      if (fs.existsSync(outName)) {
        console.log(`${outName} already exists, skipping conversion`);
        resolve({
          frames: gif.frames.length,
          offset: gif.width
        });
        return;
      }

      if (gif.frames.length > 20) {
        console.log(`${path} not ok -> too many frames (${gif.frames.length})`);
        reject(new Error('too many frames'));
        return;
      } else {
        console.log(`${gif.frames.length} frames is ok!`);
      }

      return new Jimp(gif.width * gif.frames.length, gif.height, (err, image) => {
        if (err) {
          console.log(err);
          return;
        }

        Promise.all(gif.frames.map((frame, index) => {
          console.log(`doing ${index} frame of ${gif.frames.length}`);
          console.log(index * gif.width);
          return image.blit(GifUtil.copyAsJimp(Jimp, frame), index * gif.width, 0);
        })).then(() => {
          image.write(outName);
          resolve({
            frames: gif.frames.length,
            offset: gif.width
          });
        });
      });
    });
  });
};

module.exports = {
  convertGif
};
