# SgravoQuest

2D RPG top-down su **territori reali** estratti da OpenStreetMap, con frontiera procedurale ai bordi. Tema: satira della burocrazia italiana ("Sgravonia").

Stack: **Phaser 3 + TypeScript + Vite**. Deploy: Vercel → `sgravoquest.com`.

> Clean start dell'11 giugno 2026. Le due codebase precedenti (v1 React/Pixi, v2 Phaser) non hanno mai funzionato in modo stabile e sono archiviate read-only su GitHub: `giobi/sgravoquest-archive-v1`, `giobi/sgravoquest-archive-v2`.

## Visione

**Fase 1 — Nucleo reale (Golfo Borromeo).** La mappa non si disegna a mano: si genera da OpenStreetMap. Si scarica un bounding box via Overpass API (gratis, no key) → GeoJSON → si converte in tilemap Phaser. Lago → acqua, edifici → case, l'Isola Bella dov'è davvero.

**Fase 2 — Frontiera procedurale.** Il nucleo è reale e curato; ai bordi il mondo si genera proceduralmente man mano che esplori. Vicino a casa = mondo vero, più lontano = Sgravonia infinita.

## Primo esperimento

Pipeline **OSM → tilemap**. Se gira, sblocca tutto il resto.

## Dev

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + bundle in dist/
```
