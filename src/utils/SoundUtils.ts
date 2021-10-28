import Sounds from "~/consts/Sounds";

const distanceThreshold = 120;

export default {
  play(scene: Phaser.Scene, sound: Sounds, x: number, y: number) {
    const volume = this.getVolume(scene, x, y);
    if (volume === 0) {
      return;
    }
    scene.sound.get(sound).play({
      volume,
    });
  },
  getVolume(scene: Phaser.Scene, x: number, y: number) {
    const distance = Phaser.Math.Distance.Between(
      scene.cameras.main.scrollX + scene.cameras.main.centerX,
      scene.cameras.main.scrollY + scene.cameras.main.centerY,
      x,
      y
    );
    if (distance > distanceThreshold) {
      return 0;
    }
    return 1 - distance / distanceThreshold;
  },
};
