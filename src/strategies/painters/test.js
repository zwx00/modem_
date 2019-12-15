class TestPainter {
  constructor (sprite) {
    this.sprite = sprite;

    this.spriteData = {
      tint: Math.random()
    };
  }

  updateSprite (delta) {
    this.spriteData.tint += 0.0001;
    this.sprite.tint = Math.sin(this.spriteData.tint) * 0xFFFFFF;
  }
}

export {
  TestPainter
};
