import { Container, Sprite, Texture } from 'pixi.js'

export interface PlayerOptions {
  x: number
  y: number
  texture: Texture
  speed?: number
}

export class Player {
  public container: Container
  private sprite: Sprite
  private speed: number
  private tileSize: number = 16

  // Position in tile coordinates
  public tileX: number
  public tileY: number

  // Target position for smooth movement
  private targetX: number
  private targetY: number
  private isMoving: boolean = false

  constructor(options: PlayerOptions) {
    this.container = new Container()
    this.sprite = new Sprite(options.texture)
    this.speed = options.speed || 2

    // Set initial position
    this.tileX = options.x
    this.tileY = options.y
    this.targetX = options.x * this.tileSize
    this.targetY = options.y * this.tileSize

    this.sprite.x = this.targetX
    this.sprite.y = this.targetY

    this.container.addChild(this.sprite)
  }

  /**
   * Try to move the player in a direction
   * Returns true if movement started, false if blocked
   */
  move(dx: number, dy: number, collisionMap: number[][]): boolean {
    if (this.isMoving) return false

    const newTileX = this.tileX + dx
    const newTileY = this.tileY + dy

    // Check bounds
    if (newTileY < 0 || newTileY >= collisionMap.length) return false
    if (newTileX < 0 || newTileX >= collisionMap[0].length) return false

    // Check collision (tile 14 = wall, tile 25 = decoration obstacle)
    const tile = collisionMap[newTileY][newTileX]
    if (tile === 14 || tile === 25) return false

    // Start movement
    this.tileX = newTileX
    this.tileY = newTileY
    this.targetX = this.tileX * this.tileSize
    this.targetY = this.tileY * this.tileSize
    this.isMoving = true

    return true
  }

  /**
   * Update player position (smooth interpolation)
   * Call this every frame
   */
  update(): void {
    if (!this.isMoving) return

    const dx = this.targetX - this.sprite.x
    const dy = this.targetY - this.sprite.y

    // Move towards target
    if (Math.abs(dx) > 0.5) {
      this.sprite.x += Math.sign(dx) * this.speed
    } else {
      this.sprite.x = this.targetX
    }

    if (Math.abs(dy) > 0.5) {
      this.sprite.y += Math.sign(dy) * this.speed
    } else {
      this.sprite.y = this.targetY
    }

    // Check if reached target
    if (this.sprite.x === this.targetX && this.sprite.y === this.targetY) {
      this.isMoving = false
    }
  }

  /**
   * Get current pixel position
   */
  getPosition(): { x: number; y: number } {
    return {
      x: this.sprite.x,
      y: this.sprite.y
    }
  }

  destroy(): void {
    this.container.destroy({ children: true })
  }
}
