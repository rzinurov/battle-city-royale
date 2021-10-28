import Phaser from "phaser";
import Animations from "~/consts/Animations";
import Fonts from "~/consts/Fonts";
import Grid from "~/consts/Grid";
import Images from "~/consts/Images";
import Scenes from "~/consts/Scenes";
import Textures from "~/consts/Textures";
import InputOverlay, { Actions } from "~/ui/InputOverlay";

function openExternalLink(url: string) {
  var s = window.open(url, "_blank");
  if (s && s.focus) {
    s.focus();
  } else if (!s) {
    window.location.href = url;
  }
}
export default class Menu extends Phaser.Scene {
  cameraPanComplete: Boolean = false;

  constructor() {
    super(Scenes.Menu);
  }

  create() {
    this.add
      .bitmapText(
        Grid.Base,
        Grid.Base,
        Fonts.Default,
        "I-    00 HI- 20000",
        Grid.Quarter
      )
      .setTint(0xffffff)
      .setOrigin(0, 0);

    this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 - 44,
      Images.MenuLogo
    );

    this.add
      .bitmapText(
        this.cameras.main.width / 2,
        this.cameras.main.height / 2 + 10,
        Fonts.Default,
        "ROYALE",
        Grid.Base
      )
      .setTint(0xde2800)
      .setDropShadow(1, 1, 0xffffff, 1)
      .setOrigin(0.5);

    const tankSprite = this.add
      .sprite(
        this.cameras.main.width / 2 - Grid.Base * 4,
        this.cameras.main.height / 2 + 32 + 4,
        Textures.Sprites
      )
      .play(Animations.Player.MoveRight)
      .setVisible(false);

    this.add
      .bitmapText(
        this.cameras.main.width / 2 - Grid.Base * 3,
        this.cameras.main.height / 2 + 32,
        Fonts.Default,
        "1 PLAYER",
        Grid.Quarter
      )
      .setTint(0xffffff)
      .setOrigin(0)
      .setInteractive({ useHandCursor: true })
      .on("pointerup", () => this.startGame());

    this.add
      .bitmapText(
        this.cameras.main.width / 2 - Grid.Base * 3,
        this.cameras.main.height / 2 + 32 + Grid.Base,
        Fonts.Default,
        "X PLAYERS",
        Grid.Quarter
      )
      .setTint(0xaaaaaa)
      .setOrigin(0);

    this.add
      .bitmapText(
        this.cameras.main.width / 2 - Grid.Base * 3,
        this.cameras.main.height / 2 + 32 + Grid.Base * 2,
        Fonts.Default,
        "CONSTRUCTION",
        Grid.Quarter
      )
      .setTint(0xaaaaaa)
      .setOrigin(0);

    this.add
      .bitmapText(
        this.cameras.main.width / 2,
        this.cameras.main.height - Grid.Base * 2,
        Fonts.Default,
        "TRIBUTE TO BATTLE CITY BY NAMCO LTD.",
        Grid.Quarter
      )
      .setTint(0xffffff)
      .setOrigin(0.5, 0);

    const linkedInUrl = "https://linkedin.com/in/rzinurov";
    this.add
      .bitmapText(
        this.cameras.main.width / 2,
        this.cameras.main.height - Grid.Base,
        Fonts.Default,
        linkedInUrl.toUpperCase(),
        Grid.Quarter
      )
      .setTint(0xffffff)
      .setOrigin(0.5, 0)
      .setInteractive({ useHandCursor: true })
      .on("pointerup", () => openExternalLink(linkedInUrl));

    const onCameraPanComplete = () => {
      tankSprite.setVisible(true);
      this.cameraPanComplete = true;
      inputOverlay.setVisible(true);
    };

    const inputOverlay = this.add
      .existing(
        new InputOverlay(this).onAction(Actions.Space, () => {
          if (!this.cameraPanComplete) {
            cameraPanCompleteTimer.destroy();
            this.cameras.main.pan(160, 120, 0, "Linear", true);
            onCameraPanComplete();
            return;
          }
          this.startGame();
        })
      )
      .setVisible(false);

    this.cameras.main.centerOn(160, -120).pan(160, 120, 3000, "Linear");

    const cameraPanCompleteTimer = this.time.addEvent({
      delay: 3000,
      callback: onCameraPanComplete,
    });
  }

  private startGame() {
    this.scene.stop(Scenes.Menu);
    this.scene.start(Scenes.RoundStart, { round: 1 });
  }
}
