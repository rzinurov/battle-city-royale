import { Room } from "@mikewesthad/dungeon";
import { Tiles } from "./Level";

const addShape = (
  x: number,
  y: number,
  shape: any[],
  layer: Phaser.Tilemaps.TilemapLayer,
  room: Room
) => {
  shape.forEach((row, py) => {
    row.forEach((tileIdx: number, px: number) => {
      if (tileIdx === Tiles.Empty) {
        return;
      }
      const targetX = Math.round(x - row.length / 2 + px);
      const targetY = Math.round(y - shape.length / 2 + py);
      if (
        targetX <= room.left * 2 + 1 ||
        targetY <= room.top * 2 + 1 ||
        targetX >= room.right * 2 ||
        targetY >= room.bottom * 2
      ) {
        return;
      }
      layer.putTileAt(tileIdx, targetX, targetY);
    });
  });
};

const treePatches = (room: Room, treeLayer: Phaser.Tilemaps.TilemapLayer) => {
  const quarter = [
    [Tiles.Empty, Tiles.Tree, Tiles.Tree, Tiles.Empty],
    [Tiles.Tree, Tiles.Tree, Tiles.Tree, Tiles.Tree],
    [Tiles.Tree, Tiles.Tree, Tiles.Tree, Tiles.Tree],
    [Tiles.Empty, Tiles.Tree, Tiles.Tree, Tiles.Empty],
  ];
  const centerX = room.centerX * 2 + 1;
  const centerY = room.centerY * 2 + 1;
  [
    { x: centerX, y: centerY - 4 },
    { x: centerX - 4, y: centerY },
    { x: centerX + 4, y: centerY },
    { x: centerX, y: centerY + 4 },
    { x: centerX - 6, y: centerY - 6 },
    { x: centerX + 6, y: centerY - 6 },
    { x: centerX - 6, y: centerY + 6 },
    { x: centerX + 6, y: centerY + 6 },
    { x: centerX - 10, y: centerY },
    { x: centerX + 10, y: centerY },
    { x: centerX, y: centerY - 10 },
    { x: centerX, y: centerY + 10 },
  ].forEach((xy) => {
    addShape(xy.x, xy.y, quarter, treeLayer, room);
  });
};

const brickPillars = (
  room: Room,
  groundLayer: Phaser.Tilemaps.TilemapLayer
) => {
  const pillar = [
    [Tiles.Empty, Tiles.Brick, Tiles.Brick, Tiles.Empty],
    [Tiles.Brick, Tiles.Brick, Tiles.Brick, Tiles.Brick],
    [Tiles.Brick, Tiles.Brick, Tiles.Brick, Tiles.Brick],
    [Tiles.Empty, Tiles.Brick, Tiles.Brick, Tiles.Empty],
  ];
  const centerX = room.centerX * 2 + 1;
  const centerY = room.centerY * 2 + 1;
  [
    { x: centerX - 4, y: centerY + 4 },
    { x: centerX + 4, y: centerY - 4 },
    { x: centerX - 4, y: centerY - 4 },
    { x: centerX + 4, y: centerY + 4 },
  ].forEach((xy) => {
    addShape(xy.x, xy.y, pillar, groundLayer, room);
  });
};

const metalPillars = (
  room: Room,
  groundLayer: Phaser.Tilemaps.TilemapLayer
) => {
  const pillar = [
    [Tiles.Empty, Tiles.Metal, Tiles.Metal, Tiles.Empty],
    [Tiles.Metal, Tiles.Metal, Tiles.Metal, Tiles.Metal],
    [Tiles.Metal, Tiles.Metal, Tiles.Metal, Tiles.Metal],
    [Tiles.Empty, Tiles.Metal, Tiles.Metal, Tiles.Empty],
  ];
  const centerX = room.centerX * 2 + 1;
  const centerY = room.centerY * 2 + 1;
  [
    { x: centerX - 4, y: centerY },
    { x: centerX + 4, y: centerY },
  ].forEach((xy) => {
    addShape(xy.x, xy.y, pillar, groundLayer, room);
  });
};

