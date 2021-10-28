import Phaser from "phaser";
import Fonts from "~/consts/Fonts";
import Grid from "~/consts/Grid";
import Scenes from "~/consts/Scenes";
import Sounds from "~/consts/Sounds";
import InputOverlay, { Actions } from "~/ui/InputOverlay";

export default class RoundStart extends Phaser.Scene {
  round!: integer;

  constructor() {
    super(Scenes.RoundStart);
  }

  init(data: { round: integer }) {
    this.round = data.round;
  }

  create() {
    this.cameras.main.setBackgroundColor(0x636363);
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;

    this.add
      .bitmapText(
        width / 2,
        height / 2,
        Fonts.Default,
        `STAGE ${this.round}`,
        Grid.Base
      )
      .setTint(0x000000)
      .setOrigin(0.5);

    const blackout = this.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000
    );

    this.tweens.add({
      targets: [blackout],
      y: height,
      height: 0,
      ease: "Linear",
      duration: 500,
    });

    const gameStartTimer = this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.startGame();
      },
    });

    this.add.existing(
      new InputOverlay(this).onAction(Actions.Space, () => {
        gameStartTimer.destroy();
        this.startGame();
      })
    );
  }

  private startGame() {
    this.sound.get(Sounds.StageStart).play();
    this.scene.stop(Scenes.RoundStart);
    this.scene.start(Scenes.Game, { round: this.round });
  }
}
