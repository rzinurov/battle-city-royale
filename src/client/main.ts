import Phaser from "phaser";
import ButtonPlugin from "phaser3-rex-plugins/plugins/button-plugin.js";
import VirtualJoystickPlugin from "phaser3-rex-plugins/plugins/virtualjoystick-plugin";
import Game from "./scenes/game/Game";
import Preloader from "./scenes/preloader/Preloader";
import Menu from "./scenes/menu/Menu";
import RoundEnd from "./scenes/roundend/RoundEnd";
import RoundStart from "./scenes/roundstart/RoundStart";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 320,
  height: 240,
  roundPixels: true,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  plugins: {
    global: [
      {
        key: "rexVirtualJoystick",
        plugin: VirtualJoystickPlugin,
        start: true,
      },
      { key: "rexButton", plugin: ButtonPlugin, start: true },
    ],
  },
  scene: [Preloader, Menu, Game, RoundStart, RoundEnd],
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};

export default new Phaser.Game(config);
