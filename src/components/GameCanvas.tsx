import { useEffect, useRef } from 'react'
import { Application } from 'pixi.js'
import { TilemapRenderer } from '../engine/TilemapRenderer'
import { getTileset } from '../assets/asset-catalog'

interface GameCanvasProps {
  width: number
  height: number
}

function GameCanvas({ width, height }: GameCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const appRef = useRef<Application | null>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    // Inizializza Pixi.js Application
    const app = new Application()
    appRef.current = app

    const initGame = async () => {
      await app.init({
        width,
        height,
        backgroundColor: 0x000000,
        antialias: false
      })

      // Aggiungi canvas al DOM
      if (canvasRef.current) {
        canvasRef.current.appendChild(app.canvas)
      }

      // Carica tileset dalla CDN
      const tileset = getTileset('tiny-dungeon')
      if (!tileset) {
        console.error('Tileset not found!')
        return
      }

      // Crea renderer tilemap
      const tilemapRenderer = new TilemapRenderer(app, tileset)
      await tilemapRenderer.load()

      // Crea una semplice mappa di test
      const testMap = createTestMap()
      tilemapRenderer.render(testMap)

      console.log('✅ Game initialized!')
      console.log('📦 Assets loaded from:', tileset.url)
    }

    initGame()

    // Cleanup
    return () => {
      if (appRef.current) {
        appRef.current.destroy(true, { children: true })
      }
    }
  }, [width, height])

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
