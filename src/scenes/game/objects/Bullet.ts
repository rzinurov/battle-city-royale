import Phaser from "phaser";
import Animations from "~/consts/Animations";
import Directions from "~/consts/Directions";
import Grid from "~/consts/Grid";
import Textures from "~/consts/Textures";
import Tank from "./Tank";

const velocity: integer = 96;
export default class Bullet extends Phaser.GameObjects.Container {
  private bulletSprite: Phaser.GameObjects.Sprite;
  physicsBody: Phaser.Physics.Arcade.Body;
  direction: Directions = Directions.Up;
  owner?: Tank;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    direction: Directions
  ) {
    super(scene, x, y);
    this.height = Grid.Quarter;
    this.width = Grid.Quarter;

    this.direction = direction;

    this.bulletSprite = scene.add
      .sprite(0, 0, Textures.Tiles)
      .setOrigin(0.6, 0.5)
      .play(Animations.Bullet);
    this.add(this.bulletSprite);

    scene.physics.add.existing(this);
    this.physicsBody = this.body as Phaser.Physics.Arcade.Body;
    this.physicsBody.setSize(4, 4).setOffset(2, 2).setCollideWorldBounds(true);
    this.physicsBody.onWorldBounds = true;

    this.setActive(false).setVisible(false);
  }

  spawn(x: number, y: number, direction: Directions, owner: Tank) {
    this.setActive(true).setVisible(true);
    this.direction = direction;
    this.owner = owner;

    this.physicsBody.reset(x, y);
    this.bulletSprite.setAngle(0).setFlipY(false);
    this.physicsBody.setEnable(true);

    switch (direction) {
      case Directions.Up:
        this.physicsBody.setVelocityY(-velocity);
        break;
      case Directions.Right:
        this.bulletSprite.angle = 90;
        this.physicsBody.setVelocityX(velocity);
        break;
      case Directions.Down:
        this.bulletSprite.flipY = true;
        this.physicsBody.setVelocityY(velocity);
        break;
      case Directions.Left:
        this.bulletSprite.angle = 90;
        this.bulletSprite.flipY = true;
        this.physicsBody.setVelocityX(-velocity);
        break;
    }
  }

  kill() {
    this.physicsBody.setEnable(false);
    this.emit("killed");
  }
}
