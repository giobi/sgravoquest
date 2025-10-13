# 📋 Piano di Sviluppo SgravoQuest

## Stack Tecnologico Finale

### Backend
- Laravel 11 + Filament 3
- MySQL 8 / MariaDB
- Laravel Sanctum (Auth API)
- Laravel Storage (S3-compatible)
- Laravel Queue (Job processing)

### Frontend
- React 18 + TypeScript + Vite
- Pixi.js 7 (Game Engine)
- Zustand (State Management)
- React Query (API calls)
- TailwindCSS

---

## 🎯 Fase 0: Setup e Fondamenta (1-2 settimane)

### Sprint 0.1: Setup Backend Laravel

**Obiettivi**:
- [ ] Installare Laravel 11
- [ ] Configurare PostgreSQL
- [ ] Installare Filament 3
- [ ] Setup autenticazione
- [ ] Configurare S3/MinIO per storage

**Tasks**:
```bash
# 1. Crea progetto Laravel
composer create-project laravel/laravel sgravoquest-backend
cd sgravoquest-backend

# 2. Installa Filament
composer require filament/filament:"^3.0"
php artisan filament:install --panels

# 3. Configura database
# Modifica .env per MySQL
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_DATABASE=sgravoquest
php artisan migrate

# 4. Crea admin user
php artisan make:filament-user

# 5. Storage S3
composer require league/flysystem-aws-s3-v3
```

**Deliverables**:
- Laravel funzionante con Filament admin
- Database PostgreSQL connesso
- Storage S3 configurato
- Login admin funzionante

---

### Sprint 0.2: Setup Frontend React

**Obiettivi**:
- [ ] Creare progetto React + Vite
- [ ] Configurare TypeScript
- [ ] Installare Pixi.js
- [ ] Setup Zustand e React Query
- [ ] Configurare TailwindCSS

**Tasks**:
```bash
# 1. Crea progetto Vite
npm create vite@latest sgravoquest-player -- --template react-ts
cd sgravoquest-player

# 2. Installa dipendenze
npm install pixi.js@7
npm install zustand @tanstack/react-query
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# 3. Setup Pixi.js canvas base
# Crea components/PixiCanvas.tsx

# 4. Test rendering
npm run dev
```

**Deliverables**:
- React app funzionante
- Canvas Pixi.js visibile
- Hot reload attivo
- TypeScript configurato

---

## 🚀 Fase 1: MVP Core (4-6 settimane)

### Sprint 1.1: Database Schema e Models

**Obiettivi**:
- [ ] Creare schema database completo
- [ ] Models Eloquent per tutte le entità
- [ ] Relationships tra models
- [ ] Seeders per dati di test

**Entità Principali**:
```php
// Models da creare
User
Project (avventura)
Map
Tileset
Tile
Event
EventCommand
Dialog
DialogChoice
NPC
Item
Enemy
```

**Tasks**:
```bash
# Migrations
php artisan make:migration create_projects_table
php artisan make:migration create_maps_table
php artisan make:migration create_tilesets_table
php artisan make:migration create_events_table
php artisan make:migration create_dialogs_table
php artisan make:migration create_npcs_table
php artisan make:migration create_items_table

# Models
php artisan make:model Project
php artisan make:model Map
# ... etc

# Seeders
php artisan make:seeder TilesetSeeder
php artisan make:seeder ItemSeeder
```

**Deliverables**:
- Database schema completo
- Models con relationships
- Factory per testing
- Seeders con dati demo

---

### Sprint 1.2: Filament Resources (Editor Base)

**Obiettivi**:
- [ ] Filament Resource per Projects
- [ ] Filament Resource per Maps
- [ ] Filament Resource per Items
- [ ] Filament Resource per NPCs
- [ ] Form builders configurati

**Tasks**:
```bash
php artisan make:filament-resource Project --generate
php artisan make:filament-resource Map --generate
php artisan make:filament-resource Item --generate
php artisan make:filament-resource NPC --generate
php artisan make:filament-resource Dialog --generate
```

