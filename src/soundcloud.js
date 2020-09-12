import * as PIXI from 'pixi.js';

let widget = null;

const injectSoundcloud = async (src, targetContainer, app) => {
  const oldIframe = document.querySelector('body > iframe');
  console.log(oldIframe);
  if (oldIframe) {
    document.body.removeChild(oldIframe);
  }
  const iframe = document.createElement('iframe');
  iframe.style.display = 'none'
  iframe.id = 'sc-widget';

  iframe.setAttribute('allow', 'autoplay');

  iframe.src = src;

  document.body.appendChild(iframe);

  widget = SC.Widget(iframe);

  const playGfx = new PIXI.Graphics();
  playGfx.position.set(0, 0);

  playGfx.lineStyle(5, 0xffff1a);

  playGfx.beginFill(0xffff1a, 1);
  playGfx.drawPolygon(0, 10, 80, 55, 0, 100);

  playGfx.endFill();

  const pauseGfx = new PIXI.Graphics();

  pauseGfx.position.set(0, 0);

  pauseGfx.lineStyle(2, 0xffff1a);
  pauseGfx.beginFill(0xffff1a, 1);

  pauseGfx.drawRect(0, 10, 25, 80);
  pauseGfx.drawRect(45, 10, 25, 80);

  pauseGfx.endFill();


  const playPauseSprite = new PIXI.AnimatedSprite(
    [
      app.renderer.generateTexture(playGfx, 0, 1, new PIXI.Rectangle(0, 0, 100, 120)),
      app.renderer.generateTexture(pauseGfx, 0, 1, new PIXI.Rectangle(0, 0, 100, 120))
    ]
  );

  playPauseSprite.gotoAndStop(0);
  playPauseSprite.x = 500;
  playPauseSprite.y = 500;

  playPauseSprite.zIndex = 12000;
  playPauseSprite.interactive = true;
  playPauseSprite.buttonMode = true;

  playPauseSprite.x = 25;
  playPauseSprite.y = window.innerHeight - 150;
  targetContainer.addChild(playPauseSprite);

  let playing = false;

  widget.bind(SC.Widget.Events.READY, () => {
    playPauseSprite.on('pointerdown', () => {
      if (playing) {
        widget.pause();
        playPauseSprite.gotoAndStop(0);
        playing = false;
      } else {
        playing = true;
        playPauseSprite.gotoAndStop(1);
        widget.play();
      }
    });
  });

  let myGraph = new PIXI.Graphics();
  const container2 = new PIXI.Container();

  container2.addChild(myGraph);
  myGraph.buttonMode = true;
  myGraph.interactive = true;
  myGraph.zIndex = 3000;

  targetContainer.addChild(container2);

  container2.buttonMode = true;
  container2.interactive = true;
  container2.zIndex = 3000;


  widget.bind(SC.Widget.Events.PLAY_PROGRESS, (progress) => {
    myGraph.clear();
    myGraph.position.set(0, window.innerHeight);
    myGraph.lineStyle(40, 0xffff1a)
      .moveTo(0, 0)
      .lineTo(progress.relativePosition * window.innerWidth, 0)
  })

  container2.hitArea = new PIXI.Rectangle(0, window.innerHeight - 50, window.innerWidth, 50);

  container2.on('pointerdown', (e) => {
    widget.getDuration(function (duration) {
      widget.seekTo(duration * e.data.global.x / window.innerWidth);
    })
  })
};

export {
  injectSoundcloud
};
