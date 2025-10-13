# 2025-10-13 - Setup Iniziale Repository SgravoQuest

**Data**: 2025-10-13
**Ora**: 08:24 - 08:40 UTC
**Focus**: Setup progetto e documentazione iniziale

## Obiettivi Sessione

- [x] Creare repository locale
- [x] Creare README.md principale
- [x] Creare struttura documentazione `/docs`
- [x] Scrivere specifiche tecniche complete
- [x] Setup diary system
- [ ] Push su GitHub (pending)

## Attività Completate

### Task 1: Creazione Repository Locale
- Inizializzato git repository in `/home/claude/app/sgravoquest`
- Configurato git user per il progetto
- Branch principale: `main`
- Commit iniziale: `ee97cb9`

**File**:
- `.git/` - Repository git
- `README.md` - Readme iniziale

### Task 2: README Principale
Creato README completo con:
- Descrizione progetto e vision
- Caratteristiche principali (Player + Creator mode)
- Stack tecnologico scelto
- Roadmap a 4 fasi (MVP → Editor → RPG → Community)
- Sezioni contribuzione e licenza

**Highlights**:
- Emoji per rendere più visuale
- Roadmap con checkbox
- Link alla documentazione
- Ispirazione chiara (RPG Maker web-based)

### Task 3: Struttura Documentazione
Creata cartella `docs/` con:

**File creati**:
- `docs/README.md` - Indice documentazione
- `docs/technical-specs.md` - Specifiche tecniche complete (4000+ righe)
- `docs/diary/README.md` - Guida al sistema diary
- `docs/diary/2025-10-13-setup-iniziale.md` - Questo file

**Struttura**:
```
docs/
├── README.md                  # Indice e quick links
├── technical-specs.md         # Specifiche complete
└── diary/
    ├── README.md              # Template e indice
    └── 2025-10-13-*.md        # Entry
```

### Task 4: Specifiche Tecniche Complete
Documentato in dettaglio:

1. **Architettura**: Stack completo (React, Pixi.js, Node.js, PostgreSQL)
2. **Player Mode**: Rendering, movement, interaction, inventory, save system
3. **Sistema RPG**: Stats, combat turn-based, level-up
4. **Editor**: Map editor, event system visuale, dialog system, asset manager, NPC editor
5. **Backend API**: Endpoints RESTful, database schema SQL
6. **Condivisione**: Link pubblici, export HTML5 standalone
7. **Performance**: Ottimizzazioni rendering, loading, memory
8. **Sicurezza**: Sanitization, rate limiting, validation
9. **Testing**: Unit, integration, E2E, performance

**TypeScript Interfaces**: Definiti tutti i tipi principali per:
- Tilemap e Sprite system
- Inventory e Item system
- Combat e Character stats
- Event system e Commands
- Dialog e branching
- Save data structure

## Decisioni Tecniche

### Decisione 1: Stack Frontend
**Problema**: Scegliere framework UI per l'editor
**Opzioni Considerate**:
1. React - Ecosystem maturo, TypeScript support ottimo
2. Vue - Più semplice, meno verboso
3. Svelte - Performance migliore, meno boilerplate

**Decisione**: **React 18+ con TypeScript**
**Motivazione**:
- Ecosystem più ricco per componenti complessi
- Migliore integrazione con Pixi.js
- Type safety con TypeScript essenziale per progetto grande
- Team familiarity

### Decisione 2: Rendering Engine
**Problema**: Scegliere libreria per rendering 2D
**Opzioni**:
1. Pixi.js - WebGL, performance, API ricca
2. Phaser - Game framework completo
3. Three.js - Troppo pesante per 2D

**Decisione**: **Pixi.js 7+**
**Motivazione**:
- Focalizzato su rendering 2D performante
- Non troppo opinionated (Phaser ha troppa logica built-in)
- Community attiva e documentazione eccellente
- Flessibilità per customizzazione

### Decisione 3: Database
**Problema**: SQL vs NoSQL per game data
**Opzioni**:
1. PostgreSQL - Relazioni, ACID, mature
2. MongoDB - Flessibile, JSON-native

**Decisione**: **PostgreSQL con Prisma ORM**
**Motivazione**:
- Relazioni complesse tra mappe, eventi, oggetti
- JSONB per game data flessibile quando serve
- Migrations gestibili
- Type-safety con Prisma
- Better query performance per liste avventure

## Note e Osservazioni

### Vision Chiara
Il progetto ha una vision molto chiara: "RPG Maker ma web-based e social-first". Questo guiderà tutte le decisioni di design.

### Scope Management
Importante mantenere focus su MVP prima di aggiungere features avanzate. La roadmap a 4 fasi aiuta.

### Community-First
La condivisione istantanea è killer feature. Deve essere seamless come pubblicare un tweet.

### Performance Critica
Browser game = performance è UX. 60 FPS non negoziabile, anche su mappe complesse.

## Riferimenti

- [Pixi.js Documentation](https://pixijs.com/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [Prisma Docs](https://www.prisma.io/docs)
- [RPG Maker MV/MZ](https://www.rpgmakerweb.com/) - Inspirazione
- [itch.io](https://itch.io/) - Modello condivisione

## Prossimi Step

### Immediati
- [ ] Creare repository su GitHub: `github.com/giobi/sgravoquest`
- [ ] Push initial commit
- [ ] Setup GitHub Actions per CI

### Setup Tecnico
- [ ] Inizializzare progetto React + Vite + TypeScript
- [ ] Setup Pixi.js e canvas base
- [ ] Configurare ESLint + Prettier
- [ ] Setup backend Node.js + Express
- [ ] Configurare Prisma + PostgreSQL

### Primi Passi Sviluppo
- [ ] POC rendering tilemap statico
- [ ] POC movimento personaggio su griglia
- [ ] Primi test performance (1000+ tiles)

---

**Tempo totale sessione**: ~15 minuti
**Stato progetto**: Fase 0 - Setup
**File creati**: 6
**Righe documentazione**: ~4500

**Tags**: #setup #docs #architecture
