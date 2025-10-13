# 🔧 Specifiche Tecniche e Funzionali - SgravoQuest

## Panoramica

SgravoQuest è un framework RPG 2D web-based progettato per fungere da base per un **Creatore di Avventure** in-browser (no-code/low-code). Il sistema permette agli utenti di creare, giocare e condividere avventure RPG 2D senza scrivere codice.

## 1. Architettura e Requisiti Tecnici

### 1.1 Stack Tecnologico

| Componente | Tecnologia Scelta | Motivazione |
|------------|-------------------|-------------|
| **Frontend UI** | React 18+ con TypeScript | Ecosistema maturo, performance, type safety |
| **Motore Grafico** | Pixi.js 7+ (WebGL) | Rendering 2D performante, API ricca, community attiva |
| **Build Tool** | Vite | Hot reload veloce, ottimizzazione bundle |
| **Backend** | Node.js + Express | JavaScript full-stack, npm ecosystem |
| **Database** | PostgreSQL | Relazioni complesse (mappe, eventi, oggetti), ACID |
| **ORM** | Prisma | Type-safe, migrations, ottimo DX |
| **Storage** | S3-compatible (MinIO/S3) | Scalabile per asset utente |
| **Auth** | JWT + Passport.js | Standard, supporto OAuth |
| **API** | REST + WebSocket | REST per CRUD, WS per real-time editor |

### 1.2 Requisiti Non-Funzionali

- **Performance**: 60 FPS costanti su mappe 100x100 tiles
- **Load Time**: < 3s per caricare un'avventura media
- **Browser Support**: Chrome, Firefox, Safari, Edge (ultime 2 versioni)
- **Responsive**: Supporto desktop (priorità), tablet (secondario)
- **Accessibility**: WCAG 2.1 Level AA per interfacce UI
- **Scalability**: Supporto per 10k+ avventure create, 100k+ utenti registrati

## 2. Piattaforma di Gioco (Player Mode)

### 2.1 Rendering Engine

#### Tilemap System
```typescript
interface TilemapLayer {
  id: string
  name: string
  type: 'background' | 'decoration' | 'collision' | 'event'
  zIndex: number
  tiles: Tile[][]
  visible: boolean
  opacity: number
}

interface Tile {
  tilesetId: string
  tileIndex: number  // Indice nel tileset
  properties?: Record<string, any>
}
```

**Specifiche**:
- Supporto mappe fino a 200x200 tiles
- Multi-layer (min 4 layer: sfondo, decorazione, collisione, eventi)
- Tile size: 32x32px (default), configurabile 16/32/48px
- Formato tileset: PNG, supporto trasparenza
- Isometrico 2.5D (fase 2)

#### Sprite System
```typescript
interface Sprite {
  id: string
  textureId: string
  animations: Animation[]
  position: { x: number, y: number }
  scale: { x: number, y: number }
  rotation: number
}

interface Animation {
  name: 'idle' | 'walk' | 'run' | 'attack' | 'hurt' | 'death'
  frames: Frame[]
  frameRate: number
  loop: boolean
}
```

### 2.2 Movement System

- **Griglia**: Movimento basato su griglia tile-by-tile
- **Direzioni**: 4 direzioni (N, E, S, W) o 8 direzioni (+ diagonali)
- **Animazioni**: Smooth interpolation tra tiles (tweening)
- **Collisioni**: Layer dedicato + tile properties
- **Velocità**: Configurabile (slow/normal/fast walk, run mode)

### 2.3 Interaction System

```typescript
interface InteractionTrigger {
  type: 'action' | 'auto' | 'parallel' | 'touch'
  conditions: Condition[]
  events: GameEvent[]
}

// Action: Premendo tasto azione davanti all'evento
// Auto: Entrando nella tile dell'evento
// Parallel: Esecuzione continua in background
// Touch: Toccando l'evento (da qualsiasi lato)
```

### 2.4 Inventory System

```typescript
interface Inventory {
  items: InventorySlot[]
  maxSlots: number
  currency: number
}

interface InventorySlot {
  itemId: string
  quantity: number
  equipped?: boolean
}

interface Item {
  id: string
  name: string
  description: string
  type: 'consumable' | 'weapon' | 'armor' | 'key' | 'misc'
  icon: string
  effects: ItemEffect[]
  sellPrice: number
  buyPrice: number
}

interface ItemEffect {
  type: 'heal' | 'damage' | 'buff' | 'debuff' | 'learn_skill'
  value: number
  duration?: number  // Per buff/debuff
}
```

