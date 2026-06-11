import Phaser from "phaser";

/**
 * Punto zero. Schermata di boot vuota e funzionante.
 *
 * Da qui parte l'esperimento centrale: pipeline OSM -> tilemap Phaser.
 * Scaricare un bounding box del Golfo Borromeo via Overpass API,
 * convertire il GeoJSON in una tilemap (lago->acqua, edifici->case,
 * isole dove sono davvero) e renderizzarla qui.
 */
export class BootScene extends Phaser.Scene {
  constructor() {
    super("boot");
  }

  create(): void {
    const { width, height } = this.scale;

    this.add
      .text(width / 2, height / 2, "SgravoQuest", {
        fontFamily: "monospace",
        fontSize: "32px",
        color: "#e6edf3",
      })
      .setOrigin(0.5);

    this.add
      .text(width / 2, height / 2 + 40, "clean start — next: OSM → tilemap", {
        fontFamily: "monospace",
        fontSize: "14px",
        color: "#6e7681",
      })
      .setOrigin(0.5);
  }
}
