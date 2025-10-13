import { Application, Assets, Container, Rectangle, Sprite, Texture } from 'pixi.js'
import { TilesetAsset } from '../assets/asset-catalog'

/**
 * TilemapRenderer
 *
 * Renders a 2D tilemap using a tileset texture from CDN
 */
export class TilemapRenderer {
  private app: Application
  private tileset: TilesetAsset
  private container: Container
  private tileTextures: Texture[] = []

  constructor(app: Application, tileset: TilesetAsset) {
    this.app = app
    this.tileset = tileset
    this.container = new Container()
    this.app.stage.addChild(this.container)
  }

  /**
   * Load tileset from CDN and extract individual tile textures
   */
  async load(): Promise<void> {
    console.log('🔄 Loading tileset from CDN:', this.tileset.url)

    // Load texture from CDN via Pixi Assets
    const baseTexture = await Assets.load(this.tileset.url)

    // Extract individual tiles from tileset
    const { tileSize, gridWidth, gridHeight } = this.tileset
    const totalTiles = gridWidth * gridHeight

    for (let i = 0; i < totalTiles; i++) {
      const x = (i % gridWidth) * tileSize
      const y = Math.floor(i / gridWidth) * tileSize

      const tileTexture = new Texture({
        source: baseTexture.source,
        frame: new Rectangle(x, y, tileSize, tileSize)
      })

      this.tileTextures.push(tileTexture)
    }

    console.log(`✅ Tileset loaded: ${this.tileTextures.length} tiles extracted`)
  }

  /**
   * Render a tilemap
   * @param map 2D array of tile indices
   */
  render(map: number[][]): void {
    // Clear existing tiles
    this.container.removeChildren()

    const mapHeight = map.length
    const mapWidth = map[0]?.length || 0

    // Render each tile
    for (let y = 0; y < mapHeight; y++) {
      for (let x = 0; x < mapWidth; x++) {
        const tileIndex = map[y][x]

        // Skip empty tiles (index 0 or negative)
        if (tileIndex <= 0) continue

        // Get tile texture
        const texture = this.tileTextures[tileIndex]
        if (!texture) {
          console.warn(`Tile index ${tileIndex} not found in tileset`)
          continue
        }

        // Create sprite
        const sprite = new Sprite(texture)
        sprite.x = x * this.tileset.tileSize
        sprite.y = y * this.tileset.tileSize

        this.container.addChild(sprite)
      }
    }

    console.log(`🗺️  Tilemap rendered: ${mapWidth}x${mapHeight} tiles`)
  }

  /**
   * Clear the tilemap
   */
  clear(): void {
    this.container.removeChildren()
  }

  /**
   * Destroy and cleanup
   */
  destroy(): void {
    this.container.destroy({ children: true })
    this.tileTextures = []
  }
}
