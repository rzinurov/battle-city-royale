import ButtonPlugin from "phaser3-rex-plugins/plugins/button-plugin";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin";

enum Actions {
  Up = "up",
  Down = "down",
  Left = "left",
  Right = "right",
  Space = "space",
  NoInput = "no-input",
}

export default class InputOverlay extends Phaser.GameObjects.Container {
  inputBindings = {};

  constructor(scene: Phaser.Scene) {
    super(scene);

    this.width = this.scene.cameras.main.width;
    this.height = this.scene.cameras.main.height;

    const cursorKeys = this.scene.input.keyboard.createCursorKeys();
    this.bindCursorKeys(cursorKeys);

    if (!this.scene.sys.game.device.os.desktop) {
      this.scene.input.addPointer(1); // enable multi touch
      const joyStick = this.initJoystick();
      const cursorKeys = joyStick.createCursorKeys();
      this.bindCursorKeys(cursorKeys);
      const button = this.initButton();
      button.on("click", () => {
        Actions.Space in this.inputBindings &&
          this.inputBindings[Actions.Space]();
      });
    }

    this.setAlpha(0.1).setDepth(3);
  }

  private initJoystick() {
    const base = this.scene.add.circle(0, 0, 48, 0x888888);
    this.add(base);

    const thumb = this.scene.add.circle(0, 0, 32, 0xcccccc);
    this.add(thumb);

    return (
      this.scene.plugins.get("rexVirtualJoystick") as VirtualJoystickPlugin
    ).add(this.scene, {
      x: 64,
      y: this.height - 64,
      radius: 32,
      base: base,
      thumb: thumb,
      dir: "4dir",
      forceMin: 4,
    });
  }

  private initButton() {
    const circle = this.scene.add
      .circle(this.width - 44, this.height - 64, 32, 0xcccccc)
      .setScrollFactor(0, 0)
      .setInteractive();
    this.add(circle);
    return (this.scene.plugins.get("rexButton") as ButtonPlugin).add(circle);
  }

  private bindCursorKeys(
    cursorKeys: Phaser.Types.Input.Keyboard.CursorKeys | any
  ) {
    cursorKeys.up.addListener("down", () => {
      Actions.Up in this.inputBindings && this.inputBindings[Actions.Up]();
    });
    cursorKeys.down.addListener("down", () => {
      Actions.Down in this.inputBindings && this.inputBindings[Actions.Down]();
    });
    cursorKeys.left.addListener("down", () => {
      Actions.Left in this.inputBindings && this.inputBindings[Actions.Left]();
    });
    cursorKeys.right.addListener("down", () => {
      Actions.Right in this.inputBindings &&
        this.inputBindings[Actions.Right]();
    });

    // space cursor does not exist in joystick cursor keys
    cursorKeys.space?.addListener("down", () => {
      Actions.Space in this.inputBindings &&
        this.inputBindings[Actions.Space]();
    });

    const stopIfNoInput = () => {
      if (
        cursorKeys.left.isUp &&
        cursorKeys.right.isUp &&
        cursorKeys.down.isUp &&
        cursorKeys.up.isUp
      ) {
        Actions.NoInput in this.inputBindings &&
          this.inputBindings[Actions.NoInput]();
      }
    };

    cursorKeys.left.addListener("up", stopIfNoInput);
    cursorKeys.right.addListener("up", stopIfNoInput);
    cursorKeys.up.addListener("up", stopIfNoInput);
    cursorKeys.down.addListener("up", stopIfNoInput);
  }

  onAction(action: Actions, callback: () => void) {
    this.inputBindings[action] = callback;
    return this;
  }
}

export { Actions };
