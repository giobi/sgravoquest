import Phaser from "phaser";

export type Dir = "up" | "down" | "left" | "right";

/**
 * Movimento a griglia tile-locked, stile Pokémon. Sprite Misa (atlas Tuxemon, pixel).
 * La scena fornisce isBlocked(tx,ty) e onEnterTile(tx,ty).
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

    this.sprite = scene.add
      .sprite(startTX * tileSize + tileSize / 2, startTY * tileSize + tileSize / 2, "misa", "misa-front")
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

  private idleFrame(dir: Dir): string {
    return `misa-${dir === "up" ? "back" : dir === "down" ? "front" : dir}`;
  }

  update(): void {
    if (this.moving || !this.enabled) return;
    let dir: Dir | null = null;
    if (this.pressed("left")) dir = "left";
    else if (this.pressed("right")) dir = "right";
    else if (this.pressed("up")) dir = "up";
    else if (this.pressed("down")) dir = "down";

    if (!dir) {
      this.sprite.anims.stop();
      this.sprite.setFrame(this.idleFrame(this.facing));
      return;
    }

    this.facing = dir;
    const d = { up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0] }[dir];
    const ntx = this.tileX + d[0];
    const nty = this.tileY + d[1];

    if (this.isBlocked(ntx, nty)) {
      this.sprite.setFrame(this.idleFrame(dir));
      return;
    }

    this.moving = true;
    this.tileX = ntx;
    this.tileY = nty;
    this.sprite.anims.play(`walk-${dir}`, true);
    this.scene.tweens.add({
      targets: this.sprite,
      x: ntx * this.ts + this.ts / 2,
      y: nty * this.ts + this.ts / 2,
      duration: 160,
      onComplete: () => {
        this.moving = false;
        this.onEnterTile(this.tileX, this.tileY);
      },
    });
  }

  static createAnims(scene: Phaser.Scene): void {
    const mk = (dir: Dir, prefix: string) => {
      if (scene.anims.exists(`walk-${dir}`)) return;
      scene.anims.create({
        key: `walk-${dir}`,
        frames: scene.anims.generateFrameNames("misa", { prefix: `misa-${prefix}-walk.`, start: 0, end: 3, zeroPad: 3 }),
        frameRate: 8,
        repeat: -1,
      });
    };
    mk("up", "back"); mk("down", "front"); mk("left", "left"); mk("right", "right");
  }

  /** compat: niente più texture vettoriali generate */
  static ensureTextures(_scene: Phaser.Scene): void { /* no-op */ }
}