### 2.5 Save System

```typescript
interface SaveData {
  version: string
  timestamp: number
  playTime: number

  player: {
    position: { mapId: string, x: number, y: number }
    stats: CharacterStats
    inventory: Inventory
    equipment: Equipment
  }

  switches: Record<string, boolean>  // Global switches
  variables: Record<string, number>  // Global variables

  mapStates: Record<string, MapState>  // Stato di ogni mappa
}
```

**Salvataggio**:
- Locale: LocalStorage (auto-save ogni 5 min)
- Cloud: Backend API (manual save + load)
- Slot: 3 slot salvataggio per avventura

## 3. Sistema RPG

### 3.1 Character Stats

```typescript
interface CharacterStats {
  // Core stats
  level: number
  exp: number
  expToNext: number

  // Vitals
  hp: number
  maxHp: number
  mp: number
  maxMp: number

  // Combat stats
  atk: number  // Physical attack
  def: number  // Physical defense
  mat: number  // Magic attack
  mdf: number  // Magic defense
  agi: number  // Agility (turn order)
  luk: number  // Luck (critical, drop rate)
}
```

### 3.2 Combat System (Turn-Based)

```typescript
interface CombatEncounter {
  background: string
  enemies: Enemy[]
  canEscape: boolean
  battleMusic?: string

  rewards: {
    exp: number
    currency: number
    items: ItemDrop[]
  }
}

interface BattleAction {
  type: 'attack' | 'skill' | 'item' | 'defend' | 'escape'
  actorId: string
  targetId: string | string[]  // Single or multiple targets
  skillId?: string
  itemId?: string
}
```

**Turn Order**:
1. Calcolo ordine basato su AGI
2. Selezione azione per ogni attore
3. Esecuzione azioni in ordine
4. Calcolo danni/effetti
5. Check vittoria/sconfitta
6. Ripeti dal punto 1

**Formula Danno Base**:
```
Physical: damage = (atk * 2) - def
Magic: damage = (mat * 2) - mdf
Critical: damage * 2 (chance based on LUK)
```

### 3.3 Level Up System

```typescript
interface LevelUpConfig {
  expCurve: 'linear' | 'polynomial' | 'exponential'
  baseExp: number
  growthRate: number

  statGrowth: {
    hp: number
    mp: number
    atk: number
    def: number
    mat: number
    mdf: number
    agi: number
    luk: number
  }
}
```

## 4. Editor (Creator Mode)

### 4.1 Map Editor

**Funzionalità**:
- Drag & drop tiles da tileset
- Multi-layer editing
- Strumenti: Pencil, Fill, Rectangle, Eraser
- Copy/Paste regioni
- Undo/Redo (history stack)
- Minimap per navigazione

**UI Components**:
```
┌─────────────────────────────────────┐
│ Toolbar: [Pencil][Fill][Rect][...]  │
├──────────┬──────────────────────────┤
│          │                          │
│ Tileset  │    Canvas (Pixi.js)      │
│ Palette  │                          │
│          │                          │
├──────────┤                          │
│ Layers   │                          │
│ Panel    │                          │
└──────────┴──────────────────────────┘
```

### 4.2 Event System (Visual Logic)

```typescript
interface GameEvent {
  id: string
  trigger: EventTrigger
  conditions: EventCondition[]
  commands: EventCommand[]
}

interface EventCommand {
  type: EventCommandType
  params: Record<string, any>
}

enum EventCommandType {
  // Dialog
  SHOW_TEXT = 'show_text',
  SHOW_CHOICES = 'show_choices',

  // Flow control
  CONDITIONAL = 'conditional',
  LOOP = 'loop',
  BREAK_LOOP = 'break_loop',
  WAIT = 'wait',

  // Game state
  CONTROL_SWITCHES = 'control_switches',
  CONTROL_VARIABLES = 'control_variables',

  // Player
  TRANSFER_PLAYER = 'transfer_player',
  CHANGE_HP = 'change_hp',
  CHANGE_ITEM = 'change_item',

  // Graphics/Audio
  PLAY_BGM = 'play_bgm',
  PLAY_SE = 'play_se',
  SHOW_ANIMATION = 'show_animation',

  // Advanced
  SCRIPT_CALL = 'script_call'  // Per logica custom
}
```

**Visual Editor**:
- Block-based interface (stile Scratch/Blockly)
- Drag & drop di comandi
- Nesting condizionale visuale
- Preview real-time

### 4.3 Dialog System

