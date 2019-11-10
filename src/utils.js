export default {
  sleep (t) {
    return new Promise(resolve => {
      setTimeout(resolve, t);
    });
  }
};
