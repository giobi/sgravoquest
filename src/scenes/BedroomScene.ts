import Phaser from "phaser";
import { GridPlayer } from "../GridPlayer";
import { DialogBox } from "../ui";

const TS = 32;
const COLS = 10;
const ROWS = 9;
const DOOR_X = 5;
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

    // Pavimento in legno
    const g = this.add.graphics();
    g.fillStyle(0xb5824a, 1).fillRect(0, 0, W, H);
    g.lineStyle(1, 0x9c6c3a, 0.6);
    for (let y = TS; y < H; y += TS) g.lineBetween(0, y, W, y);
    for (let x = 0; x < W; x += TS * 2) g.lineBetween(x, 0, x, H);

    // Muri
    g.fillStyle(0x5a4632, 1);
    g.fillRect(0, 0, W, TS); // muro alto
    g.fillRect(0, 0, TS, H); // sx
    g.fillRect(W - TS, 0, TS, H); // dx
    g.fillRect(0, H - TS, W, TS); // basso
    // battiscopa
    g.fillStyle(0x6e573d, 1).fillRect(TS, TS, W - TS * 2, 4);

    // Finestra sul muro alto
    g.fillStyle(0x8ecae6, 1).fillRect(TS * 3, 6, TS * 2, TS - 12);
    g.lineStyle(3, 0xe9edf0, 1).strokeRect(TS * 3, 6, TS * 2, TS - 12);
    g.lineBetween(TS * 4, 6, TS * 4, TS - 6);

    // Letto (top-left, 2 tile)
    const bx = TS, by = TS;
    g.fillStyle(0x9c3a3a, 1).fillRect(bx + 2, by + 2, TS * 2 - 4, TS * 2 - 4); // coperta
    g.fillStyle(0xf4f1de, 1).fillRect(bx + 4, by + 4, TS * 2 - 8, TS - 6); // cuscino
    g.lineStyle(2, 0x6e2828, 1).strokeRect(bx + 2, by + 2, TS * 2 - 4, TS * 2 - 4);

    // Tappeto
    g.fillStyle(0x3a6ea5, 0.7).fillEllipse(W / 2, H / 2 + 8, TS * 3, TS * 2);

    // Porta (uscita) in basso
    g.fillStyle(0x3b2a1a, 1).fillRect(DOOR_X * TS + 2, DOOR_Y * TS, TS - 4, TS);
    g.fillStyle(0xc9a227, 1).fillCircle(DOOR_X * TS + TS - 8, DOOR_Y * TS + TS / 2, 2);
    this.add.text(DOOR_X * TS + TS / 2, DOOR_Y * TS - 2, "▼", {
      fontFamily: "monospace", fontSize: "12px", color: "#f8d24a",
    }).setOrigin(0.5);

    const blocked = (tx: number, ty: number): boolean => {
      if (tx === DOOR_X && ty === DOOR_Y) return false; // porta calpestabile
      if (tx <= 0 || ty <= 0 || tx >= COLS - 1 || ty >= ROWS - 1) return true; // muri
      if (tx >= 1 && tx <= 2 && ty >= 1 && ty <= 2) return true; // letto
      return false;
    };

    this.player = new GridPlayer(this, TS, 5, 3, blocked, (tx, ty) => this.onTile(tx, ty));
    this.player.facing = "down";

    this.cameras.main.setBackgroundColor("#0b0e14");
    this.cameras.main.setZoom(2.2);
    this.cameras.main.centerOn(W / 2, H / 2);

    this.add.text(W / 2, -10, "Cameretta — Pallanza", {
      fontFamily: "monospace", fontSize: "11px", color: "#f8f8f8",
    }).setOrigin(0.5).setScrollFactor(0);

    this.dialog = new DialogBox(this);
    this.dialog.show("Ti svegli. È mattina a Pallanza. La porta è di sotto (▼). Frecce/WASD per muoverti.");
    this.time.delayedCall(4200, () => this.dialog.hide());
  }

  private onTile(tx: number, ty: number): void {
    if (tx === DOOR_X && ty === DOOR_Y && !this.exiting) {
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
