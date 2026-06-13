import Phaser from "phaser";
import { GridPlayer } from "../GridPlayer";
import { DialogBox } from "../ui";

const TS = 32;
const COLS = 20;
const ROWS = 11;
const DOOR_X = 10; // uscita in basso
const DOOR_Y = ROWS - 1;

export class BedroomScene extends Phaser.Scene {
  private player!: GridPlayer;
  private dialog!: DialogBox;
  private exiting = false;

  constructor() {
    super("bedroom");
  }

  create(): void {
    const W = COLS * TS;
    const H = ROWS * TS;

    this.add.image(0, 0, "bedroom").setOrigin(0, 0).setDepth(0);

    // marcatore uscita
    this.add.text(DOOR_X * TS + TS / 2, DOOR_Y * TS + 6, "▼", {
      fontFamily: "monospace", fontSize: "14px", color: "#ffe27a",
    }).setOrigin(0.5).setDepth(5);

    const blocked = (tx: number, ty: number): boolean => {
      if (tx < 0 || ty < 0 || tx >= COLS || ty >= ROWS) return true;
      if (ty <= 1) return true; // muro alto
      if (tx === 1 && ty >= 2 && ty <= 4) return true; // letto
      if (tx >= 17 && tx <= 18 && ty === 2) return true; // scaffale
      if (tx === 17 && ty === 8) return true; // pianta
      if (tx === 3 && ty === 8) return true; // tavolino
      return false;
    };

    this.player = new GridPlayer(this, TS, 10, 6, blocked, (tx, ty) => this.onTile(tx, ty));
    this.player.facing = "down";

    this.cameras.main.setBackgroundColor("#0b0e14");
    this.cameras.main.setZoom(1);
    this.cameras.main.centerOn(W / 2, H / 2);

    this.dialog = new DialogBox(this);
    this.dialog.show("Ti svegli. È mattina a Pallanza. Esci dalla porta in basso (▼). Frecce/WASD.");
    this.time.delayedCall(4200, () => this.dialog.hide());
  }

  private onTile(tx: number, ty: number): void {
    if (ty === DOOR_Y && (tx === DOOR_X || tx === DOOR_X - 1) && !this.exiting) {
      this.exiting = true;
      this.player.enabled = false;
      this.cameras.main.fadeOut(350, 0, 0, 0);
      this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("lakefront"));
    }
  }

  update(): void {
    this.player.update();
  }
}
