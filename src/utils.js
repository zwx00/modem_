import * as PIXI from 'pixi.js';

export default {
  sleep (t) {
    return new Promise(resolve => {
      setTimeout(resolve, t);
    });
  },

  randomDirection () {
    return Math.random() > 0.5 ? -1 : 1;
  },
  shuffle (a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }
};
