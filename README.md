# MZ Exploration

Aggiornato: 2026-04-17 (versione raw-only)

## Stato reale del progetto
- App Next.js con App Router, TypeScript, Tailwind v4 e componenti shadcn/ui.
- Integrazione MongoDB attiva via Mongoose (`lib/db/connection.ts`).
- **Import Garmin raw-only**: JSON Garmin salvato invariato in `raw_payload`, nessuna conversione distruttiva in scrittura.
- Conversione centralizzata: `convertGarminRaw` + `projectActivity` **solo in lettura** (GET).
- Integrazione Cloudinary attiva per associazione foto alle attivita (`/api/sync-photos`, `/api/cloudinary-webhook`).
- Deduplicazione unificata: tutti i flussi (POST, `/deduplicate`, maintenance) usano lo stesso comparatore.

## Stack
- `next@16.2.2`
- `react@19.2.4`
- `typescript@^5`
- `tailwindcss@^4`
- `mongoose@^9.4.1`
- `mongodb@^7.1.1`
- `cloudinary@^2.9.0`

## Architettura dati (attuale raw-only)
- Collection principale: `activities` (con campo `raw_payload` per il JSON Garmin originale).
- Collection log sync: `sync_logs`.
- Flusso write: JSON Garmin -> `raw_payload` (no conversione distruttiva).
- Flusso read: materializza `raw_payload` -> `convertGarminRaw` -> `projectActivity` -> FE.

## Endpoint principali
- `GET /api/test-db` - test connessione MongoDB.
- `GET /api/status` - stato DB e ultimi record/log.
- `GET /api/activities/garmin` - lista attivita **post-processata** (proiezione FE).
- `POST /api/activities/garmin` - import JSON Garmin **raw-only** (salva in `raw_payload`).
- `GET /api/activities/[id]` - dettaglio attivita **post-processato**.
- `POST /api/activities/garmin/deduplicate` - dedup manuale (comparatore unificato).
- `POST /api/activities/garmin/indexes` - sync indici.
- `POST /api/activities/garmin/normalize` - normalizzazione storica (fallback legacy).
- `GET /api/sync-photos?secret=...` - sync foto Cloudinary -> MongoDB.
- `POST /api/cloudinary-webhook` - aggiornamento automatico foto da webhook.

Dettagli completi: `docs/API_README.md`.

## Variabili ambiente minime
```env
MONGODB_URI=
MONGODB_DB_NAME=
MONGODB_AUTO_MAINTENANCE=true

SYNC_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

## Avvio locale
```bash
npm install
npm run dev
```

## Deduplicazione (unificata)
**Algoritmo unificato** in tutti i flussi (POST import, deduplicate endpoint, maintenance):
1. Priority: `source_id` o `activityId` (esterno, da Garmin).
2. Fallback: `fingerprint` pre-calcolato.
3. Ricalcolo: materializza `raw_payload` -> `convertGarminRaw` -> SHA256(date + type + distance + duration).

Questo garantisce coerenza tra import e dedup.

## Check integrita (da eseguire prima del deploy)
```bash
npm run lint
npm run build
```

## Deploy produzione (Vercel)
Il flusso funziona anche in produzione **se** la configurazione e` corretta:
1. Configura in Vercel `MONGODB_URI`, `SYNC_SECRET`, `CLOUDINARY_*`.
2. Verifica su Atlas Network Access che l'origine Vercel sia autorizzata.
3. Imposta webhook Cloudinary su `https://<tuo-dominio>/api/cloudinary-webhook`.
4. Esegui una sync iniziale: `GET /api/sync-photos?secret=...`.
5. Smoke test post-deploy: `GET /api/test-db`, `GET /api/status`, `GET /api/activities/garmin`.

## Documentazione nel repo
- `docs/API_README.md` - guida API unificata.
- `docs/GUIDA_DB_JSON_API_GARMIN.md` - guida Garmin + dedup + conversioni.
- `read_me.md` - runbook operativo.
- `DB_STATUS.md` - stato tecnico corrente.
- `SHADCN_SETUP.md` / `SHADCN_SETUP_SUMMARY.md` - stato integrazione UI.
- `STRATEGIA_SITO.md` - direzione prodotto (pubblico vs area privata).
