import Phaser from "phaser";
import Animations from "~/consts/Animations";
import Fonts from "~/consts/Fonts";
import Grid from "~/consts/Grid";
import Images from "~/consts/Images";
import Scenes from "~/consts/Scenes";
import Sounds from "~/consts/Sounds";
import Textures from "~/consts/Textures";

const frameRate = 16;
export default class Preloader extends Phaser.Scene {
  private progressContainer!: Phaser.GameObjects.Graphics;
  private progressBar!: Phaser.GameObjects.Graphics;

  constructor() {
    super(Scenes.Preloader);
  }

  preload() {
    this.cameras.main.fadeIn(1000);
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.progressBar = this.add.graphics();
    this.progressContainer = this.add.graphics();
    this.progressContainer.fillStyle(0x222222, 0.8);
    this.progressContainer.fillRect(
      width * 0.25,
      height / 2 - Grid.Base,
      width * 0.5,
      Grid.Base * 2
    );

    this.load.on("progress", (value: number) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0xffffff, 1);
      this.progressBar.fillRect(
        width * 0.25 + 2,
        height / 2 - Grid.Base + 2,
        (width * 0.5 - 4) * value,
        Grid.Base * 2 - 4
      );
    });

    this.load.bitmapFont(
      Fonts.Default,
      "assets/fonts/default.png",
      "assets/fonts/default.xml"
    );

    this.load.spritesheet(Textures.Sprites, "assets/img/sprites.png", {
      frameWidth: Grid.Base,
      frameHeight: Grid.Base,
    });
    this.load.spritesheet(Textures.Tiles, "assets/img/tiles.png", {
      frameWidth: Grid.Quarter,
      frameHeight: Grid.Quarter,
    });
    this.load.spritesheet(Textures.Minimap, "assets/img/minimap.png", {
      frameWidth: 2,
      frameHeight: 2,
    });

    this.load.image(Images.MenuLogo, "assets/img/menu_logo.png");

    this.load.audio(Sounds.Shot, "assets/snd/shot.mp3", {
      instances: 16,
    });
    this.load.audio(Sounds.BulletHit1, "assets/snd/bullet_hit_1.mp3", {
      instances: 16,
    });
    this.load.audio(Sounds.BulletHit2, "assets/snd/bullet_hit_2.mp3", {
      instances: 16,
    });
    this.load.audio(Sounds.PlayerMoving, "assets/snd/player_moving.mp3", {
      instances: 16,
    });
    this.load.audio(Sounds.PlayerExplosion, "assets/snd/player_explosion.mp3", {
      instances: 1,
    });
    this.load.audio(Sounds.EnemyExplosion, "assets/snd/enemy_explosion.mp3", {
      instances: 16,
    });
    // this.load.audio(Sounds.EnemyMoving, "assets/snd/enemy_moving.mp3", {
    //   instances: 16,
    // });
    this.load.audio(Sounds.StageStart, "assets/snd/stage_start.mp3");
    this.load.audio(Sounds.Stats, "assets/snd/stats.mp3");
  }

  create() {
    this.createAnimation();
    this.createSounds();
    this.startGame();
  }

  private createAnimation() {
    this.createPlayerAnimation();
    this.createEnemyAnimation();
    this.createExplosionAnimation();
    this.createMinimapAnimation();

    this.anims.create({
      key: Animations.Shield,
      frames: this.anims.generateFrameNumbers(Textures.Sprites, {
        frames: [241, 242],
      }),
      repeat: -1,
      frameRate,
    });

    this.anims.create({
      key: Animations.Bullet,
      frames: this.anims.generateFrameNumbers(Textures.Tiles, {
        frames: [9],
      }),
    });

    this.anims.create({
      key: Animations.Spawn,
      frames: this.anims.generateFrameNumbers(Textures.Sprites, {
        frames: [166, 167, 168, 169],
      }),
      repeat: 3,
      frameRate,
      yoyo: true,
    });
  }

  private createPlayerAnimation() {
    this.anims.create({
      key: Animations.Player.MoveUp,
      frames: this.anims.generateFrameNumbers(Textures.Sprites, {
        frames: [0, 1],
      }),
      repeat: -1,
      frameRate,
    });

    this.anims.create({
      key: Animations.Player.MoveLeft,
      frames: this.anims.generateFrameNumbers(Textures.Sprites, {
        frames: [2, 3],
      }),
      repeat: -1,
      frameRate,
    });

    this.anims.create({
      key: Animations.Player.MoveDown,
      frames: this.anims.generateFrameNumbers(Textures.Sprites, {
        frames: [4, 5],
      }),
      repeat: -1,
      frameRate,
    });

    this.anims.create({
      key: Animations.Player.MoveRight,
      frames: this.anims.generateFrameNumbers(Textures.Sprites, {
        frames: [6, 7],
      }),
      repeat: -1,
      frameRate,
    });
  }

  private createEnemyAnimation() {
    this.anims.create({
      key: Animations.Enemy.MoveUp,
      frames: this.anims.generateFrameNumbers(Textures.Sprites, {
        frames: [108, 109],
      }),
      repeat: -1,
      frameRate,
    });

    this.anims.create({
      key: Animations.Enemy.MoveLeft,
      frames: this.anims.generateFrameNumbers(Textures.Sprites, {
        frames: [110, 111],
      }),
      repeat: -1,
      frameRate,
    });

    this.anims.create({
      key: Animations.Enemy.MoveDown,
      frames: this.anims.generateFrameNumbers(Textures.Sprites, {
        frames: [112, 113],
      }),
      repeat: -1,
      frameRate,
    });

    this.anims.create({
      key: Animations.Enemy.MoveRight,
      frames: this.anims.generateFrameNumbers(Textures.Sprites, {
        frames: [114, 115],
      }),
      repeat: -1,
      frameRate,
    });
  }

  private createExplosionAnimation() {
    this.anims.create({
      key: Animations.Explosion.Small,
      frames: this.anims.generateFrameNumbers(Textures.Sprites, {
        frames: [216, 217, 218],
      }),
      repeat: 0,
      frameRate,
    });

    this.anims.create({
      key: Animations.Explosion.BigTL,
      frames: this.anims.generateFrameNumbers(Textures.Sprites, {
        frames: [219, 221],
      }),
      repeat: 0,
      frameRate,
    });
    this.anims.create({
      key: Animations.Explosion.BigTR,
      frames: this.anims.generateFrameNumbers(Textures.Sprites, {
        frames: [220, 222],
      }),
      repeat: 0,
      frameRate,
    });
    this.anims.create({
      key: Animations.Explosion.BigBL,
      frames: this.anims.generateFrameNumbers(Textures.Sprites, {
        frames: [244, 246],
      }),
      repeat: 0,
      frameRate,
    });
    this.anims.create({
      key: Animations.Explosion.BigBR,
      frames: this.anims.generateFrameNumbers(Textures.Sprites, {
        frames: [245, 247],
      }),
      repeat: 0,
      frameRate,
    });
  }

  private createMinimapAnimation() {
    this.anims.create({
      key: Animations.Minimap.Metal,
      frames: this.anims.generateFrameNumbers(Textures.Minimap, {
        frames: [0],
      }),
    });
    this.anims.create({
      key: Animations.Minimap.Brick,
      frames: this.anims.generateFrameNumbers(Textures.Minimap, {
        frames: [1],
      }),
    });
    this.anims.create({
      key: Animations.Minimap.Tree,
      frames: this.anims.generateFrameNumbers(Textures.Minimap, {
        frames: [2],
      }),
    });
    this.anims.create({
      key: Animations.Minimap.Water,
      frames: this.anims.generateFrameNumbers(Textures.Minimap, {
        frames: [3],
      }),
    });
    this.anims.create({
      key: Animations.Minimap.Player,
      frames: this.anims.generateFrameNumbers(Textures.Minimap, {
        frames: [4],
      }),
    });
  }

  private createSounds() {
    this.sound.add(Sounds.Shot);
    this.sound.add(Sounds.BulletHit1);
    this.sound.add(Sounds.BulletHit2);
    this.sound.add(Sounds.PlayerMoving, { loop: true, volume: 0.3 });
    this.sound.add(Sounds.PlayerExplosion);
    this.sound.add(Sounds.EnemyExplosion);
    // this.sound.add(Sounds.EnemyMoving, { loop: true, volume: 0.3 });
    this.sound.add(Sounds.StageStart);
    this.sound.add(Sounds.Stats);
  }

  private startGame() {
    this.cameras.main
      .fadeOut(500)
      .once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.progressBar.destroy();
        this.progressContainer.destroy();

        this.scene.stop(Scenes.Preloader);
        this.scene.start(Scenes.Menu);
      });
  }
}
