/* globals require, console */
const fs = require('fs');
const _ = require('lodash');

const readFolderSafe = (mix, path) => {
  if (fs.existsSync(path)) {
    return fs
      .readdirSync(path)
      .filter(file => (file.endsWith('.png') || file.endsWith('.gif') || file.endsWith('.jpg') || file.endsWith('.jpeg')))
      .sort()
      .reverse()
      .map((file, index) => {
        return `assets/${mix}/${file}`;
      });
  } else {
    return [];
  }
};

const getMixFiles = () => {
  const files = fs
    .readdirSync('src/assets')
    .filter(folder => folder.startsWith('mix'))
    .map(folder => ({
      [folder]: readFolderSafe(
        folder,
        'src/assets/' + folder
      )
    }))
    .reduce((acc, x) => {
      return _.merge(acc, x);
    }, {})
  ;

  return files;
};

fs.writeFile(
  'src/assets/asset-data.json',
  JSON.stringify(getMixFiles(), null, 2),
  err => {
    if (err) {
      console.log(err);
    }
  }
);