const cornerForest = (room: Room, treeLayer: Phaser.Tilemaps.TilemapLayer) => {
  const tree = [
    [Tiles.Tree, Tiles.Tree],
    [Tiles.Tree, Tiles.Tree],
  ];
  [
    { x: (room.x + 1) * 2 + 1, y: (room.y + 1) * 2 + 1 },
    { x: (room.x + 1) * 2 + 3, y: (room.y + 1) * 2 + 1 },
    { x: (room.x + 1) * 2 + 1, y: (room.y + 1) * 2 + 3 },
    { x: (room.right - 1) * 2 + 1, y: (room.y + 1) * 2 + 1 },
    { x: (room.right - 1) * 2 - 1, y: (room.y + 1) * 2 + 1 },
    { x: (room.right - 1) * 2 + 1, y: (room.y + 1) * 2 + 3 },
    { x: (room.x + 1) * 2 + 1, y: (room.bottom - 1) * 2 + 1 },
    { x: (room.x + 1) * 2 + 3, y: (room.bottom - 1) * 2 + 1 },
    { x: (room.x + 1) * 2 + 1, y: (room.bottom - 1) * 2 - 1 },
    { x: (room.right - 1) * 2 + 1, y: (room.bottom - 1) * 2 + 1 },
    { x: (room.right - 1) * 2 - 1, y: (room.bottom - 1) * 2 + 1 },
    { x: (room.right - 1) * 2 + 1, y: (room.bottom - 1) * 2 - 1 },
  ].forEach((xy) => {
    addShape(xy.x, xy.y, tree, treeLayer, room);
  });
};

const aquaDiscoteque = (
  room: Room,
  waterLayer: Phaser.Tilemaps.TilemapLayer
) => {
  const square = [
    [Tiles.Water, Tiles.Water],
    [Tiles.Water, Tiles.Water],
  ];
  const centerX = room.centerX * 2 + 1;
  const centerY = room.centerY * 2 + 1;
  [
    { x: centerX - 3, y: centerY },
    { x: centerX - 3, y: centerY - 2 },
    { x: centerX - 3, y: centerY - 4 },
    { x: centerX - 1, y: centerY - 4 },
    { x: centerX + 1, y: centerY - 4 },
    { x: centerX + 3, y: centerY - 4 },

    { x: centerX + 3, y: centerY },
    { x: centerX + 3, y: centerY + 2 },
    { x: centerX + 3, y: centerY + 4 },
    { x: centerX + 1, y: centerY + 4 },
    { x: centerX - 1, y: centerY + 4 },
    { x: centerX - 3, y: centerY + 4 },
  ].forEach((xy) => {
    addShape(xy.x, xy.y, square, waterLayer, room);
  });
};

const brickPerimeter = (
  room: Room,
  groundLayer: Phaser.Tilemaps.TilemapLayer
) => {
  const square = [
    [Tiles.Brick, Tiles.Brick],
    [Tiles.Brick, Tiles.Brick],
  ];
  for (let x = (room.left + 2) * 2 + 1; x <= (room.right - 1) * 2; x += 2) {
    addShape(x, (room.top + 2) * 2 + 1, square, groundLayer, room);
    addShape(x, (room.bottom - 2) * 2 + 1, square, groundLayer, room);
  }
  for (let y = (room.top + 3) * 2 + 1; y <= (room.bottom - 2) * 2; y += 2) {
    addShape((room.left + 2) * 2 + 1, y, square, groundLayer, room);
    addShape((room.right - 2) * 2 + 1, y, square, groundLayer, room);
  }
};

const brickSquares = (
  room: Room,
  groundLayer: Phaser.Tilemaps.TilemapLayer
) => {
  const pillar = [
    [Tiles.Brick, Tiles.Brick],
    [Tiles.Brick, Tiles.Brick],
  ];
  const centerX = room.centerX * 2 + 1;
  const centerY = room.centerY * 2 + 1;
  [
    { x: centerX - 4, y: centerY + 4 },
    { x: centerX + 4, y: centerY - 4 },
    { x: centerX - 4, y: centerY - 4 },
    { x: centerX + 4, y: centerY + 4 },
  ].forEach((xy) => {
    addShape(xy.x, xy.y, pillar, groundLayer, room);
  });
};

export {
  treePatches,
  brickPillars,
  metalPillars,
  cornerForest,
  aquaDiscoteque,
  brickPerimeter,
  brickSquares,
};
