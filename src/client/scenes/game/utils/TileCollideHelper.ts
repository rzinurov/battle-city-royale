import Directions from "../../../consts/Directions";
import Grid from "../../../consts/Grid";
import Sounds from "../../../consts/Sounds";
import Bullet from "../objects/Bullet";
import SoundUtils from "../../../utils/SoundUtils";
import { Tiles } from "../Level";

export default class TileCollideHelper {
  private scene: Phaser.Scene;
  private groundLayer: Phaser.Tilemaps.TilemapLayer;

  constructor(scene: Phaser.Scene, groundLayer: Phaser.Tilemaps.TilemapLayer) {
    this.scene = scene;
    this.groundLayer = groundLayer;
  }

  onCollideBullet(bullet: Bullet, ld: Phaser.GameObjects.GameObject) {
    const layerData = ld as unknown as Phaser.Tilemaps.Tile;
    const tilesDestroyed: { x: number; y: number }[] = [];
    if (this.onTileHit(layerData.x, layerData.y, bullet.direction, true)) {
      tilesDestroyed.push({ x: layerData.x, y: layerData.y });
    }
    switch (bullet.direction) {
      case Directions.Up:
      case Directions.Down:
        if (
          this.onTileHit(layerData.x + 1, layerData.y, bullet.direction, false)
        ) {
          tilesDestroyed.push({ x: layerData.x + 1, y: layerData.y });
        }
        break;
      case Directions.Left:
      case Directions.Right:
        if (
          this.onTileHit(layerData.x, layerData.y + 1, bullet.direction, false)
        ) {
          tilesDestroyed.push({ x: layerData.x, y: layerData.y + 1 });
        }
        break;
    }
    return tilesDestroyed;
  }

  /**
   * @returns true if title has been destroyed
   */
  onTileHit(x: number, y: number, direction: Directions, playSound: boolean) {
    const tile = this.groundLayer.getTileAt(x, y);
    if (!tile) {
      return false;
    }

    if (playSound) {
      switch (tile.index) {
        case 0: //brick
        case 1: //half brick
        case 2:
        case 3:
        case 4:
          SoundUtils.play(
            this.scene,
            Sounds.BulletHit1,
            tile.x * Grid.Quarter,
            tile.y * Grid.Quarter
          );
          break;
        case 5: //concrete
          SoundUtils.play(
            this.scene,
            Sounds.BulletHit2,
            tile.x * Grid.Quarter,
            tile.y * Grid.Quarter
          );
          break;
      }
    }

    switch (tile.index) {
      case 0: //brick
        if (direction === Directions.Up) {
          this.groundLayer.putTileAt(Tiles.BrickTop, tile.x, tile.y);
        } else if (direction === Directions.Down) {
          this.groundLayer.putTileAt(Tiles.BrickBottom, tile.x, tile.y);
        } else if (direction === Directions.Left) {
          this.groundLayer.putTileAt(Tiles.BrickLeft, tile.x, tile.y);
        } else if (direction === Directions.Right) {
          this.groundLayer.putTileAt(Tiles.BrickRight, tile.x, tile.y);
        }
        break;
      case 1: //half brick
      case 2:
      case 3:
      case 4:
        this.groundLayer.putTileAt(Tiles.Floor, tile.x, tile.y);
        return true;
    }
    return false;
  }
}
