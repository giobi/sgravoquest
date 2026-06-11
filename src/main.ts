import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { BedroomScene } from "./scenes/BedroomScene";
import { LakefrontScene } from "./scenes/LakefrontScene";
import { BattleScene } from "./scenes/BattleScene";

// Risoluzione interna FISSA: tutto è authorato qui dentro e scalato in blocco.
// 480x270 (16:9) → ×4 = 1920×1080 esatto. pixelaggio determinato e coerente
// fra overworld (tile 32px, zoom 1) e battaglia (stesse coordinate base).
export const GAME_W = 480;
export const GAME_H = 270;

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#0b0e14",
  pixelArt: true,
  roundPixels: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: GAME_W,
    height: GAME_H,
  },
  scene: [BootScene, BedroomScene, LakefrontScene, BattleScene],
};

const game = new Phaser.Game(config);
// esposto per debug / e2e (jump scene da console)
(window as unknown as { game: Phaser.Game }).game = game;
