import Phaser, { Time } from "phaser";
import Fonts from "~/consts/Fonts";
import Grid from "~/consts/Grid";
import Scenes from "~/consts/Scenes";
import Sounds from "~/consts/Sounds";
import Textures from "~/consts/Textures";
import InputOverlay, { Actions } from "~/ui/InputOverlay";
import StringUtils from "~/utils/StringUtils";
import LeaderboardRow from "../game/ui/LeaderboardRow";

export default class RoundEnd extends Phaser.Scene {
  round!: integer;
  leaderboard!: LeaderboardRow[];
  continueText!: Phaser.GameObjects.BitmapText;
  animationStep!: integer;

  constructor() {
    super(Scenes.RoundEnd);
  }

  init(data: { round: integer; leaderboard: LeaderboardRow[] }) {
    this.round = data.round;
    this.leaderboard = data.leaderboard
      .sort((r1, r2) => r2.score - r1.score)
      .slice(0, 5);
  }

  create() {
    this.animationStep = 0;

    const width = this.cameras.main.width;

    this.add
      .bitmapText(
        width / 2 - Grid.Base * 2,
        Grid.Base * 3,
        Fonts.Default,
        `STAGE ${this.round}`,
        Grid.Quarter
      )
      .setTint(0xffffff);

    this.continueText = this.add
      .bitmapText(
        width / 2 - Grid.Base * 2,
        Grid.Base * 12,
        Fonts.Default,
        `CONTINUE`,
        Grid.Quarter
      )
      .setTint(0xffffff)
      .setVisible(false)
      .setInteractive({ useHandCursor: true })
      .on("pointerup", () => this.nextRound());

    this.add.existing(
      new InputOverlay(this).onAction(Actions.Space, () => {
        this.nextRound();
      })
    );

    const timer = this.time.addEvent({
      delay: 1000,
      callback: () => {
        if (this.animationStep >= 5) {
          this.continueText.setVisible(true);
          timer.destroy();
        } else {
          this.drawStatsRow(this.animationStep);
          this.sound.get(Sounds.Stats).play();
        }
        this.animationStep++;
      },
      loop: true,
    });
  }

  private drawStatsRow(idx: number) {
    const row = this.leaderboard[idx];
    if (!row) {
      return;
    }

    const width = this.cameras.main.width;
    const offsetY = Grid.Base * 6 + Grid.Base * idx;

    this.add
      .sprite(width / 2 - Grid.Quarter * 9, offsetY, Textures.Sprites)
      .setOrigin(0, 0.25)
      .play(row.sprite)
      .stop();
    this.add
      .bitmapText(
        width / 2 - Grid.Base * 3,
        offsetY,
        Fonts.Default,
        row.username,
        Grid.Quarter
      )
      .setTint(0xffffff);
    this.add
      .bitmapText(
        width / 2 + Grid.Quarter * 3,
        offsetY,
        Fonts.Default,
        `${StringUtils.pad(row.score)} PTS`,
        Grid.Quarter
      )
      .setTint(0xffffff);
  }

  update(time: number, delta: number) {
    if (time % 1000 < 500) {
      this.continueText.setTint(0xffffff);
    } else {
      this.continueText.setTint(0xadadad);
    }
  }

  private nextRound() {
    if (!this.continueText.visible) {
      return;
    }
    this.scene.stop(Scenes.RoundEnd);
    this.scene.start(Scenes.RoundStart, { round: this.round + 1 });
  }
}
