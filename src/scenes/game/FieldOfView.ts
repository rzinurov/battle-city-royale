import { Mrpas } from "mrpas";
import Phaser from "phaser";
import Grid from "~/consts/Grid";
import Player from "~/scenes/game/objects/PlayerTank";

export default class FieldOfView {
  private mrpas: Mrpas;
  private scene: Phaser.Scene;
  private widthInTiles: number;
  private heightInTiles: number;
  private layers: Phaser.Tilemaps.TilemapLayer[];
  private player: Player;
  private objectGroups: Phaser.GameObjects.Group[];

  constructor(
    scene: Phaser.Scene,
    widthInTiles: number,
    heightInTiles: number,
    layers: Phaser.Tilemaps.TilemapLayer[],
    player: Player,
    objectGroups: Phaser.GameObjects.Group[]
  ) {
    this.scene = scene;
    this.widthInTiles = widthInTiles;
    this.heightInTiles = heightInTiles;
    this.layers = layers;
    this.player = player;
    this.objectGroups = objectGroups;

    this.mrpas = new Mrpas(this.layers[0].width, this.heightInTiles, (x, y) => {
      const tile = this.layers[0].getTileAt(x, y);
      return !tile || !tile.collides;
    });
  }

  update(time: number, delta: number) {
    const camera = this.scene.cameras.main;
    const bounds = new Phaser.Geom.Rectangle(
      Math.round(camera.worldView.x / Grid.Quarter) - 2,
      Math.round(camera.worldView.y / Grid.Quarter) - 2,
      Math.round(camera.worldView.width / Grid.Quarter) + 4,
      Math.round(camera.worldView.height / Grid.Quarter) + 4
    );

    // dim everything
    for (let y = bounds.y; y < bounds.y + bounds.height; y++) {
      for (let x = bounds.x; x < bounds.x + bounds.width; x++) {
        if (
          y < 0 ||
          y >= this.heightInTiles ||
          x < 0 ||
          x >= this.widthInTiles
        ) {
          continue;
        }
        this.layers.forEach((layer) => {
          const tile = layer.getTileAt(x, y);
          if (tile) {
            tile.tint = 0x101010;
            tile.alpha = 1;
          }
        });

        this.objectGroups.forEach((group) =>
          group.children.each((obj: any) => {
            obj.alpha = 0;
          })
        );
      }
    }

    const px = Math.round(this.player.x / Grid.Quarter);
    const py = Math.round(this.player.y / Grid.Quarter);

    const radius = 16;
    this.mrpas.compute(
      px,
      py,
      radius,
      (x, y) => {
        const tile = this.layers[0].getTileAt(x, y);
        if (tile) {
          return tile.tint === 0xffffff;
        }
        return false;
      },
      (x, y) => {
        this.layers.forEach((layer) => {
          const tile = layer.getTileAt(x, y);
          if (tile) {
            tile.tint = 0xffffff;
            tile.alpha = 1;
          }
        });

        this.objectGroups.forEach((group) =>
          group.children.each((obj: any) => {
            if (
              obj.active &&
              (Math.round(obj.x / Grid.Quarter) !== x ||
                Math.round(obj.y / Grid.Quarter) !== y)
            ) {
              return;
            }
            obj.alpha = 1;
          })
        );
      }
    );
  }
}
