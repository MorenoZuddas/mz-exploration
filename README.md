# mz-exploration (package: mz-grm)

## Project Snapshot (AI-Ready)

```yaml
project:
  display_name: mz-exploration
  package_name: mz-grm
  version: 0.1.0
  type: web-app
  framework: next.js
  framework_version: 16.2.2
  ui_runtime: react 19.2.4
  language: typescript
  styling: tailwindcss v4 (via @tailwindcss/postcss)
  routing_model: next app router (file-based)
  deployment_target: vercel-compatible
  package_manager: npm

status:
  maturity: early prototype / MVP UI
  backend: none
  database: none (MongoDB is mentioned in UI text but not configured)
  authentication: not implemented
  api_routes: none
  testing: no automated test suite configured

domain:
  scope: personal showcase (running, trekking, trips)
  locale_primary: it
  data_source_current: static mock data in UI
  data_source_planned: garmin/strava integration (not implemented)

known_critical_gaps:
  - contact form is simulated only (local state + console.log)
  - no backend or persistence for activities/metrics
  - no automated tests
```

## Obiettivo del progetto

`mz-exploration` e una web app Next.js che presenta avventure personali in tre aree: running, trekking e viaggi.

Lo stato attuale e principalmente frontend dimostrativo: pagine statiche, dati hardcoded e componenti UI condivisi. Non ci sono backend, autenticazione, API o persistenza dati.

## Cosa e implementato oggi

- Homepage con hero, card di navigazione e statistiche aggregate.
- Pagina `about` con bio, obiettivi e metriche personali statiche.
- Area `exploration` con 3 sottosezioni dedicate:
  - `running`
  - `trekking`
  - `trips`
- Pagina `gallery` con griglia di elementi statiche.
- Pagina `contact` con form client-side e feedback simulato.
- Header sticky responsive con dropdown desktop e menu mobile.
- Footer globale con link interni e social.

## Stack tecnico

- `next@16.2.2`
- `react@19.2.4`
- `react-dom@19.2.4`
- `typescript@^5`
- `tailwindcss@^4`
- `@tailwindcss/postcss@^4`
- `eslint@^9` + `eslint-config-next@16.2.2`

## Struttura repository (attuale)

```text
mz-exploration/
  app/
    layout.tsx
    page.tsx
    globals.css
    about/page.tsx
    contact/page.tsx
    gallery/page.tsx
    exploration/
      page.tsx
      running/page.tsx
      trekking/page.tsx
      trips/page.tsx
    components/
      Header.tsx
      Footer.tsx
  public/
    logo/hp-logo.svg
    ...icone statiche
  package.json
  tsconfig.json
  next.config.ts
  postcss.config.mjs
  eslint.config.mjs
  AGENTS.md
```

## Routing (App Router)

Rotte implementate:

- `/` -> `app/page.tsx`
- `/about` -> `app/about/page.tsx`
- `/exploration` -> `app/exploration/page.tsx`
- `/exploration/running` -> `app/exploration/running/page.tsx`
- `/exploration/trekking` -> `app/exploration/trekking/page.tsx`
- `/exploration/trips` -> `app/exploration/trips/page.tsx`
- `/gallery` -> `app/gallery/page.tsx`
- `/contact` -> `app/contact/page.tsx`

Nota: al momento non ci sono link attivi a `/login` nel codice applicativo.

## Architettura applicativa

### Layout globale

`app/layout.tsx`:

- imposta metadata globali (titolo + descrizione)
- applica font Geist e Geist Mono via `next/font/google`
- usa `lang="it"`
- renderizza `Header`, `children`, `Footer`

### Componenti condivisi

- `app/components/Header.tsx` (client component)
  - navbar desktop
  - dropdown `Exploration`
  - menu mobile con stato locale (`isMenuOpen`, `isExplorationOpen`)
- `app/components/Footer.tsx`
  - logo
  - link rapidi (`about`, `exploration`, `contact`)
  - link social esterni

### Strategia rendering

- server components di default per le pagine senza `"use client"`
- `app/contact/page.tsx` e `app/components/Header.tsx` sono client components

