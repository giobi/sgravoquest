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
      fontFamily: "monospace", fontSize: "28px", color: "#e6edf3",
    }).setOrigin(0.5);
    const bar = this.add.text(w / 2, h / 2 + 16, "caricamento...", {
      fontFamily: "monospace", fontSize: "12px", color: "#8a93a3",
    }).setOrigin(0.5);
    this.load.on("progress", (p: number) => bar.setText(`caricamento... ${Math.round(p * 100)}%`));

    // Overworld pixel (tileset Tuxemon + personaggio Misa animato)
    this.load.image("tux-tiles", "assets/tiles/tuxmon-sample-32px-extruded.png");
    this.load.atlas("misa", "assets/sprites/misa-atlas.png", "assets/sprites/misa-atlas.json");
    // Interno cameretta pre-renderizzato (32px)
    this.load.image("bedroom", "assets/tiles/bedroom.png");
    // Mostri pixel
    this.load.image("magikarp", "assets/monsters/magikarp-front.png");
    this.load.image("charmander-back", "assets/monsters/charmander-back.png");
  }

  create(): void {
    GridPlayer.createAnims(this);
    this.scene.start("bedroom");
  }
}