**Configurazione Forms**:
```php
// ProjectResource.php
public static function form(Form $form): Form
{
    return $form->schema([
        Forms\Components\TextInput::make('title')->required(),
        Forms\Components\Textarea::make('description'),
        Forms\Components\Toggle::make('is_published'),
        Forms\Components\FileUpload::make('thumbnail')
            ->image()
            ->directory('projects/thumbnails'),
    ]);
}
```

**Deliverables**:
- CRUD completo per entità base
- Form builder funzionanti
- Table views con filtri
- Validazione input

---

### Sprint 1.3: Asset Manager

**Obiettivi**:
- [ ] Upload tileset
- [ ] Upload sprite
- [ ] Upload audio (BGM, SFX)
- [ ] Preview asset
- [ ] Organizzazione per tag/cartelle

**Filament Components**:
```php
// AssetResource.php
Forms\Components\FileUpload::make('file')
    ->acceptedFileTypes(['image/png', 'image/jpeg', 'audio/mpeg'])
    ->maxSize(10240) // 10MB
    ->directory('assets')
    ->image()
    ->imagePreviewHeight('250'),

Forms\Components\TagsInput::make('tags'),
```

**Tasks**:
- Creare migration `assets` table
- Model Asset con Storage
- Filament Resource Asset
- Preview immagini nel form
- Gestione S3 upload

**Deliverables**:
- Asset manager funzionante
- Upload file su S3
- Preview immagini
- Tagging system

---

### Sprint 1.4: Map Editor (Backend)

**Obiettivi**:
- [ ] Struttura dati Map multi-layer
- [ ] API per salvare map data
- [ ] Tileset selection
- [ ] Collision layer

**Database Structure**:
```php
// maps table
id, project_id, name, width, height, data (JSONB)

// data JSON structure:
{
  "layers": [
    {
      "name": "Background",
      "type": "background",
      "tiles": [[tileIndex, ...], ...]
    },
    {
      "name": "Collision",
      "type": "collision",
      "tiles": [[0|1, ...], ...]
    }
  ],
  "tilesetId": "uuid",
  "properties": {}
}
```

**Tasks**:
- Migration maps con JSONB
- Model Map con accessors
- Filament form con JSON editor
- Validation layers

**Deliverables**:
- Salvataggio mappe multi-layer
- CRUD mappe nel admin
- JSON data strutturato
- Validazione tileset

---

### Sprint 1.5: Frontend - Rendering Engine Base

**Obiettivi**:
- [ ] Rendering tilemap da JSON
- [ ] Multi-layer support
- [ ] Camera/viewport
- [ ] Zoom in/out

**Components React**:
```typescript
// src/engine/TilemapRenderer.ts
export class TilemapRenderer {
  private app: PIXI.Application
  private container: PIXI.Container
  private tileset: PIXI.Texture

  loadMap(mapData: MapData): void
  renderLayer(layer: LayerData): void
  setZoom(zoom: number): void
}

// src/components/GameCanvas.tsx
export function GameCanvas({ mapId }: { mapId: string }) {
  const canvasRef = useRef<HTMLDivElement>(null)
  const { data: mapData } = useQuery(['map', mapId], fetchMap)

  useEffect(() => {
    if (!mapData) return
    const renderer = new TilemapRenderer(canvasRef.current)
    renderer.loadMap(mapData)
  }, [mapData])

  return <div ref={canvasRef} />
}
```

**Tasks**:
- Setup Pixi.js Application
- Tilemap rendering da JSON
- Camera sistema
- Layer rendering

**Deliverables**:
- Tilemap visibile su canvas
- Zoom funzionante
- Multi-layer rendering
- Performance 60fps

---

### Sprint 1.6: Movement System

**Obiettivi**:
- [ ] Sprite player
- [ ] Movimento WASD/Arrow
- [ ] Animazione walk
- [ ] Collision detection
- [ ] Grid snapping

**Implementation**:
```typescript
// src/engine/Player.ts
export class Player {
  private sprite: PIXI.AnimatedSprite
  private position: { x: number, y: number }
  private isMoving: boolean

  move(direction: 'up' | 'down' | 'left' | 'right'): void
  checkCollision(targetX: number, targetY: number): boolean
  update(delta: number): void
}

// src/hooks/useKeyboard.ts
export function useKeyboard() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowUp': player.move('up'); break
        // ...
      }
    }
    window.addEventListener('keydown', handleKeyDown)
  }, [])
}
```

