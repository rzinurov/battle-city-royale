import Animations from "../../../consts/Animations";
import Grid from "../../../consts/Grid";
import Textures from "../../../consts/Textures";
import PlayerTank from "../objects/PlayerTank";
import { Tiles } from "../Level";

export default class Minimap extends Phaser.GameObjects.Container {
  private player: PlayerTank;
  private playerSprite!: Phaser.GameObjects.Sprite;
  private tileSprites: {} = {};

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    width: number,
    height: number,
    layers: Phaser.Tilemaps.TilemapLayer[],
    player: PlayerTank
  ) {
    super(scene, x, y);

    this.width = width;
    this.height = height;
    this.player = player;

    this.add(
      this.scene.add.rectangle(0, 0, width, height, 0x000000).setOrigin(0)
    );

    this.drawTiles(layers);
    this.initPlayer();
  }

  private drawTiles(layers: Phaser.Tilemaps.TilemapLayer[]) {
    const tileMapping = {
      [Tiles.Metal]: Animations.Minimap.Metal,
      [Tiles.Brick]: Animations.Minimap.Brick,
      [Tiles.Tree]: Animations.Minimap.Tree,
      [Tiles.Water]: Animations.Minimap.Water,
    };
    layers.forEach((layer) =>
      layer.forEachTile((tile) => {
        if (!(tile.index in tileMapping)) {
          return;
        }
        const tileSprite = this.scene.add
          .sprite(tile.x, tile.y, Textures.Minimap)
          .play(tileMapping[tile.index])
          .setScale(0.5)
          .setOrigin(0);
        this.tileSprites[this.getTileSpritesKey(tile.x, tile.y)] = tileSprite;
        this.add(tileSprite);
      })
    );
  }

  private initPlayer() {
    this.playerSprite = this.scene.add
      .sprite(0, 0, Textures.Minimap)
      .setVisible(false)
      .play(Animations.Minimap.Player);
    this.add(this.playerSprite);
  }

  onTilesDestroyed(xys: { x: number; y: number }[]) {
    xys.forEach((xy) => {
      const key = this.getTileSpritesKey(xy.x, xy.y);
      const tile = this.tileSprites[key];
      if (tile) {
        tile.setActive(false).setVisible(false);
        delete this.tileSprites[key];
      }
    });
  }

  private getTileSpritesKey(x: number, y: number) {
    return `${x}_${y}`;
  }

  preUpdate() {
    this.playerSprite
      .setPosition(
        Math.floor(this.player.x / Grid.Quarter),
        Math.floor(this.player.y / Grid.Quarter)
      )
      .setVisible(this.player.active);
  }
}
