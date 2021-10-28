import Phaser from "phaser";
import Directions from "~/consts/Directions";
import Sounds from "~/consts/Sounds";
import SoundUtils from "~/utils/SoundUtils";
import StringUtils from "~/utils/StringUtils";
import BulletPool from "./pools/BulletPool";
import ExplosionPool, { ExplosionTypes } from "./pools/ExplosionPool";
import Tank from "./Tank";

const velocity: integer = 32;

export default class EnemyTank extends Tank {
  private shootTimer: number = 0;
  private shootTimerLimit: number = 2000 + Math.random() * 2000;
  private directionTimer: number = 0;
  private directionTimerLimit: number = 500 + Math.random() * 1000;

  constructor(
    scene: Phaser.Scene,
    bulletPool: BulletPool,
    explosionPool: ExplosionPool,
    username: string
  ) {
    super(
      scene,
      bulletPool,
      explosionPool,
      "Enemy",
      velocity,
      StringUtils.randomString(6),
      username,
      0xadadad
    );
  }

  preUpdate(time: number, delta: number) {
    super.preUpdate(time, delta);

    this.shootTimer += delta;
    this.directionTimer += delta;

    if (this.shootTimer > this.shootTimerLimit) {
      this.shoot();
      this.shootTimer = 0;
    }

    if (this.directionTimer > this.directionTimerLimit) {
      this.move(
        [Directions.Up, Directions.Down, Directions.Left, Directions.Right][
          Math.floor(Math.random() * 4)
        ]
      );
      this.directionTimer = 0;
    }
  }

  onCollideBullet(): boolean {
    const killed = super.onCollideBullet();
    if (killed) {
      this.explosionPool.spawn(this.x, this.y, ExplosionTypes.Big);
      SoundUtils.play(this.scene, Sounds.EnemyExplosion, this.x, this.y);
    }
    return killed;
  }
}
