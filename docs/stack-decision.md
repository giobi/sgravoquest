# 🔍 Decisione Stack: Laravel + Filament vs Node.js

## Proposta: Laravel + Filament

### Stack Proposto
- **Backend**: Laravel 11
- **Admin Panel**: Filament 3
- **Database**: PostgreSQL (come da specs)
- **Frontend Game Engine**: Pixi.js (standalone)
- **Frontend Editor**: Filament + Alpine.js + Livewire
- **Auth**: Laravel Breeze/Sanctum

## Pro Laravel + Filament

### 1. Rapid Development
✅ **Filament Admin Panel**:
- Editor mappe/eventi/dialoghi pronto out-of-the-box
- Form builder potentissimo per creare oggetti/NPC/eventi
- Table builder per gestire liste avventure
- Relationship management automatico
- File uploads integrato perfetto per asset manager

✅ **Laravel Ecosystem**:
- ORM Eloquent maturo e veloce
- Queue system per export HTML5 pesanti
- Storage S3-compatible built-in
- Validation robusta
- API Resources per REST endpoints

### 2. Team Familiarity
- Già usato per Circus project con successo
- Conoscenza Filament components
- Setup veloce, zero learning curve
- Pattern già collaudati

### 3. Produttività
- Migrazione da specs a codice molto rapida
- Filament genera automaticamente CRUD
- Policies per autorizzazioni
- Seeders per dati di test

### 4. Admin/Creator Experience
- UI professionale zero-code con Filament
- Dark mode built-in
- Mobile responsive
- Notifications system
- Real-time updates con Livewire

## Contro Laravel + Filament

❌ **WebSocket**:
- Non nativo come Node.js
- Serve Laravel WebSockets o Soketi (aggiunta complessità)
- Per real-time editor collaboration

❌ **JavaScript Full-Stack**:
- Non single-language come Node.js
- Ma non è un vero problema per questo progetto

❌ **Performance Perception**:
- PHP visto come "più lento"
- Ma per questo use case è irrilevante (I/O bound, non CPU bound)

## Confronto con Node.js + Express

| Aspetto | Laravel + Filament | Node.js + Express | Vincitore |
|---------|-------------------|-------------------|-----------|
| **Admin Panel** | Filament (ready) | Da costruire da zero | 🏆 Laravel |
| **Form Builder** | Filament integrato | React Hook Form custom | 🏆 Laravel |
| **File Upload** | Built-in + S3 | Multer + custom | 🏆 Laravel |
| **ORM** | Eloquent | Prisma/TypeORM | ⚖️ Pari |
| **API** | Laravel Resources | Express routes | ⚖️ Pari |
| **WebSocket** | Soketi (extra) | Native socket.io | 🏆 Node |
| **Real-time** | Livewire (good) | Native (better) | 🏆 Node |
| **Dev Speed** | 🚀🚀🚀 Velocissimo | 🚀 Medio | 🏆 Laravel |
| **Ecosystem** | Laravel packages | npm packages | ⚖️ Pari |

## Hybrid Approach: Best of Both Worlds

### Proposta Finale

```
┌─────────────────────────────────────────┐
│         Laravel + Filament              │
│  (Admin, API, Auth, Database)           │
│                                         │
│  - Creator Editor (Filament)            │
│  - REST API                             │
│  - Asset Management                     │
│  - User Auth                            │
└─────────────┬───────────────────────────┘
              │ API REST
              │
┌─────────────▼───────────────────────────┐
│    Standalone Frontend (Player)         │
│    React + Pixi.js                      │
│                                         │
│  - Game Engine                          │
│  - Rendering                            │
│  - Deployed su CDN                      │
└─────────────────────────────────────────┘
```

### Vantaggi
1. **Laravel backend**: Admin velocissimo da costruire
2. **React frontend**: Player experience ottimale, deploy CDN
3. **Separazione**: Game engine non legato al backend
4. **Export HTML5**: Frontend già standalone per natura

## Decisione Finale

### ✅ Raccomandazione: Laravel + Filament

**Motivazioni**:
1. **Time-to-market**: Filament taglia 60-70% tempo sviluppo editor
2. **Familiarity**: Zero learning curve, pattern già noti
3. **Robustezza**: Laravel per backend è battle-tested
4. **Real-time**: Non critico per MVP (nice-to-have per v2)
5. **Frontend disaccoppiato**: Pixi.js player può restare React standalone

**WebSocket per futuro**:
- Fase 1-3: Non necessario
- Fase 4 (Community): Aggiungere Soketi se serve collaborative editing

## Stack Finale Scelto

### Backend (Creator/Admin)
```
Laravel 11
├── Filament 3 (Admin Panel)
├── MySQL 8 / MariaDB (Database)
├── Laravel Sanctum (API Auth)
├── Laravel Storage (S3)
├── Laravel Queue (Jobs)
└── Spatie packages (Permissions, Media)
```

**Database: MySQL vs PostgreSQL**
- ✅ **MySQL/MariaDB**: Ecosystem Laravel più maturo, Filament testato, performance ottime
- ❌ **PostgreSQL**: JSONB migliore ma overhead per questo progetto
- **Decisione**: MySQL 8 (più simple, battle-tested con Laravel)

### Frontend (Player)
```
React 18 + TypeScript
├── Vite (Build)
├── Pixi.js 7 (Rendering)
├── Zustand (State)
├── React Query (API calls)
└── TailwindCSS (UI)
```

### Editor UI
```
Filament 3
├── Form Builder (Create/Edit)
├── Table Builder (Lists)
├── Alpine.js (Interactions)
├── Livewire (Reactive)
└── TailwindCSS (Styling)
```

## Piano Implementazione

### Step 1: Laravel Setup
```bash
composer create-project laravel/laravel sgravoquest-backend
cd sgravoquest-backend
composer require filament/filament
php artisan filament:install --panels
```

### Step 2: Database Schema
```bash
php artisan make:migration create_projects_table
php artisan make:migration create_maps_table
php artisan make:migration create_events_table
# ... altri
```

### Step 3: Filament Resources
```bash
php artisan make:filament-resource Project
php artisan make:filament-resource Map
php artisan make:filament-resource Event
# ... altri
```

### Step 4: Frontend Player
```bash
npm create vite@latest sgravoquest-player -- --template react-ts
cd sgravoquest-player
npm install pixi.js zustand @tanstack/react-query
```

## Conclusione

**Laravel + Filament** è la scelta ottimale per questo progetto per:
- Velocità sviluppo
- Admin panel professionale ready-made
- Familiarity del team
- Robustezza backend

Il frontend player resta **React + Pixi.js** standalone, indipendente e performante.

---

**Decisione**: ✅ **Approvata**
**Data**: 2025-10-13
**Responsabile**: Team
