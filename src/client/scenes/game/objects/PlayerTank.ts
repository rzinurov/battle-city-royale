import Phaser from "phaser";
import Directions from "../../../consts/Directions";
import Sounds from "../../../consts/Sounds";
import SoundUtils from "../../../utils/SoundUtils";
import StringUtils from "../../../utils/StringUtils";
import BulletPool from "./pools/BulletPool";
import ExplosionPool, { ExplosionTypes } from "./pools/ExplosionPool";
import Tank from "./Tank";

const velocity: integer = 64;

export default class PlayerTank extends Tank {
  constructor(
    scene: Phaser.Scene,
    bulletPool: BulletPool,
    explosionPool: ExplosionPool
  ) {
    super(
      scene,
      bulletPool,
      explosionPool,
      "Player",
      velocity,
      StringUtils.randomString(6),
      "Player",
      0xe79c21
    );
  }

  move(direction: Directions) {
    super.move(direction);
    if (this.active && !this.spawnSprite.visible) {
      this.scene.sound.get(Sounds.PlayerMoving).play();
    }
  }

  stop() {
    super.stop();
    this.scene.sound.get(Sounds.PlayerMoving).stop();
  }

  onCollideBullet(): boolean {
    const killed = super.onCollideBullet();
    if (killed) {
      this.explosionPool.spawn(this.x, this.y, ExplosionTypes.Big);
      SoundUtils.play(this.scene, Sounds.PlayerExplosion, this.x, this.y);
    }
    return killed;
  }
}
