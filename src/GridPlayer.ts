import Phaser from "phaser";

export type Dir = "up" | "down" | "left" | "right";

/**
 * Movimento a griglia tile-locked. Avatar vettoriale (smooth, niente pixel art).
 * 4 texture direzionali generate a runtime + rimbalzo durante il passo.
 */
export class GridPlayer {
  readonly sprite: Phaser.GameObjects.Sprite;
  private scene: Phaser.Scene;
  private ts: number;
  tileX: number;
  tileY: number;
  private moving = false;
  facing: Dir = "down";
  private keys: Record<string, Phaser.Input.Keyboard.Key>;
  enabled = true;
  private isBlocked: (tx: number, ty: number) => boolean;
  private onEnterTile: (tx: number, ty: number) => void;

  constructor(
    scene: Phaser.Scene,
    tileSize: number,
    startTX: number,
    startTY: number,
    isBlocked: (tx: number, ty: number) => boolean,
    onEnterTile: (tx: number, ty: number) => void,
  ) {
    this.scene = scene;
    this.ts = tileSize;
    this.tileX = startTX;
    this.tileY = startTY;
    this.isBlocked = isBlocked;
    this.onEnterTile = onEnterTile;

    GridPlayer.ensureTextures(scene);
    this.sprite = scene.add
      .sprite(startTX * tileSize + tileSize / 2, startTY * tileSize + tileSize / 2, "hero-down")
      .setDepth(10);

    const kb = scene.input.keyboard!;
    this.keys = {
      up: kb.addKey("UP"), down: kb.addKey("DOWN"), left: kb.addKey("LEFT"), right: kb.addKey("RIGHT"),
      w: kb.addKey("W"), a: kb.addKey("A"), s: kb.addKey("S"), d: kb.addKey("D"),
    };
  }

  private pressed(dir: Dir): boolean {
    if (dir === "up") return this.keys.up.isDown || this.keys.w.isDown;
    if (dir === "down") return this.keys.down.isDown || this.keys.s.isDown;
    if (dir === "left") return this.keys.left.isDown || this.keys.a.isDown;
    return this.keys.right.isDown || this.keys.d.isDown;
  }

  update(): void {
    if (this.moving || !this.enabled) return;
    let dir: Dir | null = null;
    if (this.pressed("left")) dir = "left";
    else if (this.pressed("right")) dir = "right";
    else if (this.pressed("up")) dir = "up";
    else if (this.pressed("down")) dir = "down";

    if (!dir) return;

    this.facing = dir;
    this.sprite.setTexture(`hero-${dir}`);
    const d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[dir];
    const ntx = this.tileX + d[0];
    const nty = this.tileY + d[1];
    if (this.isBlocked(ntx, nty)) return;

    this.moving = true;
    this.tileX = ntx;
    this.tileY = nty;
    // rimbalzo morbido del passo
    this.scene.tweens.add({ targets: this.sprite, scaleY: 0.9, duration: 80, yoyo: true });
    this.scene.tweens.add({
      targets: this.sprite,
      x: ntx * this.ts + this.ts / 2,
      y: nty * this.ts + this.ts / 2,
      duration: 150,
      onComplete: () => {
        this.moving = false;
        this.onEnterTile(this.tileX, this.tileY);
      },
    });
  }

  static createAnims(_scene: Phaser.Scene): void {
    /* no-op: avatar vettoriale, niente spritesheet */
  }

  /** Genera le 4 texture direzionali dell'eroe (token tondo smooth con occhi + ciuffo). */
  static ensureTextures(scene: Phaser.Scene): void {
    if (scene.textures.exists("hero-down")) return;
    const W = 30, H = 34, cx = 15, cy = 17, r = 11;
    const skin = 0xf3c9a0, shirt = 0x3f7ad6, hair = 0x5a3a24, white = 0xffffff, pupil = 0x222633;

    const dirs: Dir[] = ["down", "up", "left", "right"];
    for (const dir of dirs) {
      const g = scene.add.graphics();
      // ombra
      g.fillStyle(0x000000, 0.18).fillEllipse(cx, H - 3, 22, 7);
      // corpo (maglietta)
      g.fillStyle(shirt, 1).fillCircle(cx, cy + 3, r);
      // testa
      g.fillStyle(skin, 1).fillCircle(cx, cy - 4, r - 2);
      // capelli (ciuffo dietro rispetto al facing)
      g.fillStyle(hair, 1);
      if (dir === "down") g.fillEllipse(cx, cy - 11, 18, 9);
      else if (dir === "up") g.fillEllipse(cx, cy - 4, 19, 16);
      else if (dir === "left") g.fillEllipse(cx + 4, cy - 8, 16, 12);
      else g.fillEllipse(cx - 4, cy - 8, 16, 12);
      // occhi (non per 'up' — vediamo la nuca)
      if (dir !== "up") {
        const ey = cy - 3;
        let lx = cx - 4, rx = cx + 4;
        if (dir === "left") { lx = cx - 6; rx = cx - 1; }
        if (dir === "right") { lx = cx + 1; rx = cx + 6; }
        g.fillStyle(white, 1).fillCircle(lx, ey, 2.4).fillCircle(rx, ey, 2.4);
        g.fillStyle(pupil, 1).fillCircle(lx, ey + 0.4, 1.2).fillCircle(rx, ey + 0.4, 1.2);
      }
      g.generateTexture(`hero-${dir}`, W, H);
      g.destroy();
    }
  }
}
