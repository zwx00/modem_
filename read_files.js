/* globals require, console */
const fs = require('fs');
const { convertGif } = require('./convert_gifs.js');

const readFolderSafe = (mix, path) => {
  if (fs.existsSync(path)) {
    return Promise.all(fs
      .readdirSync(path)
      .filter(file => (file.endsWith('.png') || file.endsWith('.gif') || file.endsWith('.jpg') || file.endsWith('.jpeg')))
      .sort()
      .reverse()
      .map((file, index) => {
        if (file.endsWith('.gif')) {
          return convertGif(`${path}/${file}`)
            .then((meta) => {
              console.log(meta);

              if (!meta) {
                console.log('its problems');
              }
              return {
                ...meta,
                filename: `assets/${mix}/${file.replace('gif', 'spritesheet.png')}`,
                type: 'animation'
              };
            })
            .catch((err) => {
              console.log(`no go: ${err}`);
            });
        } else if (!file.endsWith('spritesheet.png')) {
          return new Promise(
            (resolve) => {
              resolve(
                {
                  filename: `assets/${mix}/${file}`,
                  type: 'static'
                });
            });
        }
      }));
  } else {
    return [];
  }
};

const getMixFiles = () => {
  const folders = fs
    .readdirSync('src/assets')
    .filter(folder => folder.startsWith('mix'));

  console.log(folders);

  const promises = folders.map(folder => readFolderSafe(
    folder,
    'src/assets/' + folder
  ));
    
  return Promise.all(promises).then(files => {
    console.log(files);
    return folders.map((folder, index) => {
      return {
        [folder]: files[index].reduce((acc, x) => {
          if (x) {
            return [...acc, x];
          } else {
            return acc;
          }
        }, [])
      };
    });
  });
};

getMixFiles().then(files => {
  console.log(files);
  console.log(files);
  fs.writeFile(
    'src/assets/asset-data.json',
    JSON.stringify(files, null, 2),
    err => {
      if (err) {
        console.log(err);
      }
    }
  );
});
