import Phaser from "phaser";
import { GridPlayer } from "../GridPlayer";
import { DialogBox } from "../ui";

const TS = 32;
const COLS = 20;
const ROWS = 15;

// indici tile (gid-1) nel tileset Tuxemon
const WATER = 249;
const SAND = 60;
const GRASS = 5;
const GRASS_D = 6;
const FLOWER = 7;
const MUSH = 55;

const WATER_ROWS = 5;
const SAND_ROW = 5;

export class LakefrontScene extends Phaser.Scene {
  private player!: GridPlayer;
  private dialog!: DialogBox;
  private grid: number[][] = [];
  private busy = false;

  constructor() {
    super("lakefront");
  }

  create(): void {
    this.grid = [];
    for (let y = 0; y < ROWS; y++) {
      const row: number[] = [];
      for (let x = 0; x < COLS; x++) {
        if (y < WATER_ROWS) row.push(WATER);
        else if (y === SAND_ROW) row.push(SAND);
        else row.push(Math.random() < 0.12 ? GRASS_D : GRASS);
      }
      this.grid.push(row);
    }
    const decos = [FLOWER, MUSH, FLOWER, GRASS_D, FLOWER];
    for (let i = 0; i < 14; i++) {
      const x = 1 + Math.floor(Math.random() * (COLS - 2));
      const y = SAND_ROW + 1 + Math.floor(Math.random() * (ROWS - SAND_ROW - 2));
      this.grid[y][x] = decos[i % decos.length];
    }

    const map = this.make.tilemap({ data: this.grid, tileWidth: TS, tileHeight: TS });
    const tiles = map.addTilesetImage("tux", "tux-tiles", TS, TS, 1, 2)!;
    map.createLayer(0, tiles, 0, 0);

    const W = COLS * TS;
    const H = ROWS * TS;

    const blocked = (tx: number, ty: number): boolean => {
      if (tx < 0 || ty < 0 || tx >= COLS || ty >= ROWS) return true;
      return this.grid[ty][tx] === WATER;
    };

    this.player = new GridPlayer(this, TS, 9, 11, blocked, (tx, ty) => this.onTile(tx, ty));
    this.player.facing = "up";

    this.cameras.main.setBounds(0, 0, W, H);
    this.cameras.main.setZoom(1);
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
    this.cameras.main.fadeIn(300, 0, 0, 0);

    this.add.text(W / 2, 6, "Lungolago di Pallanza", {
      fontFamily: "monospace", fontSize: "12px",
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
