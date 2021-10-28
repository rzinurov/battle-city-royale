import Phaser from "phaser";
import StringUtils from "~/utils/StringUtils";
import Enemy from "../EnemyTank";
import BulletPool from "./BulletPool";
import ExplosionPool from "./ExplosionPool";

export default class EnemyPool extends Phaser.GameObjects.Group {
  private bulletPool: BulletPool;
  private explosionPool: ExplosionPool;
  private lastEnemyIndex: integer;

  constructor(
    scene: Phaser.Scene,
    bulletPool: BulletPool,
    explosionPool: ExplosionPool,
    config: Phaser.Types.GameObjects.Group.GroupConfig = {}
  ) {
    const defaults: Phaser.Types.GameObjects.Group.GroupConfig = {
      classType: Enemy,
      maxSize: -1,
    };
    super(scene, { ...defaults, ...config });
    this.bulletPool = bulletPool;
    this.explosionPool = explosionPool;
    this.lastEnemyIndex = 1;
  }

  spawn(x: number, y: number) {
    let enemy: Enemy = this.getFirstDead(false);
    if (!enemy) {
      enemy = new Enemy(
        this.scene,
        this.bulletPool,
        this.explosionPool,
        `Bot_${StringUtils.pad(this.lastEnemyIndex++)}`
      );
      this.scene.add.existing(enemy);
      this.add(enemy);
    }
    enemy.spawn(x, y);
    return enemy;
  }

  onCollideBullet(enemy: Enemy): boolean {
    return enemy.onCollideBullet();
  }
}