```typescript
interface Dialog {
  id: string
  speaker?: string
  face?: string  // Sprite viso del personaggio
  text: LocalizedString
  choices?: DialogChoice[]
  nextDialogId?: string
}

interface DialogChoice {
  text: LocalizedString
  condition?: Condition
  nextDialogId: string
  effects?: EventCommand[]  // Effetti immediati della scelta
}
```

**Editor UI**:
- Node-based graph editor (stile Twine)
- Visual branching delle scelte
- Test mode integrato

### 4.4 Asset Manager

```typescript
interface Asset {
  id: string
  type: 'tileset' | 'sprite' | 'audio' | 'image'
  name: string
  filename: string
  url: string
  size: number
  uploadedAt: Date
  tags: string[]
}
```

**Funzionalità**:
- Upload drag & drop
- Preview immagini/audio
- Organizzazione per cartelle/tag
- Libreria asset predefiniti (open-source)
- Gestione licenze asset

### 4.5 NPC Editor

```typescript
interface NPC {
  id: string
  name: string
  sprite: string
  position: { mapId: string, x: number, y: number }
  movement: {
    type: 'fixed' | 'random' | 'approach' | 'custom'
    speed: number
    frequency: number
  }
  events: GameEvent[]
}
```

## 5. Backend API

### 5.1 Endpoints Principali

```typescript
// Auth
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

// Projects (Avventure)
GET    /api/projects
POST   /api/projects
GET    /api/projects/:id
PUT    /api/projects/:id
DELETE /api/projects/:id
POST   /api/projects/:id/publish
POST   /api/projects/:id/clone

// Assets
POST   /api/assets/upload
GET    /api/assets/:id
DELETE /api/assets/:id

// Save Data
GET    /api/saves/:projectId
POST   /api/saves/:projectId
PUT    /api/saves/:projectId/:slotId
DELETE /api/saves/:projectId/:slotId

// Community
GET    /api/projects/public
POST   /api/projects/:id/rate
GET    /api/projects/:id/comments
POST   /api/projects/:id/comments
```

### 5.2 Database Schema

```sql
-- Users
CREATE TABLE users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_published BOOLEAN DEFAULT FALSE,
  data JSONB NOT NULL,  -- Tutta la struttura del gioco
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Assets
CREATE TABLE assets (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  type VARCHAR(50) NOT NULL,
  filename VARCHAR(255) NOT NULL,
  url TEXT NOT NULL,
  size INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Saves
CREATE TABLE saves (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  project_id UUID REFERENCES projects(id),
  slot INTEGER CHECK (slot >= 1 AND slot <= 3),
  data JSONB NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, project_id, slot)
);
```

## 6. Condivisione e Export

### 6.1 Link Condivisione

```
https://sgravoquest.io/play/{projectId}
```

- Caricamento diretto da database
- Embed iframe per altri siti
- Statistiche giocatori (opzionale per creator)

### 6.2 Export HTML5 (Standalone)

**Contenuto**:
```
exported-game/
├── index.html
├── assets/
│   ├── sprites/
│   ├── tilesets/
│   ├── audio/
│   └── ...
├── engine.js  (bundle minificato)
└── data.json  (game data)
```

**Caratteristiche**:
- Self-contained (nessuna dipendenza esterna)
- Compresso in .zip
- Funziona offline
- Caricabile su itch.io, Newgrounds, etc.

## 7. Performance e Ottimizzazione

### 7.1 Rendering
- Canvas pooling per riutilizzo texture
- Culling off-screen entities
- Lazy loading asset non critici
- Sprite atlas per ridurre draw calls

### 7.2 Data Loading
- Chunking mappe grandi
- Progressive loading asset
- Service Worker per caching
- Compression (gzip) per data.json

### 7.3 Memory Management
- Disposal texture non usate
- Object pooling per entities frequenti
- Debounce/throttle event handlers

## 8. Sicurezza

- **Input Sanitization**: Tutti gli input utente sanitizzati
- **Rate Limiting**: API rate limits (100 req/min per utente)
- **Asset Validation**: Whitelist formati file, max size (10MB per asset)
- **XSS Prevention**: CSP headers, sanitizzazione HTML in dialoghi
- **SQL Injection**: Parametrized queries (Prisma ORM)

## 9. Testing

- **Unit Tests**: Jest per logica business (coverage > 80%)
- **Integration Tests**: Supertest per API endpoints
- **E2E Tests**: Playwright per workflow editor
- **Performance Tests**: Lighthouse CI (score > 90)

---

*Versione documento: 1.0*
*Ultimo aggiornamento: 2025-10-13*
