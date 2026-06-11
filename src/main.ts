import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { BedroomScene } from "./scenes/BedroomScene";
import { LakefrontScene } from "./scenes/LakefrontScene";
import { BattleScene } from "./scenes/BattleScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#0b0e14",
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.RESIZE,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600,
  },
  scene: [BootScene, BedroomScene, LakefrontScene, BattleScene],
};

const game = new Phaser.Game(config);
// esposto per debug / e2e (jump scene da console)
(window as unknown as { game: Phaser.Game }).game = game;
