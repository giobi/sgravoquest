import Phaser from "phaser";
import { GridPlayer } from "../GridPlayer";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  preload(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    this.add.text(w / 2, h / 2 - 18, "SgravoQuest", {
      fontFamily: "Trebuchet MS, Verdana, sans-serif",
      fontSize: "30px",
      color: "#e6edf3",
    }).setOrigin(0.5);
    const bar = this.add.text(w / 2, h / 2 + 16, "caricamento...", {
      fontFamily: "Trebuchet MS, Verdana, sans-serif",
      fontSize: "13px",
      color: "#8a93a3",
    }).setOrigin(0.5);
    this.load.on("progress", (p: number) => bar.setText(`caricamento... ${Math.round(p * 100)}%`));

    // Mostri: official artwork (smooth, non pixel) da PokeAPI
    this.load.image("magikarp-art", "assets/monsters/magikarp-art.png");
    this.load.image("charmander-art", "assets/monsters/charmander-art.png");
  }

  create(): void {
    GridPlayer.ensureTextures(this);
    this.scene.start("bedroom");
  }
}