**Tasks**:
- Player sprite class
- Input handling
- Collision logic
- Animation system

**Deliverables**:
- Player si muove con frecce
- Collisioni funzionanti
- Animazione smooth
- Grid-based movement

---

## 🎮 Fase 2: Editor Avanzato (4-6 settimane)

### Sprint 2.1: Visual Event Editor

**Obiettivi**:
- [ ] Block-based event editor
- [ ] Drag & drop comandi
- [ ] Conditional branches
- [ ] Preview eventi

**Filament Custom Field**:
```php
// EventEditorField.php
Forms\Components\Field::make('events')
    ->view('filament.forms.event-editor')
    ->dehydrateStateUsing(fn ($state) => json_encode($state))
```

**Alpine.js Component**:
```html
<!-- resources/views/filament/forms/event-editor.blade.php -->
<div x-data="eventEditor()">
  <div class="command-palette">
    <!-- Lista comandi draggable -->
  </div>
  <div class="event-canvas" x-ref="canvas">
    <!-- Drop zone per comandi -->
  </div>
</div>
```

**Tasks**:
- Custom Filament field
- Alpine.js event editor
- JSON serialization
- Command palette

**Deliverables**:
- Editor eventi visuale
- Drag & drop funzionante
- Salvataggio JSON
- Preview real-time

---

### Sprint 2.2: Dialog System

**Obiettivi**:
- [ ] Node-based dialog editor
- [ ] Branching scelte
- [ ] Conditional dialogs
- [ ] Test mode integrato

**Filament Approach**:
```php
// DialogResource.php
Forms\Components\Repeater::make('nodes')
    ->schema([
        Forms\Components\TextInput::make('speaker'),
        Forms\Components\Textarea::make('text'),
        Forms\Components\Repeater::make('choices')
            ->schema([
                Forms\Components\TextInput::make('text'),
                Forms\Components\Select::make('nextNodeId')
            ])
    ])
```

**Deliverables**:
- Dialog editor funzionante
- Branching choices
- Conditional logic
- Test dialog in-game

---

### Sprint 2.3: NPC Editor

**Obiettivi**:
- [ ] Posizionamento NPCs su mappa
- [ ] Movement patterns
- [ ] Event triggers
- [ ] Sprite assignment

**Tasks**:
- Filament Resource NPC
- Relationship con Map
- Movement type selection
- Event linking

**Deliverables**:
- CRUD NPCs
- Posizionamento su mappa
- Movement configurabile
- Eventi associati

---

### Sprint 2.4: Frontend - Event System

**Obiettivi**:
- [ ] Event executor
- [ ] Dialog renderer
- [ ] Choice system
- [ ] Trigger detection

**Implementation**:
```typescript
// src/engine/EventExecutor.ts
export class EventExecutor {
  execute(event: GameEvent): void
  executeCommand(command: EventCommand): Promise<void>
  checkConditions(conditions: Condition[]): boolean
}

// src/components/DialogBox.tsx
export function DialogBox({ dialog }: { dialog: Dialog }) {
  return (
    <div className="dialog-box">
      <div className="speaker">{dialog.speaker}</div>
      <div className="text">{dialog.text}</div>
      {dialog.choices && (
        <div className="choices">
          {dialog.choices.map(choice => (
            <button onClick={() => selectChoice(choice)}>
              {choice.text}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
```

**Deliverables**:
- Eventi eseguiti correttamente
- Dialog box UI
- Choice system
- Event triggers

---

## ⚔️ Fase 3: Sistema RPG (3-4 settimane)

### Sprint 3.1: Character Stats & Inventory

**Obiettivi**:
- [ ] Sistema statistiche
- [ ] Inventory UI
- [ ] Item effects
- [ ] Equipment system

