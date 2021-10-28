import Phaser from "phaser";
import Directions from "~/consts/Directions";
import Scenes from "~/consts/Scenes";
import Bullet from "~/scenes/game/objects/Bullet";
import Enemy from "~/scenes/game/objects/EnemyTank";
import Player from "~/scenes/game/objects/PlayerTank";
import BulletPool from "~/scenes/game/objects/pools/BulletPool";
import EnemyPool from "~/scenes/game/objects/pools/EnemyPool";
import ExplosionPool from "~/scenes/game/objects/pools/ExplosionPool";
import Tank from "~/scenes/game/objects/Tank";
import InputOverlay, { Actions } from "~/ui/InputOverlay";
import TileCollideHelper from "~/scenes/game/utils/TileCollideHelper";
import FieldOfView from "./FieldOfView";
import Level from "./Level";
import Sidebar from "./ui/Sidebar";
import Animations from "~/consts/Animations";
import LeaderboardRow from "./ui/LeaderboardRow";

const maxBots: number = 15;

export default class GameScene extends Phaser.Scene {
  private bulletPool!: BulletPool;
  private explosionPool!: ExplosionPool;
  private fov!: FieldOfView;
  private round!: integer;
  private sidebar!: Sidebar;

  level!: Level;

  enemyPool!: EnemyPool;
  player!: Player;

  constructor() {
    super(Scenes.Game);
  }

  init(data: { round: integer }) {
    this.round = data.round;
  }

  create() {
    this.level = new Level(this, String(this.round));
    this.initObjects();
    this.initPhysics();
    this.initFieldOfView();
    this.spawnTanks();
    this.initSidebar();
    this.initCamera();
    this.initInput();
  }

  private initObjects() {
    this.explosionPool = this.add.existing(new ExplosionPool(this));
    this.bulletPool = this.add.existing(
      new BulletPool(this, this.explosionPool)
    );
    this.enemyPool = this.add.existing(
      new EnemyPool(this, this.bulletPool, this.explosionPool)
    );
    this.player = this.add.existing(
      new Player(this, this.bulletPool, this.explosionPool)
    );
  }

  private initPhysics() {
    this.physics.world.setBounds(0, 0, this.level.width, this.level.height);

    this.physics.add.collider(this.player, this.level.groundLayer);
    this.physics.add.collider(this.player, this.level.waterLayer);
    this.physics.add.collider(this.player, this.enemyPool);

    this.physics.add.collider(this.enemyPool, this.level.groundLayer);
    this.physics.add.collider(this.enemyPool, this.level.waterLayer);
    this.physics.add.collider(this.enemyPool, this.enemyPool);

    const tileCollideHelper = new TileCollideHelper(
      this,
      this.level.groundLayer
    );

    this.physics.add.collider(
      this.bulletPool,
      this.bulletPool,
      (obj1, obj2) => {
        this.bulletPool.onCollideBullet(obj1 as Bullet);
        this.bulletPool.onCollideBullet(obj2 as Bullet);
      }
    );
    this.physics.add.collider(
      this.bulletPool,
      this.level.groundLayer,
      (obj1, layerData) => {
        const bullet = obj1 as Bullet;
        const tilesDestroyed = tileCollideHelper.onCollideBullet(
          bullet,
          layerData
        );
        if (tilesDestroyed.length > 0) {
          this.sidebar.onTilesDestroyed(tilesDestroyed);
        }
        this.bulletPool.onCollideMetal(bullet);
      }
    );
    this.physics.add.overlap(this.bulletPool, this.enemyPool, (obj1, obj2) => {
      const bullet = obj1 as Bullet;
      const enemy = obj2 as Enemy;
      const killed = this.enemyPool.onCollideBullet(enemy);
      this.bulletPool.onCollideEnemy(bullet);
      if (killed) {
        if (bullet.owner!.id !== enemy.id) {
          bullet.owner!.score++;
          this.updateLeaderboard();
        }
      }
    });
    this.physics.add.overlap(this.bulletPool, this.player, (obj1, obj2) => {
      const bullet = obj1 as Bullet;
      const killed = (obj2 as Player).onCollideBullet();
      this.bulletPool.onCollidePlayer(bullet);
      if (killed) {
        if (bullet.owner!.id !== this.player.id) {
          bullet.owner!.score++;
          this.updateLeaderboard();
        }

        this.time.addEvent({
          delay: 3000,
          callback: () => {
            this.spawnPlayer();
          },
        });
      }
    });
    this.physics.world.on(
      "worldbounds",
      (body: { gameObject: Bullet }) => {
        if (body.gameObject instanceof Bullet) {
          this.bulletPool.onCollideMetal(body.gameObject);
        }
      },
      this
    );
  }

