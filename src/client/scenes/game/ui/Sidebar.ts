import Grid from "../../../consts/Grid";
import PlayerTank from "../objects/PlayerTank";
import Leaderboard from "./Leaderboard";
import LeaderboardRow from "./LeaderboardRow";
import Minimap from "./Minimap";
import Timer from "./Timer";

export default class Sidebar extends Phaser.GameObjects.Container {
  private leaderboard: Leaderboard;
  private minimap: Minimap;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    layers: Phaser.Tilemaps.TilemapLayer[],
    player: PlayerTank,
    onTimerStopped: () => any
  ) {
    super(scene, x, y);
    this.width = width;
    this.height = height;

    this.add(
      this.scene.add
        .rectangle(0, 0, this.width, this.height, 0x636363)
        .setOrigin(0)
    );

    this.add(
      this.scene.add.line(0, 0, 0, 0, 0, this.height, 0xadadad).setOrigin(0)
    );

    this.minimap = new Minimap(
      this.scene,
      Grid.Quarter,
      Grid.Quarter,
      this.width - Grid.Base,
      this.width - Grid.Base,
      layers,
      player
    );
    this.add(this.scene.add.existing(this.minimap));

    this.add(
      this.scene.add.existing(
        new Timer(this.scene, this.width / 2, 11 * Grid.Quarter, 120).on(
          "stopped",
          () => onTimerStopped()
        )
      )
    );

    this.leaderboard = this.scene.add.existing(
      new Leaderboard(this.scene, 0, 13.5 * Grid.Quarter)
    );
    this.add(this.leaderboard);
  }

  updateLeaderboard(rows: LeaderboardRow[]) {
    this.leaderboard.updateData(rows);
  }

  onTilesDestroyed(xys: { x: number; y: number }[]) {
    this.minimap.onTilesDestroyed(xys);
  }
}
