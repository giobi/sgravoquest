/**
 * SgravoQuest Asset Catalog
 *
 * Centralized catalog of all game assets served via jsDelivr CDN
 * from github.com/giobi/sgravoquest-assets
 *
 * All assets are CC0 (Public Domain) from Kenney.nl
 */

const CDN_BASE = 'https://cdn.jsdelivr.net/gh/giobi/sgravoquest-assets@main'

export interface TilesetAsset {
  id: string
  name: string
  url: string
  tileSize: number
  gridWidth: number
  gridHeight: number
  license: string
}

export interface SpriteAsset {
  id: string
  name: string
  url: string
  frameWidth: number
  frameHeight: number
  license: string
}

export const TILESETS: TilesetAsset[] = [
  {
    id: 'tiny-dungeon',
    name: 'Tiny Dungeon',
    url: `${CDN_BASE}/tilesets/tiny-dungeon.png`,
    tileSize: 16,
    gridWidth: 12,
    gridHeight: 11,
    license: 'CC0'
  },
  {
    id: 'tiny-dungeon-sample',
    name: 'Tiny Dungeon Sample Map',
    url: `${CDN_BASE}/tilesets/tiny-dungeon-sample.png`,
    tileSize: 16,
    gridWidth: 50,
    gridHeight: 50,
    license: 'CC0'
  }
]

export const SPRITES: SpriteAsset[] = [
  {
    id: 'hero',
    name: 'Hero Character',
    url: `${CDN_BASE}/sprites/hero.png`,
    frameWidth: 16,
    frameHeight: 16,
    license: 'CC0'
  },
  {
    id: 'npc',
    name: 'NPC Character',
    url: `${CDN_BASE}/sprites/npc.png`,
    frameWidth: 16,
    frameHeight: 16,
    license: 'CC0'
  },
  {
    id: 'monster',
    name: 'Monster Enemy',
    url: `${CDN_BASE}/sprites/monster.png`,
    frameWidth: 16,
    frameHeight: 16,
    license: 'CC0'
  },
  {
    id: 'chest',
    name: 'Treasure Chest',
    url: `${CDN_BASE}/sprites/chest.png`,
    frameWidth: 16,
    frameHeight: 16,
    license: 'CC0'
  }
]

/**
 * Get tileset by ID
 */
export function getTileset(id: string): TilesetAsset | undefined {
  return TILESETS.find(t => t.id === id)
}

/**
 * Get sprite by ID
 */
export function getSprite(id: string): SpriteAsset | undefined {
  return SPRITES.find(s => s.id === id)
}

/**
 * Preload all assets
 * Returns array of URLs to preload
 */
export function getAllAssetUrls(): string[] {
  return [
    ...TILESETS.map(t => t.url),
    ...SPRITES.map(s => s.url)
  ]
}