  private initFieldOfView() {
    this.fov = new FieldOfView(
      this,
      this.level.widthInTiles,
      this.level.height,
      [this.level.groundLayer, this.level.treeLayer, this.level.waterLayer],
      this.player,
      [this.bulletPool, this.explosionPool, this.enemyPool]
    );
  }

  private spawnTanks() {
    // fill all rooms  with bots except for one
    for (let i = 0; i < this.level.dungeon.rooms.length - 1; i++) {
      this.spawnEnemy();
    }
    //spawn player in the last room
    this.spawnPlayer();
    // spawn a bot every once in a while, until max number is reached
    this.time.addEvent({
      delay: 3000,
      callback: () => {
        if (this.enemyPool.countActive() < maxBots) {
          this.spawnEnemy();
        }
      },
      loop: true,
    });
  }

  private spawnPlayer() {
    const spawnPoint = this.level.getNextSpawnPoint();
    this.player.spawn(spawnPoint.x, spawnPoint.y);
    this.updateLeaderboard();
  }

  private spawnEnemy() {
    const spawnPosition = this.level.getNextSpawnPoint();
    this.enemyPool.spawn(spawnPosition.x, spawnPosition.y);
    this.updateLeaderboard();
  }

  private initSidebar() {
    this.sidebar = new Sidebar(
      this,
      240,
      0,
      80,
      240,
      [this.level.groundLayer, this.level.waterLayer, this.level.treeLayer],
      this.player,
      () => this.endRound()
    )
      .setScrollFactor(0, 0)
      .setDepth(3);
    this.add.existing(this.sidebar);

    this.updateLeaderboard();
  }

  private updateLeaderboard() {
    this.sidebar?.updateLeaderboard(this.getLeaderboard());
  }

  private initCamera() {
    this.cameras.main
      .fadeIn(3000)
      .startFollow(this.player, true, 0.1, 0.1)
      .setFollowOffset(-40, 0); // half of the sidebar width
  }

  private initInput() {
    this.add.existing(
      new InputOverlay(this)
        .onAction(Actions.Space, () => {
          this.player.shoot();
        })
        .onAction(Actions.Up, () => {
          this.player.move(Directions.Up);
        })
        .onAction(Actions.Down, () => {
          this.player.move(Directions.Down);
        })
        .onAction(Actions.Left, () => {
          this.player.move(Directions.Left);
        })
        .onAction(Actions.Right, () => {
          this.player.move(Directions.Right);
        })
        .onAction(Actions.NoInput, () => {
          this.player.stop();
        })
    );
  }

  endRound() {
    this.cameras.main
      .fadeOut(500)
      .once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
        this.player.stop();
        this.scene.stop(Scenes.Game);

        this.scene.start(Scenes.RoundEnd, {
          round: this.round,
          leaderboard: this.getLeaderboard(),
        });
      });
  }

  private getLeaderboard(): LeaderboardRow[] {
    return [this.player, ...(this.enemyPool.children.getArray() as Tank[])].map(
      (tank) => new LeaderboardRow(tank)
    );
  }

  update(time: number, delta: number) {
    this.fov.update(time, delta);
  }
}
