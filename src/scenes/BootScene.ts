import Phaser from "phaser";
import { GridPlayer } from "../GridPlayer";

export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  preload(): void {
    const w = this.scale.width;
    const h = this.scale.height;
    this.add.text(w / 2, h / 2 - 20, "SgravoQuest", {
      fontFamily: "monospace",
      fontSize: "28px",
      color: "#e6edf3",
    }).setOrigin(0.5);
    const bar = this.add.text(w / 2, h / 2 + 16, "caricamento...", {
      fontFamily: "monospace",
      fontSize: "13px",
      color: "#6e7681",
    }).setOrigin(0.5);
    this.load.on("progress", (p: number) => bar.setText(`caricamento... ${Math.round(p * 100)}%`));

    // Overworld
    this.load.image("tux-tiles", "assets/tiles/tuxmon-sample-32px-extruded.png");
    this.load.atlas("misa", "assets/sprites/misa-atlas.png", "assets/sprites/misa-atlas.json");

    // Mostri (Pokémon veri da PokeAPI)
    this.load.image("magikarp", "assets/monsters/magikarp-front.png");
    this.load.image("magikarp-art", "assets/monsters/magikarp-art.png");
    this.load.image("charmander-back", "assets/monsters/charmander-back.png");
    this.load.image("charmander-front", "assets/monsters/charmander-front.png");
  }

  create(): void {
    GridPlayer.createAnims(this);
    this.scene.start("bedroom");
  }
}
