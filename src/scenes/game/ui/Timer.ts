import Fonts from "~/consts/Fonts";
import Grid from "~/consts/Grid";
import StringUtils from "~/utils/StringUtils";

export default class Timer extends Phaser.GameObjects.Container {
  private text: Phaser.GameObjects.BitmapText;
  private value!: number;

  constructor(scene: Phaser.Scene, x: number, y: number, time: number) {
    super(scene, x, y);

    this.value = time * 1000;
    this.text = this.scene.add
      .bitmapText(0, 0, Fonts.Default, "00:00", Grid.Base - 1)
      .setOrigin(0.5)
      .setTint(0x000000);

    this.add(this.text);
  }

  preUpdate(time: number, delta: number) {
    this.value -= delta;
    const seconds = Math.floor(this.value / 1000);
    if (seconds <= 0) {
      this.active = false;
      this.emit("stopped");
    }
    this.text.text = this.formatTime(seconds);
    if (seconds > 10 || time % 1000 < 500) {
      this.text.setTint(0x000000);
    } else {
      this.text.setTint(0x6b0800);
    }
  }

  private formatTime(seconds: number): string {
    return `${StringUtils.pad(Math.floor(seconds / 60))}:${StringUtils.pad(
      seconds % 60
    )}`;
  }
}
