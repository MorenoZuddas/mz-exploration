# mz-grm - Running Analytics

## Project Snapshot (AI-Ready)

```yaml
project:
  name: mz-grm
  version: 0.1.0
  type: web-app
  framework: next.js
  framework_version: 16.2.2
  ui_runtime: react 19.2.4
  language: typescript
  styling: tailwindcss v4 (via @tailwindcss/postcss)
  routing_model: next app router (file-based)
  deployment_target: vercel-compatible
  package_manager: npm (scripts present in package.json)
  os_last_verified_by_context: macOS

domain:
  scope: personal running analytics showcase
  audience: owner portfolio + future users interested in running stats
  locale_primary: it
  data_source_current: static mock data in UI
  data_source_planned: garmin/strava integration (not implemented)

status:
  maturity: early prototype / MVP UI
  backend: none
  database: none (MongoDB is mentioned in UI text but not configured)
  authentication: not implemented
  api_routes: none

known_critical_gaps:
  - route /login linked from multiple pages but file app/login/page.tsx is missing
  - contact form does not send messages; only local state + console.log
  - no test suite configured
```

## Obiettivo del progetto

`mz-grm` e una web app in Next.js pensata per visualizzare e raccontare attivita di running personali (metriche, progressione, percorsi, contatti). In questa fase il progetto e prevalentemente frontend e dimostrativo: mostra contenuti statici e componenti UI riutilizzabili, ma non include ancora pipeline dati reali, backend, autenticazione o persistenza.

## Caratteristiche attualmente implementate

- Homepage marketing con hero, feature cards, metriche aggregate e call-to-action.
- Pagina "Chi Sono" con bio personale, obiettivi running e metriche principali.
- Pagina "Percorsi e Foto" con griglia di elementi statici (mock routes/photos).
- Pagina "Contatti" con form client-side e feedback di invio simulato.
- Navigazione top sticky condivisa (`Navigation`) e footer globale (`Footer`).
- Tema base con Tailwind CSS v4 e font Geist/Geist Mono tramite `next/font`.

## Stack tecnico

- `next@16.2.2`
- `react@19.2.4`
- `react-dom@19.2.4`
- `typescript@^5`
- `tailwindcss@^4`
- `@tailwindcss/postcss@^4`
- `eslint@^9` + `eslint-config-next@16.2.2`

## Struttura del repository

```text
mz-grm/
  app/
    layout.tsx                # Root layout, metadata globali, font, Footer globale
    page.tsx                  # Homepage
    globals.css               # Token tema + import Tailwind
    about/page.tsx            # Pagina "Chi Sono"
    gallery/page.tsx          # Pagina "Percorsi e Foto"
    contact/page.tsx          # Pagina "Contatti" (client component)
    components/
      Navigation.tsx          # Navbar sticky con link principali
      Footer.tsx              # Footer con link/sociaux/copyright
  public/
    logo/hp-logo.svg
    ...altre icone statiche
  package.json
  tsconfig.json
  next.config.ts
  postcss.config.mjs
  eslint.config.mjs
  AGENTS.md
```

## Architettura applicativa

### 1) Routing (App Router)

Routing file-based sotto `app/`:

- `/` -> `app/page.tsx`
- `/about` -> `app/about/page.tsx`
- `/gallery` -> `app/gallery/page.tsx`
- `/contact` -> `app/contact/page.tsx`

Rotte referenziate ma non implementate:

- `/login` (link presente in `app/page.tsx` e `app/components/Navigation.tsx`, pagina assente)

### 2) Layout globale

`app/layout.tsx`:

- Definisce metadata globali (`title`, `description`).
- Configura font Geist e Geist Mono tramite `next/font/google`.
- Applica `lang="it"` al documento HTML.
- Renderizza `children` e `Footer` in tutte le pagine.

### 3) Componentizzazione

- `Navigation` (client component): top nav sticky con link interni e CTA login.
- `Footer` (server component per default): link interni/esterni e icone SVG inline.

### 4) Strategia rendering

- Le pagine senza `"use client"` sono server component per default (App Router behavior).
- `app/contact/page.tsx` usa `"use client"` per `useState` e gestione form.

### 5) Stato e dati

- Nessuno stato globale (no Redux/Zustand/Context custom).
- Dati mostrati sono hardcoded nelle pagine (es. statistiche, lista foto, bio).
- Il form contatti salva temporaneamente stato locale (`formData`, `submitted`).

## Dettaglio pagine

### Homepage - `app/page.tsx`

Contiene:

