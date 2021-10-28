import Dungeon, { Room } from "@mikewesthad/dungeon";
import Phaser from "phaser";
import Grid from "~/consts/Grid";
import Textures from "~/consts/Textures";
import {
  aquaDiscoteque,
  brickPerimeter,
  brickPillars,
  brickSquares,
  cornerForest,
  metalPillars,
  treePatches,
} from "./RoomDecoration";

enum Tiles {
  Empty = -1,
  Brick = 0,
  BrickRight = 1,
  BrickBottom = 2,
  BrickLeft = 3,
  BrickTop = 4,
  Metal = 5,
  Tree = 6,
  Water = 10,
  Floor = 8,
}

export default class Level {
  dungeon: Dungeon;
  private spawnIndex: number = 0;

  width: number;
  height: number;
  widthInTiles: number;
  heightInTiles: number;
  groundLayer: Phaser.Tilemaps.TilemapLayer;
  treeLayer: Phaser.Tilemaps.TilemapLayer;
  waterLayer: Phaser.Tilemaps.TilemapLayer;

  constructor(scene: Phaser.Scene, seed: string) {
    this.dungeon = this.createDungeon(seed);

    const map = scene.make.tilemap({
      tileWidth: Grid.Quarter,
      tileHeight: Grid.Quarter,
      width: this.dungeon.width * 2,
      height: this.dungeon.height * 2,
    });

    this.width = map.widthInPixels;
    this.height = map.heightInPixels;
    this.widthInTiles = map.width;
    this.heightInTiles = map.height;

    const tileset = map.addTilesetImage(
      Textures.Tiles,
      undefined,
      Grid.Quarter,
      Grid.Quarter
    );
    this.groundLayer = map.createBlankLayer("ground", tileset);
    const groundTiles = this.dungeon.getMappedTiles({
      empty: Tiles.Empty,
      floor: Tiles.Floor,
      door: Tiles.Brick,
      wall: Tiles.Metal,
    }) as number[][];
    groundTiles.forEach((row, y) => {
      row.forEach((nr, x) => {
        this.putFourTilesAt(x, y, nr);
      });
    });

    this.waterLayer = map.createBlankLayer("water", tileset);
    this.waterLayer.setCollision([Tiles.Water]);

    this.treeLayer = map.createBlankLayer("trees", tileset).setDepth(1);

    this.decorateRooms();

    this.groundLayer.setCollision([
      Tiles.Brick,
      Tiles.BrickTop,
      Tiles.BrickBottom,
      Tiles.BrickLeft,
      Tiles.BrickRight,
      Tiles.Metal,
    ]);
  }

  private decorateRooms() {
    const sortedRooms = this.dungeon.rooms.sort((r1, r2) => {
      return r2.width * r2.height - r1.width * r1.height;
    });
    sortedRooms.length > 0 && treePatches(sortedRooms[0], this.treeLayer);
    sortedRooms.length > 1 && metalPillars(sortedRooms[1], this.groundLayer);
    sortedRooms.length > 2 && brickPillars(sortedRooms[2], this.groundLayer);
    sortedRooms.length > 3 && aquaDiscoteque(sortedRooms[3], this.waterLayer);
    sortedRooms.length > 4 && cornerForest(sortedRooms[4], this.treeLayer);
    sortedRooms.length > 5 && brickPerimeter(sortedRooms[5], this.groundLayer);
    sortedRooms.length > 6 && brickSquares(sortedRooms[6], this.groundLayer);
  }

  getNextSpawnPoint() {
    if (this.spawnIndex >= this.dungeon.rooms.length) {
      this.spawnIndex = 0;
    }
    const room = this.dungeon.rooms[this.spawnIndex];
    this.spawnIndex++;
    return {
      x: (room.centerX + 0.5) * Grid.Base,
      y: (room.centerY + 0.5) * Grid.Base,
    };
  }

  private putFourTilesAt(x: number, y: number, nr: number) {
    this.groundLayer.putTileAt(nr, x * 2, y * 2);
    this.groundLayer.putTileAt(nr, x * 2, y * 2 + 1);
    this.groundLayer.putTileAt(nr, x * 2 + 1, y * 2);
    this.groundLayer.putTileAt(nr, x * 2 + 1, y * 2 + 1);
  }

  createDungeon(seed: string) {
    const dungeon = new Dungeon({
      width: 32,
      height: 32,
      doorPadding: 1,
      randomSeed: seed,
      rooms: {
        width: {
          min: 8,
          max: 16,
          onlyOdd: true,
        },
        height: {
          min: 8,
          max: 16,
          onlyOdd: true,
        },
        maxRooms: 8,
      },
    });

    return dungeon;
  }
}

export { Tiles };
