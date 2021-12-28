import Fonts from "../../../consts/Fonts";
import Grid from "../../../consts/Grid";
import StringUtils from "../../../utils/StringUtils";
import LeaderboardRow from "./LeaderboardRow";

const maxRows: number = 16;

export default class Leaderboard extends Phaser.GameObjects.Container {
  rows: Phaser.GameObjects.BitmapText[] = [];

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y);

    for (let i = 0; i < maxRows; i++) {
      const row = this.scene.add
        .bitmapText(4, i * Grid.Quarter, Fonts.Default, "", Grid.Quarter)
        .setTint(0x000000)
        .setOrigin(0, 0.5);
      this.add(row);
      this.rows.push(row);
    }
  }

  updateData(rows: LeaderboardRow[]) {
    if (!this.active) {
      return;
    }
    rows
      .sort((t1, t2) => t2.score - t1.score)
      .slice(0, maxRows)
      .forEach((row, idx) =>
        this.rows[idx]
          .setText(`${row.username} ${StringUtils.pad(row.score)}`)
          .setTint(row.color)
      );
  }
}
