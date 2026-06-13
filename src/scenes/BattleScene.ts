import Phaser from "phaser";
import { DialogBox, ChoiceMenu } from "../ui";

export class BattleScene extends Phaser.Scene {
  private dialog!: DialogBox;
  private menu!: ChoiceMenu;
  private enemyHP = 30;
  private enemyMax = 30;
  private playerHP = 39;
  private playerMax = 39;
  private enemyBar!: Phaser.GameObjects.Graphics;
  private playerBar!: Phaser.GameObjects.Graphics;
  private playerHpText!: Phaser.GameObjects.Text;
  private enemySprite!: Phaser.GameObjects.Image;
  private playerSprite!: Phaser.GameObjects.Image;
  private busy = false;
  private over = false;

  // geometria box HP (coordinate base) — condivisa fra draw e refresh
  private readonly EB = { x: 8, y: 10, w: 150, h: 30 };
  private PB = { x: 0, y: 0, w: 150, h: 36 };

  constructor() {
    super("battle");
  }

  create(): void {
    const W = this.scale.width;
    const H = this.scale.height;
    this.PB = { x: W - 158, y: H - 96, w: 150, h: 36 };

    // sfondo
    const g = this.add.graphics();
    g.fillGradientStyle(0x8ecae6, 0x8ecae6, 0xcdeefc, 0xcdeefc, 1);
    g.fillRect(0, 0, W, H - 46);
    g.fillStyle(0x9bcd6b, 1).fillRect(0, H - 70, W, 24);
    // piattaforme
    g.fillStyle(0x7bb05a, 1);
    g.fillEllipse(W - 92, 92, 110, 26);
    g.fillEllipse(96, H - 88, 130, 30);

    // mostri pixel (sprite gen) — coerenti col resto del pixel
    this.enemySprite = this.add.image(W - 92, 74, "magikarp").setScale(0.62);
    this.playerSprite = this.add.image(96, H - 100, "charmander-back").setScale(0.78);

    this.drawHPBox(this.EB.x, this.EB.y, this.EB.w, this.EB.h, "MAGIKARP selv.", 5);
    this.enemyBar = this.add.graphics();
    this.drawHPBox(this.PB.x, this.PB.y, this.PB.w, this.PB.h, "CHARMANDER", 6);
    this.playerBar = this.add.graphics();
    this.playerHpText = this.add.text(this.PB.x + this.PB.w - 6, this.PB.y + this.PB.h - 12, "", {
      fontFamily: "monospace", fontSize: "9px", color: "#1a1a2e",
    }).setOrigin(1, 0);

    this.refreshBars();

    this.dialog = new DialogBox(this);
    this.menu = new ChoiceMenu(this, ["LOTTA", "FUGGI"], (i) => this.onChoice(i));

    this.dialog.show("Un MAGIKARP selvatico è apparso!");
    this.tweens.add({ targets: this.enemySprite, y: "-=4", duration: 500, yoyo: true, repeat: -1 });
    this.time.delayedCall(1600, () => this.dialog.show("Cosa deve fare CHARMANDER?"));
    this.time.delayedCall(1700, () => this.menu.show());
  }

  private drawHPBox(x: number, y: number, w: number, h: number, name: string, lvl: number): void {
    const g = this.add.graphics();
    g.fillStyle(0xf8f8e8, 0.97).fillRoundedRect(x, y, w, h, 4);
    g.lineStyle(1.5, 0x2a2a3a, 1).strokeRoundedRect(x, y, w, h, 4);
    this.add.text(x + 6, y + 4, name, { fontFamily: "monospace", fontSize: "9px", color: "#1a1a2e" });
    this.add.text(x + w - 26, y + 4, "Lv" + lvl, { fontFamily: "monospace", fontSize: "9px", color: "#1a1a2e" });
    this.add.text(x + 6, y + 16, "HP", { fontFamily: "monospace", fontSize: "8px", color: "#d08a00" });
  }

  private refreshBars(): void {
    const draw = (bar: Phaser.GameObjects.Graphics, x: number, y: number, w: number, hp: number, max: number) => {
      bar.clear();
      bar.fillStyle(0x444444, 1).fillRoundedRect(x, y, w, 6, 2);
      const ratio = Math.max(0, hp / max);
      const col = ratio > 0.5 ? 0x46d160 : ratio > 0.2 ? 0xf2c037 : 0xe5484d;
      bar.fillStyle(col, 1).fillRoundedRect(x, y, w * ratio, 6, 2);
    };
    draw(this.enemyBar, this.EB.x + 26, this.EB.y + 16, this.EB.w - 34, this.enemyHP, this.enemyMax);
    draw(this.playerBar, this.PB.x + 26, this.PB.y + 16, this.PB.w - 34, this.playerHP, this.playerMax);
    this.playerHpText.setText(`${Math.max(0, this.playerHP)}/${this.playerMax}`);
  }

  private onChoice(i: number): void {
    if (this.busy || this.over) return;
    this.menu.hide();
    if (i === 1) {
      this.busy = true;
      this.dialog.show("Sei fuggito senza problemi!");
      this.time.delayedCall(1400, () => this.endBattle());
      return;
    }
    this.playerAttack();
  }

  private playerAttack(): void {
    this.busy = true;
    this.dialog.show("CHARMANDER usa GRAFFIO!");
    this.tweens.add({ targets: this.playerSprite, x: "+=14", duration: 120, yoyo: true });
    this.time.delayedCall(500, () => {
      const dmg = 9 + Math.floor(Math.random() * 7);
      this.enemyHP -= dmg;
      this.tweens.add({ targets: this.enemySprite, alpha: 0.2, duration: 80, yoyo: true, repeat: 2 });
      this.refreshBars();
      if (this.enemyHP <= 0) {
        this.dialog.show("MAGIKARP selvatico è esausto!");
        this.tweens.add({ targets: this.enemySprite, y: "+=24", alpha: 0, duration: 600 });
        this.time.delayedCall(1500, () => {
          this.dialog.show("Hai vinto! (e non hai imparato niente di utile)");
          this.time.delayedCall(1800, () => this.endBattle());
        });
      } else {
        this.time.delayedCall(900, () => this.enemyTurn());
      }
    });
  }

  private enemyTurn(): void {
    this.dialog.show("MAGIKARP usa SPLASH!");
    this.tweens.add({ targets: this.enemySprite, x: "-=10", duration: 100, yoyo: true });
    this.time.delayedCall(1100, () => {
      this.dialog.show("Ma non succede nulla!");
      this.time.delayedCall(1300, () => {
        this.busy = false;
        this.dialog.show("Cosa deve fare CHARMANDER?");
        this.menu.show();
      });
    });
  }

  private endBattle(): void {
    if (this.over) return;
    this.over = true;
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.cameras.main.once("camerafadeoutcomplete", () => this.scene.start("lakefront"));
  }

  update(): void {
    this.menu.update();
  }
}
