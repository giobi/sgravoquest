# 🎮 SgravoQuest

**Framework RPG 2D Web-Based con Editor No-Code**

SgravoQuest è un framework completo per la creazione di avventure RPG 2D direttamente nel browser. Permette agli utenti di creare, giocare e condividere le proprie avventure senza scrivere codice.

## 🎯 Caratteristiche Principali

### Per i Giocatori
- 🗺️ **Esplora avventure create dalla community** in formato 2D top-down
- ⚔️ **Sistema di combattimento a turni** in stile JRPG classico
- 📦 **Gestione inventario** con oggetti, armi e armature
- 💾 **Salvataggio progressi** locale o su cloud
- 📖 **Codex e Bestiario** per tracciare scoperte e creature

### Per i Creatori
- 🎨 **Editor Visuale No-Code** per creare avventure complete
- 🗺️ **Tilemap Editor** con sistema drag-and-drop
- 👥 **Gestione PNG e Dialoghi** con branching narrativo
- ⚡ **Sistema Eventi** basato su logica visuale (if-then-else)
- 🎵 **Asset Manager** per sprite, tileset, musica e effetti sonori
- 🔗 **Condivisione Istantanea** tramite link unico
- 📤 **Export HTML5** (opzionale) per piena proprietà del progetto

## 🏗️ Architettura Tecnica

### Frontend
- **Rendering**: WebGL tramite Pixi.js/Phaser
- **UI Editor**: React/Vue/Svelte
- **Linguaggio**: TypeScript/JavaScript

### Backend
- **Server**: Node.js (Express) / Python (Django/Flask)
- **Database**: MongoDB (NoSQL) / PostgreSQL (SQL)
- **Storage**: Cloud Storage (S3/Google Cloud) per asset utente
- **Auth**: JWT + OAuth (Google/GitHub)

### Funzionalità Core
- Sistema di mappe multi-layer (sfondo, collisioni, eventi)
- Motore di eventi visuale drag-and-drop
- Sistema statistiche RPG (HP, ATK, DEF, LVL)
- Combat engine a turni
- Inventory system con effetti oggetti
- Dialog system con scelte multiple
- Sistema di salvataggio/caricamento

## 🚀 Roadmap

### Fase 1: MVP (Minimum Viable Product)
- [ ] Motore di rendering 2D base
- [ ] Sistema di movimento su griglia
- [ ] Editor mappe basilare
- [ ] Sistema di collisioni
- [ ] Inventario semplice

### Fase 2: Editor Avanzato
- [ ] Editor eventi visuale
- [ ] Sistema dialoghi e PNG
- [ ] Asset manager completo
- [ ] Sistema autenticazione utenti
- [ ] Database e salvataggio cloud

### Fase 3: RPG Features
- [ ] Sistema statistiche e level-up
- [ ] Combat engine a turni
- [ ] Editor combattimenti
- [ ] Sistema equipaggiamento
- [ ] Codex/Bestiario

### Fase 4: Community & Sharing
- [ ] Sistema condivisione avventure
- [ ] Marketplace asset community
- [ ] Rating e commenti
- [ ] Export HTML5 standalone
- [ ] Analytics per creatori

## 📚 Documentazione

Consulta la cartella `/docs` per:
- Specifiche tecniche complete
- Guide per sviluppatori
- Tutorial per creatori
- API Reference
- Diary di sviluppo

## 🤝 Contribuire

SgravoQuest è un progetto open-source. Contributi, idee e feedback sono benvenuti!

1. Fork del progetto
2. Crea un branch per la feature (`git checkout -b feature/AmazingFeature`)
3. Commit delle modifiche (`git commit -m 'Add some AmazingFeature'`)
4. Push al branch (`git push origin feature/AmazingFeature`)
5. Apri una Pull Request

## 📄 Licenza

[Da definire - Proposta: MIT License]

## 🎮 Ispirazione

Questo progetto è ispirato a classici maker come RPG Maker, ma completamente web-based e orientato alla condivisione istantanea, simile a piattaforme come itch.io o Dreams.

---

**Stato Progetto**: 🚧 In Sviluppo Iniziale

**Ultima Versione**: 0.1.0-alpha

**Repository**: https://github.com/giobi/sgravoquest