### Dati e stato

- nessuno stato globale (no Redux/Zustand/Context custom)
- dati statici hardcoded nelle pagine
- form contatti gestito con stato locale (`formData`, `submitted`)

## Dettaglio pagine

### Home - `app/page.tsx`

- hero principale
- card di preview per `about`, `exploration`, `contact`
- statistiche aggregate statiche
- CTA verso exploration

### About - `app/about/page.tsx`

- bio personale
- obiettivi running
- metriche statiche
- lista tecnologie mostrata a UI

Nota: la lista tecnologie include `MongoDB` e `Vercel`, ma nel repository non c'e configurazione DB o pipeline deployment dedicata.

### Exploration hub - `app/exploration/page.tsx`

- overview delle categorie
- card navigabili verso `running`, `trekking`, `trips`
- sezione statistiche aggregate

### Running - `app/exploration/running/page.tsx`

- lista attivita running mock
- metriche per attivita (distanza, tempo, pace)
- blocco riepilogo statistiche

### Trekking - `app/exploration/trekking/page.tsx`

- lista escursioni mock
- attributi attivita (elevazione, durata, difficolta)
- blocco riepilogo statistiche

### Trips - `app/exploration/trips/page.tsx`

- lista viaggi mock
- dettagli per viaggio (destinazioni, durata, highlights)
- blocco riepilogo statistiche

### Gallery - `app/gallery/page.tsx`

- griglia card statiche
- placeholder grafico
- pulsante "Visualizza Percorso" senza azione associata

### Contact - `app/contact/page.tsx`

- contatti statici (email, GitHub, Strava, location)
- form con validazione HTML base (`required`)
- submit simulato (`preventDefault`, `console.log`, reset, alert temporaneo)

## Styling e design

- Tailwind CSS v4 tramite `@import "tailwindcss"` in `app/globals.css`
- token CSS (`--background`, `--foreground`) mappati in `@theme inline`
- dark mode base via `prefers-color-scheme`
- font body fallback: `Arial, Helvetica, sans-serif`

## Configurazione e tooling

### TypeScript - `tsconfig.json`

- `strict: true`
- `moduleResolution: bundler`
- plugin `next`
- alias `@/* -> ./*`

### ESLint - `eslint.config.mjs`

- estende `eslint-config-next/core-web-vitals`
- estende `eslint-config-next/typescript`
- ignora `.next`, `out`, `build`, `next-env.d.ts`

### Next config - `next.config.ts`

- configurazione base senza opzioni custom

## Script disponibili

Da `package.json`:

- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

## Setup locale

Prerequisiti minimi dedotti dai file:

- Node.js compatibile con Next.js 16
- npm

```bash
npm install
npm run dev
```

App locale: `http://localhost:3000`

## Migrazione wrapper Garmin (`summarizedActivitiesExport`)

Se nella collection `activities` e presente un singolo documento contenitore con un array Garmin come `summarizedActivitiesExport`, puoi convertirlo in documenti canonici (uno per attivita) tramite la route:

- `POST /api/activities/garmin/migrate-wrapper`

La route supporta:

- dry-run di default
- applicazione reale con `{"apply": true}`
- cancellazione del documento wrapper sorgente dopo migrazione riuscita (default: `true`)
- protezione opzionale tramite env `MIGRATION_API_SECRET`

### Variabili ambiente consigliate

In locale o su Vercel puoi configurare:

```bash
MIGRATION_API_SECRET=una-stringa-segreta-lunga
```

Se la variabile e impostata, la route richiede l'header:

```bash
x-migration-secret: <valore-segreto>
```

### Dry-run locale

```bash
curl -X POST "http://localhost:3000/api/activities/garmin/migrate-wrapper" \
  -H "Content-Type: application/json" \
  -H "x-migration-secret: $MIGRATION_API_SECRET" \
  -d '{"limit":25}'
```

### Apply locale

