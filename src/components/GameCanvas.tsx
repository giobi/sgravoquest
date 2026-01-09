import { useEffect, useRef } from 'react'
import { Application, Assets } from 'pixi.js'
import { TilemapRenderer } from '../engine/TilemapRenderer'
import { Player } from '../engine/Player'
import { InputManager } from '../engine/InputManager'
import { getTileset, getSprite } from '../assets/asset-catalog'
import type { Quest } from '../engine/AIQuestGenerator'

interface GameCanvasProps {
  width: number
  height: number
  quest?: Quest | null
}

function GameCanvas({ width, height, quest }: GameCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<Application | null>(null)
  const tilemapRendererRef = useRef<TilemapRenderer | null>(null)
  const playerRef = useRef<Player | null>(null)
  const currentMapRef = useRef<number[][]>(createTestMap())

  useEffect(() => {
    if (!canvasRef.current) return

    let cancelled = false
    let app: Application | null = null
    let inputManager: InputManager | null = null

    const initGame = async () => {
      // Inizializza Pixi.js Application
      app = new Application()

      try {
        await app.init({
          width,
          height,
          backgroundColor: 0x1a1a2e,
          antialias: false
        })
      } catch (error) {
        console.error('Failed to init Pixi.js:', error)
        return
      }

      // Check if component was unmounted during async init
      if (cancelled || !canvasRef.current) {
        app.destroy(true)
        return
      }

      appRef.current = app

      // Aggiungi canvas al DOM
      canvasRef.current.appendChild(app.canvas)

      // Carica tileset dalla CDN
      const tileset = getTileset('tiny-dungeon')
      if (!tileset) {
        console.error('Tileset not found!')
        return
      }

      // Crea renderer tilemap
      const tilemapRenderer = new TilemapRenderer(app, tileset)

      try {
        await tilemapRenderer.load()
      } catch (error) {
        console.error('Failed to load tileset:', error)
        return
      }

      if (cancelled) return

      tilemapRendererRef.current = tilemapRenderer

      // Crea una semplice mappa di test iniziale
      const testMap = createTestMap()
      currentMapRef.current = testMap
      tilemapRenderer.render(testMap)

      // Carica sprite hero dalla CDN
      const heroSprite = getSprite('hero')
      if (!heroSprite) {
        console.error('Hero sprite not found!')
        return
      }

      let heroTexture
      try {
        heroTexture = await Assets.load(heroSprite.url)
      } catch (error) {
        console.error('Failed to load hero sprite:', error)
        return
      }

      if (cancelled) return

      // Crea player
      const player = new Player({
        x: 5,
        y: 5,
        texture: heroTexture,
        speed: 4
      })
      playerRef.current = player

      // Add player to entity layer (not cleared when map re-renders)
      tilemapRenderer.entityLayer.addChild(player.container)

      // Setup input
      inputManager = new InputManager()

      // Game loop
      app.ticker.add(() => {
        if (cancelled) return
        // Update player position (smooth movement)
        player.update()

        // Handle input (only when not moving)
        const { dx, dy } = inputManager!.getMovementDirection()
        if (dx !== 0 || dy !== 0) {
          player.move(dx, dy, currentMapRef.current)
        }
      })

      console.log('✅ Game initialized!')
      console.log('📦 Assets loaded from:', tileset.url)
      console.log('🎮 Controls: Arrow Keys or WASD')
    }

    initGame()

    // Cleanup
    return () => {
      cancelled = true
      if (inputManager) {
        inputManager.destroy()
      }
      if (appRef.current) {
        try {
          appRef.current.destroy(true, { children: true })
        } catch (e) {
          // Ignore destroy errors during cleanup
        }
        appRef.current = null
      }
      tilemapRendererRef.current = null
      playerRef.current = null
    }
  }, [width, height])

  // Effect per caricare la quest quando cambia
  useEffect(() => {
    if (!quest || !tilemapRendererRef.current || !playerRef.current) return

    console.log('🗺️ Caricamento mappa dalla quest:', quest.title)

    // Prendi la prima mappa della quest
    const questMap = quest.maps[0]
    if (questMap && questMap.tiles) {
      // Carica la nuova mappa
      tilemapRendererRef.current.render(questMap.tiles)
      currentMapRef.current = questMap.tiles

      // Riposiziona il player alla posizione di spawn
      const startPos = questMap.startPosition || { x: 5, y: 5 }
      playerRef.current.setPosition(startPos.x, startPos.y)

      console.log('✅ Mappa caricata:', questMap.name, `${questMap.width}x${questMap.height}`)
      console.log('✅ Player posizionato a:', startPos)
    }
  }, [quest])

  return (
    <div
      ref={canvasRef}
      style={{
        border: '2px solid #333',
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    />
  )
}

// Crea una mappa di test 50x37 tiles (per riempire canvas 800x600 con tile 16x16)
function createTestMap(): number[][] {
  const mapWidth = 50
  const mapHeight = 37
  const map: number[][] = []

  for (let y = 0; y < mapHeight; y++) {
    const row: number[] = []
    for (let x = 0; x < mapWidth; x++) {
      // Pattern semplice: alterna floor e wall
      if (x === 0 || y === 0 || x === mapWidth - 1 || y === mapHeight - 1) {
        row.push(14) // Wall tile (tile index 14 dal tileset)
      } else if ((x + y) % 5 === 0) {
        row.push(25) // Decorazione
      } else {
        row.push(1) // Floor tile (tile index 1)
      }
    }
    map.push(row)
  }

  return map
}

export default GameCanvas
