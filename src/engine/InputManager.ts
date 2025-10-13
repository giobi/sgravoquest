/**
 * InputManager
 *
 * Handles keyboard input for the game
 */
export class InputManager {
  private keys: Set<string> = new Set()
  private keyDownHandler: (e: KeyboardEvent) => void
  private keyUpHandler: (e: KeyboardEvent) => void

  constructor() {
    this.keyDownHandler = (e: KeyboardEvent) => {
      this.keys.add(e.key.toLowerCase())
    }

    this.keyUpHandler = (e: KeyboardEvent) => {
      this.keys.delete(e.key.toLowerCase())
    }

    window.addEventListener('keydown', this.keyDownHandler)
    window.addEventListener('keyup', this.keyUpHandler)
  }

  /**
   * Check if a key is currently pressed
   */
  isKeyPressed(key: string): boolean {
    return this.keys.has(key.toLowerCase())
  }

  /**
   * Get movement direction from arrow keys or WASD
   * Returns { dx, dy } with values -1, 0, or 1
   */
  getMovementDirection(): { dx: number; dy: number } {
    let dx = 0
    let dy = 0

    // Up
    if (this.isKeyPressed('arrowup') || this.isKeyPressed('w')) {
      dy = -1
    }
    // Down
    else if (this.isKeyPressed('arrowdown') || this.isKeyPressed('s')) {
      dy = 1
    }

    // Left
    if (this.isKeyPressed('arrowleft') || this.isKeyPressed('a')) {
      dx = -1
    }
    // Right
    else if (this.isKeyPressed('arrowright') || this.isKeyPressed('d')) {
      dx = 1
    }

    return { dx, dy }
  }

  /**
   * Clean up event listeners
   */
  destroy(): void {
    window.removeEventListener('keydown', this.keyDownHandler)
    window.removeEventListener('keyup', this.keyUpHandler)
    this.keys.clear()
  }
}