```bash
curl -X POST "http://localhost:3000/api/activities/garmin/migrate-wrapper" \
  -H "Content-Type: application/json" \
  -H "x-migration-secret: $MIGRATION_API_SECRET" \
  -d '{"apply":true,"limit":25,"deleteSourceDocuments":true}'
```

### Dry-run produzione

```bash
curl -X POST "https://TUO-DOMINIO/api/activities/garmin/migrate-wrapper" \
  -H "Content-Type: application/json" \
  -H "x-migration-secret: $MIGRATION_API_SECRET" \
  -d '{"limit":25}'
```

### Apply produzione

```bash
curl -X POST "https://TUO-DOMINIO/api/activities/garmin/migrate-wrapper" \
  -H "Content-Type: application/json" \
  -H "x-migration-secret: $MIGRATION_API_SECRET" \
  -d '{"apply":true,"limit":25,"deleteSourceDocuments":true}'
```

### Cosa aspettarsi

- `wrapper_documents`: quanti documenti contenitore Garmin sono stati trovati
- `activities_found`: quante attivita interne sono state rilevate
- `upserted_activities`: quanti documenti canonici sono stati creati
- `already_existing_activities`: quante attivita erano gia presenti
- `deleted_wrapper_documents`: quanti wrapper sorgente sono stati rimossi dopo il successo

## Limiti attuali e rischi

- Nessuna persistenza dati (contenuti mock/statici)
- Nessun backend/API per ingestione dati reali
- Form contatti non invia messaggi reali
- Pulsanti/azioni in alcune sezioni sono solo placeholder UI
- Nessun test automatico configurato

## Roadmap tecnica suggerita

1. Introdurre API route (`app/api/...`) per dati attivita e contatti.
2. Definire modello dati per running/trekking/trips.
3. Integrare persistenza (MongoDB/PostgreSQL) se confermata.
4. Collegare il form contatti a provider email/API interna.
5. Sostituire progressivamente mock con fetch server/client.
6. Aggiungere test (unit/integration + eventuale e2e) e CI.

## Note operative per analisi AI

- Trattare il progetto come frontend prototype con App Router.
- Considerare le metriche correnti come dati dimostrativi non verificati.
- Considerare auth/backend/database come non implementati finche non presenti file espliciti.
- Validare sempre decisioni tecniche su `package.json`, `tsconfig.json`, `next.config.ts`.

## Stato documentazione

Questo README e allineato allo stato corrente del repository al momento dell'aggiornamento.

Aggiornarlo quando cambiano:

- rotte
- componenti condivisi
- integrazioni API/backend
- persistenza/auth
- test o CI/CD

## 🎨 shadcn/ui Integration

### ✅ Configurazione Completata

A partire da questa versione, il progetto integra **shadcn/ui** per componenti UI professionali e riutilizzabili. La configurazione è stata eseguita **proteggendo i font originali**.

### Caratteristiche della Setup

- ✅ **Font Protetti**: Geist da Google Fonts + Arial rimangono intatti
- ✅ **Componenti Pronti**: Button, Card e altri disponibili immediatamente
- ✅ **Tailwind CSS v4 Integrato**: Compatibile con la versione già installata
- ✅ **Completamente Customizzabile**: Tutti i componenti sono nel tuo repository

### Componenti Disponibili

Currently installed:
- `Button` - Bottone versatile con varianti (default, secondary, destructive, outline, ghost, link)
- `Card` - Contenitore Card con CardHeader, CardTitle, CardDescription, CardContent, CardFooter

To add more components:
```bash
npx shadcn-ui@latest add [component-name] --yes
```

### File Relativi

- `SHADCN_SETUP.md` - Documentazione completa sulla setup e configurazione
- `app/components-demo/page.tsx` - Pagina di test per i componenti
- `components.json` - Configurazione CLI di shadcn/ui
- `components/ui/globals-shadcn.css` - Variabili CSS per i componenti
- `lib/utils.ts` - Utilità helper (funzione `cn()`)

### Uso Rapido

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Example() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Titolo</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant="outline">Clicca</Button>
      </CardContent>
    </Card>
  )
}
```

Per ulteriori dettagli, consulta il file `SHADCN_SETUP.md`.
