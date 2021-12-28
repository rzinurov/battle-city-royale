import Phaser from "phaser";
import Animations from "../../../consts/Animations";
import Directions from "../../../consts/Directions";
import Grid from "../../../consts/Grid";
import Sounds from "../../../consts/Sounds";
import Textures from "../../../consts/Textures";
import MathUtils from "../../../utils/MathUtils";
import SoundUtils from "../../../utils/SoundUtils";
import Bullet from "./Bullet";
import BulletPool from "./pools/BulletPool";
import ExplosionPool from "./pools/ExplosionPool";

export default class Tank extends Phaser.GameObjects.Container {
  private tankSprite: Phaser.GameObjects.Sprite;
  protected shieldSprite: Phaser.GameObjects.Sprite;
  protected spawnSprite: Phaser.GameObjects.Sprite;
  private physicsBody: Phaser.Physics.Arcade.Body;
  protected direction: Directions = Directions.Up;
  private isMoving: boolean = false;
  private maxVelocity: integer;
  public animationPrefix: string;
  private maxBulletCount: number = 1;
  private bulletCount: number = 0;

  private bulletPool: BulletPool;
  protected explosionPool: ExplosionPool;

  id: string;
  username: string;
  color: number;
  score: number = 0;

  constructor(
    scene: Phaser.Scene,
    bulletPool: BulletPool,
    explosionPool: ExplosionPool,
    animationPrefix: string,
    maxVelocity: integer,
    id: string,
    username: string,
    color: number
  ) {
    super(scene);
    this.height = Grid.Base;
    this.width = Grid.Base;

    this.animationPrefix = animationPrefix;
    this.maxVelocity = maxVelocity;

    this.bulletPool = bulletPool;
    this.explosionPool = explosionPool;

    this.id = id;
    this.username = username;
    this.color = color;

    this.tankSprite = scene.add.sprite(0, 0, Textures.Sprites);
    this.add(this.tankSprite);

    this.shieldSprite = scene.add
      .sprite(0, 0, Textures.Sprites)
      .play(Animations.Shield)
      .setVisible(false);
    this.add(this.shieldSprite);

    this.spawnSprite = scene.add
      .sprite(0, 0, Textures.Sprites)
      .setVisible(false);
    this.add(this.spawnSprite);

    this.setActive(false).setVisible(false);

    scene.physics.add.existing(this);
    this.physicsBody = this.body as Phaser.Physics.Arcade.Body;
    this.physicsBody.setCollideWorldBounds(true);
    this.physicsBody.pushable = false;
  }

  spawn(x: number, y: number) {
    this.setPosition(x, y).setActive(true).setVisible(true).stop();
    this.tankSprite
      .play(Animations[this.animationPrefix].MoveUp, true)
      .stop()
      .setVisible(false);
    this.direction = Directions.Up;
    this.shieldSprite.setVisible(false);
    this.bulletCount = 0;
    this.spawnSprite
      .setVisible(true)
      .play(Animations.Spawn)
      .once(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
        this.spawnSprite.setVisible(false);
        this.tankSprite.setVisible(true);
        this.physicsBody.setEnable(true).reset(x, y);
        this.activateShield();
      });
  }

  private activateShield() {
    this.shieldSprite.setVisible(true);
    this.scene.time.addEvent({
      delay: 5000,
      callback: () => {
        this.shieldSprite.setVisible(false);
      },
    });
  }

  move(direction: Directions) {
    if (!this.active || this.spawnSprite.visible) {
      return;
    }
    this.direction = direction;
    this.isMoving = true;
    switch (this.direction) {
      case Directions.Left:
        this.y = MathUtils.roundTo(this.y, Grid.Quarter);
        this.tankSprite.play(Animations[this.animationPrefix].MoveLeft, true);
        break;
      case Directions.Right:
        this.y = MathUtils.roundTo(this.y, Grid.Quarter);
        this.tankSprite.play(Animations[this.animationPrefix].MoveRight, true);
        break;
      case Directions.Up:
        this.x = MathUtils.roundTo(this.x, Grid.Quarter);
        this.tankSprite.play(Animations[this.animationPrefix].MoveUp, true);
        break;
      case Directions.Down:
        this.x = MathUtils.roundTo(this.x, Grid.Quarter);
        this.tankSprite.play(Animations[this.animationPrefix].MoveDown, true);
        break;
    }
  }

  stop() {
    if (!this.active || this.spawnSprite.visible) {
      return;
    }
    this.physicsBody.stop();
    this.tankSprite.stop();
    this.isMoving = false;
  }

  preUpdate(time: number, delta: number) {
    if (this.isMoving) {
      switch (this.direction) {
        case Directions.Left:
          this.physicsBody.setVelocity(-this.maxVelocity, 0);
          break;
        case Directions.Right:
          this.physicsBody.setVelocity(this.maxVelocity, 0);
          break;
        case Directions.Up:
          this.physicsBody.setVelocity(0, -this.maxVelocity);
          break;
        case Directions.Down:
          this.physicsBody.setVelocity(0, this.maxVelocity);
          break;
      }
    }
  }

  shoot() {
    if (
      !this.active ||
      this.spawnSprite.visible ||
      this.bulletCount >= this.maxBulletCount
    ) {
      return;
    }
    let bullet: Bullet;
    switch (this.direction) {
      case Directions.Left:
        bullet = this.bulletPool.spawn(
          this.physicsBody.left - 4,
          this.y,
          this.direction,
          this
        );
        break;
      case Directions.Right:
        bullet = this.bulletPool.spawn(
          this.physicsBody.right + 4,
          this.y,
          this.direction,
          this
        );
        break;
      case Directions.Up:
        bullet = this.bulletPool.spawn(
          this.x,
          this.physicsBody.top - 4,
          this.direction,
          this
        );
        break;
      case Directions.Down:
        bullet = this.bulletPool.spawn(
          this.x,
          this.physicsBody.bottom + 4,
          this.direction,
          this
        );
        break;
    }
    this.bulletCount++;
    bullet.once("killed", () => this.bulletCount--);
    SoundUtils.play(this.scene, Sounds.Shot, this.x, this.y);
  }

  onCollideBullet(): boolean {
    if (this.shieldSprite.visible || this.spawnSprite.visible) {
      return false;
    }
    this.kill();
    return true;
  }

  protected kill() {
    this.setActive(false).setVisible(false).stop();
    this.physicsBody.setEnable(false);
  }
}
