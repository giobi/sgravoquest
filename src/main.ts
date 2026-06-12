import Phaser from "phaser";
import { BootScene } from "./scenes/BootScene";
import { BedroomScene } from "./scenes/BedroomScene";
import { LakefrontScene } from "./scenes/LakefrontScene";
import { BattleScene } from "./scenes/BattleScene";

// Risoluzione interna FISSA: tutto è authorato qui dentro e scalato in blocco.
// 480x270 (16:9) → ×4 = 1920×1080 esatto. pixelaggio determinato e coerente
// fra overworld (tile 32px, zoom 1) e battaglia (stesse coordinate base).
// override via URL per tarare lo zoom: ?res=640x360 (default 480x270)
const _p = new URLSearchParams(location.search).get("res");
const _m = _p && /^\d+x\d+$/.test(_p) ? _p.split("x").map(Number) : [640, 360];
export const GAME_W = _m[0];
export const GAME_H = _m[1];

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
