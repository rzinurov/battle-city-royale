import Phaser from "phaser";
import Directions from "../../../../consts/Directions";
import Bullet from "../Bullet";
import Tank from "../Tank";
import ExplosionPool, { ExplosionTypes } from "./ExplosionPool";

export default class BulletPool extends Phaser.GameObjects.Group {
  private explosionPool: ExplosionPool;

  constructor(
    scene: Phaser.Scene,
    explosionPool: ExplosionPool,
    config: Phaser.Types.GameObjects.Group.GroupConfig = {}
  ) {
    const defaults: Phaser.Types.GameObjects.Group.GroupConfig = {
      classType: Bullet,
      maxSize: -1,
    };
    super(scene, { ...defaults, ...config });
    this.explosionPool = explosionPool;
  }

  spawn(x: number, y: number, direction: Directions, owner: Tank) {
    const bullet: Bullet = this.get(x, y);
    bullet.spawn(x, y, direction, owner);
    return bullet;
  }

  killAndHide(bullet: Bullet) {
    super.killAndHide(bullet);
    bullet.kill();
  }

  onCollideMetal(bullet: Bullet) {
    this.explode(bullet);
    this.killAndHide(bullet);
  }

  onCollideBullet(bullet: Bullet) {
    this.killAndHide(bullet);
  }

  onCollidePlayer(bullet: Bullet) {
    this.explode(bullet);
    this.killAndHide(bullet);
  }

  onCollideEnemy(bullet: Bullet) {
    this.explode(bullet);
    this.killAndHide(bullet);
  }

  private explode(bullet: Bullet) {
    switch (bullet.direction) {
      case Directions.Up:
        this.explosionPool.spawn(
          bullet.x,
          bullet.physicsBody.top,
          ExplosionTypes.Small
        );
        break;
      case Directions.Down:
        this.explosionPool.spawn(
          bullet.x,
          bullet.physicsBody.bottom,
          ExplosionTypes.Small
        );
        break;
      case Directions.Left:
        this.explosionPool.spawn(
          bullet.physicsBody.left,
          bullet.y,
          ExplosionTypes.Small
        );
        break;
      case Directions.Right:
        this.explosionPool.spawn(
          bullet.physicsBody.right,
          bullet.y,
          ExplosionTypes.Small
        );
        break;
    }
  }
}
