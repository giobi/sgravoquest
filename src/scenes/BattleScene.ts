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

  constructor() {
    super("battle");
  }

  create(): void {
    const W = this.scale.width;
    const H = this.scale.height;

    // sfondo
    const g = this.add.graphics();
    g.fillGradientStyle(0x8ecae6, 0x8ecae6, 0xcdeefc, 0xcdeefc, 1);
    g.fillRect(0, 0, W, H - 90);
    g.fillStyle(0x9bcd6b, 1).fillRect(0, H - 140, W, 60);
    // piattaforme
    g.fillStyle(0x7bb05a, 1);
    g.fillEllipse(W - 130, 150, 200, 50);
    g.fillEllipse(150, H - 150, 240, 60);

    // mostri
    this.enemySprite = this.add.image(W - 130, 120, "magikarp").setScale(1.7);
    this.playerSprite = this.add.image(150, H - 185, "charmander-back").setScale(2.0);

    // box HP nemico (in alto a sx)
    this.drawHPBox(20, 24, "MAGIKARP selvatico", 5, false);
    this.enemyBar = this.add.graphics();
    // box HP player (in basso a dx)
    this.drawHPBox(W - 250, H - 200, "CHARMANDER", 6, true);
    this.playerBar = this.add.graphics();
    this.playerHpText = this.add.text(W - 60, H - 165, "", {
      fontFamily: "monospace", fontSize: "12px", color: "#1a1a2e",
    }).setOrigin(1, 0);

    this.refreshBars();

    this.dialog = new DialogBox(this);
    this.menu = new ChoiceMenu(this, ["LOTTA", "FUGGI"], (i) => this.onChoice(i));

    this.dialog.show("Un MAGIKARP selvatico è apparso!");
    this.tweens.add({ targets: this.enemySprite, y: "-=8", duration: 500, yoyo: true, repeat: -1 });
    this.time.delayedCall(1600, () => this.dialog.show("Cosa deve fare CHARMANDER?"));
    this.time.delayedCall(1700, () => this.menu.show());
  }

  private drawHPBox(x: number, y: number, name: string, lvl: number, player: boolean): void {
    const w = 230, h = player ? 56 : 46;
    const g = this.add.graphics();
    g.fillStyle(0xf8f8e8, 0.97).fillRoundedRect(x, y, w, h, 6);
    g.lineStyle(2, 0x2a2a3a, 1).strokeRoundedRect(x, y, w, h, 6);
    this.add.text(x + 10, y + 6, name, { fontFamily: "monospace", fontSize: "13px", color: "#1a1a2e" });
    this.add.text(x + w - 38, y + 6, "Lv" + lvl, { fontFamily: "monospace", fontSize: "12px", color: "#1a1a2e" });
    this.add.text(x + 10, y + 24, "HP", { fontFamily: "monospace", fontSize: "11px", color: "#d08a00" });
  }

  private refreshBars(): void {
    const draw = (bar: Phaser.GameObjects.Graphics, x: number, y: number, hp: number, max: number) => {
      bar.clear();
      const bw = 150;
      bar.fillStyle(0x444444, 1).fillRoundedRect(x, y, bw, 8, 3);
      const ratio = Math.max(0, hp / max);
      const col = ratio > 0.5 ? 0x46d160 : ratio > 0.2 ? 0xf2c037 : 0xe5484d;
      bar.fillStyle(col, 1).fillRoundedRect(x, y, bw * ratio, 8, 3);
    };
    const W = this.scale.width;
    const H = this.scale.height;
    draw(this.enemyBar, 20 + 60, 24 + 24, this.enemyHP, this.enemyMax);
    draw(this.playerBar, W - 250 + 60, H - 200 + 24, this.playerHP, this.playerMax);
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
    this.tweens.add({ targets: this.playerSprite, x: "+=30", duration: 120, yoyo: true });
    this.time.delayedCall(500, () => {
      const dmg = 9 + Math.floor(Math.random() * 7);
      this.enemyHP -= dmg;
      this.tweens.add({ targets: this.enemySprite, alpha: 0.2, duration: 80, yoyo: true, repeat: 2 });
      this.refreshBars();
      if (this.enemyHP <= 0) {
        this.dialog.show("MAGIKARP selvatico è esausto!");
        this.tweens.add({ targets: this.enemySprite, y: "+=40", alpha: 0, duration: 600 });
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
    this.tweens.add({ targets: this.enemySprite, x: "-=20", duration: 100, yoyo: true });
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
