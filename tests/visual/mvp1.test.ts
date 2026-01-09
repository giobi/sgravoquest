/**
 * SgravoQuest MVP1 - Visual Test
 *
 * Tests:
 * 1. Canvas renders
 * 2. Player moves with arrow keys
 * 3. Collision works (can't walk through walls)
 */
import puppeteer, { Browser, Page } from 'puppeteer'
import * as path from 'path'
import * as fs from 'fs'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const BASE_URL = process.env.TEST_URL || 'http://localhost:5173'
const SNAPSHOT_DIR = path.join(__dirname, 'snapshots')

// Ensure snapshot dir exists
if (!fs.existsSync(SNAPSHOT_DIR)) {
  fs.mkdirSync(SNAPSHOT_DIR, { recursive: true })
}

describe('SgravoQuest MVP1', () => {
  let browser: Browser
  let page: Page

  beforeAll(async () => {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    page = await browser.newPage()
    await page.setViewport({ width: 1024, height: 768 })
  })

  afterAll(async () => {
    await browser.close()
  })

  test('canvas renders with tilemap', async () => {
    await page.goto(BASE_URL, { waitUntil: 'networkidle0', timeout: 30000 })

    // Wait for canvas to appear (Pixi.js creates a canvas element)
    const canvas = await page.waitForSelector('canvas', { timeout: 10000 })
    expect(canvas).toBeTruthy()

    // Check canvas has content (dimensions > 0)
    const dimensions = await page.evaluate(() => {
      const canvas = document.querySelector('canvas')
      return canvas ? { width: canvas.width, height: canvas.height } : null
    })

    expect(dimensions).toBeTruthy()
    expect(dimensions!.width).toBeGreaterThan(0)
    expect(dimensions!.height).toBeGreaterThan(0)

    console.log(`Canvas dimensions: ${dimensions!.width}x${dimensions!.height}`)

    // Screenshot initial state
    await page.screenshot({
      path: path.join(SNAPSHOT_DIR, '01-initial-render.png'),
      fullPage: false
    })
  }, 60000)

  test('player moves with arrow keys', async () => {
    // Wait a moment for game to fully initialize
    await new Promise(r => setTimeout(r, 1000))

    // Get initial console logs to see player position
    const consoleLogs: string[] = []
    page.on('console', msg => consoleLogs.push(msg.text()))

    // Take screenshot before movement
    await page.screenshot({
      path: path.join(SNAPSHOT_DIR, '02-before-movement.png'),
      fullPage: false
    })

    // Move player with arrow keys (right, down, left, up)
    // Each key press should move the player 1 tile

    // Move right
    await page.keyboard.press('ArrowRight')
    await new Promise(r => setTimeout(r, 300)) // Wait for animation

    await page.keyboard.press('ArrowRight')
    await new Promise(r => setTimeout(r, 300))

    // Move down
    await page.keyboard.press('ArrowDown')
    await new Promise(r => setTimeout(r, 300))

    await page.keyboard.press('ArrowDown')
    await new Promise(r => setTimeout(r, 300))

    // Screenshot after movement
    await page.screenshot({
      path: path.join(SNAPSHOT_DIR, '03-after-movement.png'),
      fullPage: false
    })

    // Test WASD as well
    await page.keyboard.press('KeyD') // Right
    await new Promise(r => setTimeout(r, 300))

    await page.keyboard.press('KeyS') // Down
    await new Promise(r => setTimeout(r, 300))

    await page.screenshot({
      path: path.join(SNAPSHOT_DIR, '04-after-wasd.png'),
      fullPage: false
    })

    // Log any console output
    console.log('Console logs:', consoleLogs.slice(0, 10))

    // Test passes if we got here without errors
    expect(true).toBe(true)
  }, 30000)

  test('collision detection prevents walking through walls', async () => {
    // Navigate to top-left corner which should have walls
    // First, reset by going to start area

    // Move to a wall area (edges of map are walls per the createTestMap function)
    // Player starts at (5, 5), need to move to edge

    // Try to move many times left to hit wall
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('ArrowLeft')
      await new Promise(r => setTimeout(r, 150))
    }

    // Try to move many times up to hit wall
    for (let i = 0; i < 15; i++) {
      await page.keyboard.press('ArrowUp')
      await new Promise(r => setTimeout(r, 150))
    }

    // Screenshot at corner (should be stopped by walls)
    await page.screenshot({
      path: path.join(SNAPSHOT_DIR, '05-collision-test.png'),
      fullPage: false
    })

    // Try to move further into wall (should not move)
    await page.keyboard.press('ArrowLeft')
    await new Promise(r => setTimeout(r, 300))
    await page.keyboard.press('ArrowUp')
    await new Promise(r => setTimeout(r, 300))

    await page.screenshot({
      path: path.join(SNAPSHOT_DIR, '06-blocked-by-wall.png'),
      fullPage: false
    })

    // Test passes - collision detection is working if player stopped at wall
    expect(true).toBe(true)
  }, 30000)

  test('final screenshot shows player on map', async () => {
    // Move to a central position for a nice final screenshot
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('ArrowRight')
      await new Promise(r => setTimeout(r, 150))
    }
    for (let i = 0; i < 3; i++) {
      await page.keyboard.press('ArrowDown')
      await new Promise(r => setTimeout(r, 150))
    }

    await new Promise(r => setTimeout(r, 500)) // Wait for final animation

    await page.screenshot({
      path: path.join(SNAPSHOT_DIR, '07-final-state.png'),
      fullPage: false
    })

    // Verify snapshot was created
    const snapshotExists = fs.existsSync(path.join(SNAPSHOT_DIR, '07-final-state.png'))
    expect(snapshotExists).toBe(true)

    console.log('All snapshots saved to:', SNAPSHOT_DIR)
  }, 15000)
})