**Backend**:
```php
// Character stats in save data JSON
{
  "stats": {
    "level": 1,
    "hp": 100,
    "maxHp": 100,
    "atk": 10,
    "def": 8
  },
  "inventory": [
    {"itemId": "uuid", "quantity": 3}
  ],
  "equipment": {
    "weapon": "itemId",
    "armor": "itemId"
  }
}
```

**Frontend**:
```typescript
// src/stores/playerStore.ts
export const usePlayerStore = create<PlayerState>((set) => ({
  stats: defaultStats,
  inventory: [],
  addItem: (itemId, quantity) => set(state => ({
    inventory: [...state.inventory, { itemId, quantity }]
  })),
  equipItem: (itemId, slot) => set(state => ({
    equipment: { ...state.equipment, [slot]: itemId }
  }))
}))
```

**Deliverables**:
- Stats system
- Inventory UI
- Item management
- Equipment slots

---

### Sprint 3.2: Combat System

**Obiettivi**:
- [ ] Turn-based combat
- [ ] Battle UI
- [ ] Damage calculation
- [ ] Victory/defeat

**Implementation**:
```typescript
// src/engine/CombatEngine.ts
export class CombatEngine {
  private actors: Combatant[]
  private turnOrder: string[]

  startBattle(enemies: Enemy[]): void
  calculateTurnOrder(): void
  executeTurn(action: BattleAction): void
  calculateDamage(attacker: Combatant, target: Combatant): number
  checkVictory(): 'win' | 'lose' | 'ongoing'
}
```

**Deliverables**:
- Combat engine funzionante
- Battle UI
- Turn system
- Win/lose conditions

---

## 🌐 Fase 4: Condivisione (2-3 settimane)

### Sprint 4.1: Publishing System

**Obiettivi**:
- [ ] Publish button
- [ ] Public URL generation
- [ ] Player embeddeble
- [ ] Analytics base

**Backend**:
```php
// ProjectResource.php - Actions
Actions\Action::make('publish')
    ->action(function (Project $record) {
        $record->is_published = true
        $record->published_at = now()
        $record->public_url = Str::uuid()
        $record->save()
    })
```

**Routes**:
```php
// routes/web.php
Route::get('/play/{uuid}', [PlayerController::class, 'show'])
    ->name('play');
```

**Deliverables**:
- Publishing flow
- Public URL
- Embed iframe
- Basic analytics

---

### Sprint 4.2: Export HTML5

**Obiettivi**:
- [ ] Bundle game data
- [ ] Generate standalone HTML
- [ ] Zip download
- [ ] Offline player

**Laravel Job**:
```php
// app/Jobs/ExportProjectJob.php
class ExportProjectJob implements ShouldQueue
{
    public function handle()
    {
        // 1. Bundle assets
        // 2. Generate index.html
        // 3. Create data.json
        // 4. Zip everything
        // 5. Upload to S3
        // 6. Notify user
    }
}
```

**Deliverables**:
- Export funzionante
- Standalone HTML5
- Zip download
- Works offline

---

## 📊 Timeline Riassuntiva

```
Fase 0: Setup           (1-2 settimane)  ████░░░░░░░░░░░░░░
Fase 1: MVP            (4-6 settimane)  ░░░░██████░░░░░░░░
Fase 2: Editor         (4-6 settimane)  ░░░░░░░░░░██████░░
Fase 3: RPG            (3-4 settimane)  ░░░░░░░░░░░░░░████
Fase 4: Sharing        (2-3 settimane)  ░░░░░░░░░░░░░░░░██

Totale: 14-21 settimane (3.5 - 5 mesi)
```

## 🎯 Priorità per Inizio Immediato

### Week 1-2: Setup
1. [x] Documentazione completa
2. [ ] Laravel + Filament setup
3. [ ] React + Pixi.js setup
4. [ ] Database schema
5. [ ] First commit entrambi i progetti

### Week 3-4: Primi Risultati Visibili
1. [ ] Tilemap rendering
2. [ ] Player movement
3. [ ] Map CRUD in admin
4. [ ] Asset upload

**Milestone 1 Month**: Avere un player che cammina su una mappa creata nell'admin.

---

*Piano soggetto a revisione durante lo sviluppo*
*Ultimo aggiornamento: 2025-10-13*
