# mz-exploration

Web app personale (Next.js + TypeScript) per presentare attività di running, trekking e viaggi.

```yaml
framework: next.js (App Router)
language: typescript
styling: tailwindcss v4
ui: shadcn/ui
database: mongodb
package_manager: npm
```

## Setup locale

```bash
npm install
# Crea .env.local con le variabili MongoDB (vedi docs/GARMIN_DB.md)
npm run dev
```

App: `http://localhost:3000`

## Script

```bash
npm run dev      # sviluppo
npm run build    # build produzione
npm run lint     # linting
```

## Documentazione

| File | Contenuto |
|------|-----------|
| `docs/GARMIN_DB.md` | DB MongoDB, flusso Garmin, API, migrazione, env vars |
| `docs/SHADCN.md` | Setup shadcn/ui, componenti disponibili, personalizzazione |
| `docs/COMPONENT_PROPS_GUIDE.md` | Props di tutti i componenti del progetto |
| `docs/STRATEGIA.md` | Struttura pubblica/privata del sito, roadmap |
