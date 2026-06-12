import Phaser from "phaser";
import { GridPlayer } from "../GridPlayer";
import { DialogBox } from "../ui";

const TS = 32;
const COLS = 20;
const ROWS = 15;
const WATER_ROWS = 5; // righe 0..4 = lago
const SAND_ROW = 5; // riga riva

export class LakefrontScene extends Phaser.Scene {
  private player!: GridPlayer;
  private dialog!: DialogBox;
  private busy = false;

  constructor() {
    super("lakefront");
  }

  create(): void {
    const W = COLS * TS;
    const H = ROWS * TS;
    const waterY = WATER_ROWS * TS;
    const grassY = (SAND_ROW + 1) * TS;

    const g = this.add.graphics();

    // prato base
    g.fillStyle(0x74c46a, 1).fillRect(0, 0, W, H);
    // texture prato: ciuffi sparsi piu chiari/scuri
    for (let i = 0; i < 220; i++) {
      const x = (i * 53) % W;
      const y = grassY + ((i * 97) % (H - grassY));
      g.fillStyle(i % 2 ? 0x69b85f : 0x82cf78, 0.5).fillEllipse(x, y, 10, 5);
    }

    // riva (sabbia) — banda morbida
    g.fillStyle(0xe7d6a2, 1).fillRect(0, waterY - 6, W, TS + 12);
    g.fillStyle(0xddc98e, 0.6).fillRect(0, grassY - 8, W, 8);

    // lago — gradiente + onde
    g.fillGradientStyle(0x2f7fd0, 0x2f7fd0, 0x57a8e8, 0x57a8e8, 1).fillRect(0, 0, W, waterY - 4);
    g.lineStyle(2, 0xbfe2ff, 0.5);
    for (let r = 0; r < 4; r++) {
      const yy = 18 + r * 34;
      g.beginPath();
      for (let x = 0; x <= W; x += 16) {
        const oy = yy + Math.sin(x / 36 + r) * 4;
        if (x === 0) g.moveTo(x, oy); else g.lineTo(x, oy);
      }
      g.strokePath();
    }

    // ninfee sul lago
    for (let i = 0; i < 6; i++) {
      const x = 40 + ((i * 131) % (W - 80));
      const y = 20 + ((i * 57) % (waterY - 40));
      g.fillStyle(0x3fae5a, 1).fillEllipse(x, y, 22, 14);
      g.fillStyle(0x57c46f, 1).fillEllipse(x + 2, y - 1, 12, 7);
    }

    // fiori e cespugli sul prato
    const flower = (x: number, y: number, c: number) => {
      g.fillStyle(c, 1);
      for (let a = 0; a < 5; a++) {
        const ang = (a / 5) * Math.PI * 2;
        g.fillCircle(x + Math.cos(ang) * 5, y + Math.sin(ang) * 5, 3.5);
      }
      g.fillStyle(0xffe27a, 1).fillCircle(x, y, 3);
    };
    const cols = [0xe5556b, 0xf2a23c, 0xd96fe0, 0xffffff];
    for (let i = 0; i < 16; i++) {
      const x = 20 + ((i * 173) % (W - 40));
      const y = grassY + 16 + ((i * 211) % (H - grassY - 30));
      flower(x, y, cols[i % cols.length]);
    }
    // cespugli tondi
    for (let i = 0; i < 5; i++) {
      const x = 60 + ((i * 277) % (W - 120));
      const y = grassY + 40 + ((i * 149) % (H - grassY - 60));
      g.fillStyle(0x4f9e45, 1).fillCircle(x, y, 13);
      g.fillStyle(0x5fb554, 1).fillCircle(x - 4, y - 4, 9);
    }

    const blocked = (tx: number, ty: number): boolean => {
      if (tx < 0 || ty < 0 || tx >= COLS || ty >= ROWS) return true;
      return ty < WATER_ROWS; // non entri nel lago
    };

    this.player = new GridPlayer(this, TS, 9, 11, blocked, (tx, ty) => this.onTile(tx, ty));
    this.player.facing = "up";

    this.cameras.main.setBounds(0, 0, W, H);
    this.cameras.main.setZoom(1);
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
    this.cameras.main.fadeIn(300, 0, 0, 0);

    this.add.text(W / 2, 6, "Lungolago di Pallanza", {
      fontFamily: "Trebuchet MS, Verdana, sans-serif", fontSize: "13px",
      color: "#ffffff", backgroundColor: "#00000066", padding: { x: 6, y: 2 },
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(900);

    this.dialog = new DialogBox(this);
    this.dialog.show("Il lago! Avvicìnati all'acqua (su ▲)... qualcosa potrebbe abboccare.");
    this.time.delayedCall(4000, () => this.dialog.hide());
  }

  private onTile(_tx: number, ty: number): void {
    if (this.busy) return;
    if (ty === SAND_ROW && Math.random() < 0.55) {
      this.busy = true;
      this.player.enabled = false;
      this.dialog.show("L'acqua si increspa...!");
      this.cameras.main.flash(200, 255, 255, 255);
      this.time.delayedCall(700, () => {
        this.cameras.main.fadeOut(300, 0, 0, 0);
        this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("battle"));
      });
    }
  }

  update(): void {
    this.player.update();
  }
}
