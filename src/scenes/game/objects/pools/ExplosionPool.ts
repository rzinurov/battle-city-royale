import Phaser from "phaser";
import Animations from "~/consts/Animations";
import Grid from "~/consts/Grid";
import Textures from "~/consts/Textures";

enum ExplosionTypes {
  Small = "small",
  Big = "big",
}

export default class ExplosionPool extends Phaser.GameObjects.Group {
  constructor(
    scene: Phaser.Scene,
    config: Phaser.Types.GameObjects.Group.GroupConfig = {}
  ) {
    const defaults: Phaser.Types.GameObjects.Group.GroupConfig = {
      defaultKey: Textures.Sprites,
      maxSize: -1,
    };
    super(scene, { ...defaults, ...config });
  }

  spawn(x: number, y: number, type: ExplosionTypes) {
    const explosion: Phaser.GameObjects.Sprite = this.get(x, y)
      .setActive(true)
      .setVisible(true)
      .play(Animations.Explosion.Small);
    explosion.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.killAndHide(explosion);
      if (type === ExplosionTypes.Big) {
        this.spawnBigExplosion(x, y);
      }
    });
    return explosion;
  }

  private spawnBigExplosion(x: number, y: number) {
    [
      {
        x: x - Grid.Quarter,
        y: y - Grid.Quarter,
        a: Animations.Explosion.BigTL,
      },
      {
        x: x + Grid.Quarter,
        y: y - Grid.Quarter,
        a: Animations.Explosion.BigTR,
      },
      {
        x: x - Grid.Quarter,
        y: y + Grid.Quarter,
        a: Animations.Explosion.BigBL,
      },
      {
        x: x + Grid.Quarter,
        y: y + Grid.Quarter,
        a: Animations.Explosion.BigBR,
      },
    ].forEach((d) => {
      const exp = this.get(d.x, d.y).setActive(true).setVisible(true).play(d.a);
      exp.once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.killAndHide(exp);
      });
    });
  }
}

export { ExplosionTypes };