- Hero con value proposition del progetto.
- CTA verso `/login` e `/about`.
- Sezione feature (3 card principali).
- Sezione statistiche aggregate (4 metriche).
- CTA finale verso login.

Nota: valori numerici e KPI sono statici e dimostrativi.

### About - `app/about/page.tsx`

Contiene:

- Presentazione personale e motivazione progetto.
- Obiettivi running con target numerici.
- Box metriche statiche.
- Lista "Tecnologie Usate" renderizzata da array locale.

Nota: nella lista tecnologie appaiono `MongoDB` e `Vercel`, ma nel codice corrente non esiste configurazione DB o deployment script specifico.

### Gallery - `app/gallery/page.tsx`

Contiene:

- Array locale `photos` con metadati attivita (titolo, data, distanza, descrizione).
- Render a griglia responsive con placeholder grafico.
- Pulsante "Visualizza Percorso" senza azione associata.

### Contact - `app/contact/page.tsx`

Contiene:

- Informazioni di contatto (email, GitHub, Strava, location).
- Form nome/email/messaggio con validazione HTML base (`required`).
- `handleSubmit` che previene submit reale, fa `console.log`, resetta form e mostra alert success per 5 secondi.

Nota: non c'e integrazione con API route, provider email o backend.

## Styling e design system

- Tailwind CSS v4 importato in `app/globals.css` con `@import "tailwindcss"`.
- Token CSS custom (`--background`, `--foreground`) e mapping nel blocco `@theme inline`.
- Supporto dark mode base via `prefers-color-scheme` (variazioni di variabili root).
- Font globale: fallback `Arial, Helvetica, sans-serif`; variabili Geist disponibili via classi nel body.

## Configurazione e quality tooling

### TypeScript - `tsconfig.json`

- Modalita strict attiva (`strict: true`).
- `moduleResolution: bundler` e plugin `next`.
- Alias path `@/* -> ./*`.

### ESLint - `eslint.config.mjs`

- Estende `eslint-config-next/core-web-vitals` e `eslint-config-next/typescript`.
- Ignora output build (`.next`, `out`, `build`) e `next-env.d.ts`.

### Next config - `next.config.ts`

- Configurazione default (nessuna opzione custom attiva).

## Script disponibili

Da `package.json`:

- `npm run dev` -> avvio ambiente sviluppo
- `npm run build` -> build produzione
- `npm run start` -> avvio build prod
- `npm run lint` -> linting progetto

## Setup locale

Prerequisiti minimi (dedotti dal progetto):

- Node.js compatibile con Next.js 16
- npm

Comandi base:

```bash
npm install
npm run dev
```

App disponibile in locale su:

- `http://localhost:3000`

## Limiti attuali e rischi funzionali

- Link a `/login` non risolto -> possibile 404 in navigazione.
- Nessuna persistenza dati -> tutti i contenuti sono statici o effimeri.
- Nessun backend/API -> impossibile ingestione dati Garmin/Strava reale.
- Nessun test automatico -> regressioni non coperte.
- Nessuna gestione errori asincrona per submission contatti (perche non esiste submit reale).

## Roadmap tecnica consigliata

1. Implementare `app/login/page.tsx` o rimuovere temporaneamente i link.
2. Introdurre API route (`app/api/...`) per ingestion/normalizzazione attivita running.
3. Definire schema dati (attivita, metriche aggregate, records personali).
4. Integrare persistenza (es. MongoDB/PostgreSQL) coerente con stack target.
5. Sostituire mock con fetch server/client e stati loading/error.
6. Aggiungere test (`vitest`/`jest` + `@testing-library/react` + E2E opzionale).
7. Configurare CI (lint + build + test) per quality gate.

## Note per analisi AI esterne

Se questo repository viene analizzato da agenti AI, usare queste assunzioni operative:

- Il progetto e un frontend prototype con App Router, non una piattaforma completa.
- Le metriche attuali non rappresentano una pipeline dati verificabile.
- Qualsiasi feature che implichi auth, backend o DB va considerata "planned" salvo file espliciti aggiunti.
- Le decisioni tecniche devono essere validate con i file di configurazione reali (`package.json`, `tsconfig.json`, `next.config.ts`).
- Considerare `AGENTS.md`: la versione Next puo avere breaking changes rispetto a riferimenti storici.

## Stato documentazione

Questo README descrive lo stato corrente del codice presente nel repository al momento dell'aggiornamento. Aggiornare questa documentazione ogni volta che si introducono:

- nuove rotte,
- integrazioni API,
- dipendenze infrastrutturali,
- meccanismi di auth/persistenza,
- test o pipeline CI/CD.
