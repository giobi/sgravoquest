import Phaser from "phaser";

/** Finestra di testo stile Pokémon, fissata alla camera. */
export class DialogBox {
  private box: Phaser.GameObjects.Graphics;
  private text: Phaser.GameObjects.Text;
  private container: Phaser.GameObjects.Container;

  constructor(scene: Phaser.Scene) {
    const w = scene.scale.width;
    const h = scene.scale.height;
    const bw = w - 24;
    const bh = 70;
    const x = 12;
    const y = h - bh - 12;

    this.box = scene.add.graphics();
    this.box.fillStyle(0x1a1a2e, 0.95);
    this.box.fillRoundedRect(0, 0, bw, bh, 8);
    this.box.lineStyle(3, 0xf8f8f8, 1);
    this.box.strokeRoundedRect(0, 0, bw, bh, 8);

    this.text = scene.add.text(14, 12, "", {
      fontFamily: "monospace",
      fontSize: "15px",
      color: "#f8f8f8",
      wordWrap: { width: bw - 28 },
      lineSpacing: 4,
    });

    this.container = scene.add.container(x, y, [this.box, this.text]).setScrollFactor(0).setDepth(1000);
    this.container.setVisible(false);
  }

  show(msg: string): void {
    this.text.setText(msg);
    this.container.setVisible(true);
  }

  hide(): void {
    this.container.setVisible(false);
  }
}

/** Menu orizzontale di scelte (FIGHT / RUN ...). */
export class ChoiceMenu {
  private container: Phaser.GameObjects.Container;
  private items: Phaser.GameObjects.Text[] = [];
  private cursor = 0;
  private onSelect: (index: number) => void;
  private keys: Phaser.Types.Input.Keyboard.CursorKeys;
  private enterKey: Phaser.Input.Keyboard.Key;
  private spaceKey: Phaser.Input.Keyboard.Key;
  enabled = false;

  constructor(scene: Phaser.Scene, labels: string[], onSelect: (index: number) => void) {
    this.onSelect = onSelect;
    const w = scene.scale.width;
    const h = scene.scale.height;
    const bw = 150;
    const bh = 70;
    const x = w - bw - 12;
    const y = h - bh - 12;

    const g = scene.add.graphics();
    g.fillStyle(0x1a1a2e, 0.97);
    g.fillRoundedRect(0, 0, bw, bh, 8);
    g.lineStyle(3, 0xf8f8f8, 1);
    g.strokeRoundedRect(0, 0, bw, bh, 8);

    this.container = scene.add.container(x, y, [g]).setScrollFactor(0).setDepth(1001);
    labels.forEach((label, i) => {
      const t = scene.add.text(28, 12 + i * 22, label, {
        fontFamily: "monospace",
        fontSize: "15px",
        color: "#f8f8f8",
      });
      this.items.push(t);
      this.container.add(t);
    });

    this.keys = scene.input.keyboard!.createCursorKeys();
    this.enterKey = scene.input.keyboard!.addKey("ENTER");
    this.spaceKey = scene.input.keyboard!.addKey("SPACE");
    this.container.setVisible(false);
  }

  show(): void {
    this.container.setVisible(true);
    this.enabled = true;
    this.redraw();
  }

  hide(): void {
    this.container.setVisible(false);
    this.enabled = false;
  }

  private redraw(): void {
    this.items.forEach((t, i) => t.setText((i === this.cursor ? "▶ " : "  ") + t.text.replace(/^[▶ ] /, "")));
  }

  update(): void {
    if (!this.enabled) return;
    if (Phaser.Input.Keyboard.JustDown(this.keys.up!)) {
      this.cursor = (this.cursor - 1 + this.items.length) % this.items.length;
      this.redraw();
    } else if (Phaser.Input.Keyboard.JustDown(this.keys.down!)) {
      this.cursor = (this.cursor + 1) % this.items.length;
      this.redraw();
    } else if (Phaser.Input.Keyboard.JustDown(this.enterKey) || Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.onSelect(this.cursor);
    }
  }
}
