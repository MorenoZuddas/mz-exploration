# Guida DB + JSON Garmin

Aggiornata: 2026-04-17

## 1) Architettura reale
- Import: `POST /api/activities/garmin`
- Lettura: `GET /api/activities/garmin`
- Dettaglio: `GET /api/activities/[id]`
- Conversione unita: `lib/garmin/converter.ts`
- Projection FE: `lib/activities/projector.ts`
- Modello DB: `lib/db/models/Activity.ts`
- Connessione DB: `lib/db/connection.ts`
- Maintenance: `lib/db/maintenance.ts`

## 2) Come vengono salvati i dati
Nel `POST /api/activities/garmin`:
- il payload viene estratto (`summarizedActivitiesExport` o array flat),
- i record vengono validati,
- viene calcolato fingerprint,
- viene fatto upsert deduplicato,
- il JSON originale viene salvato in `raw_payload`.

Metadati salvati insieme al raw (per ricerca/indici):
- `source`, `source_id`, `activityId`, `fingerprint`, `updated_at`
- eventuali campi minimi utili (`name`, `type`, `date`, `distance`, `duration`) quando presenti
- `photos` (quando sincronizzate da Cloudinary)

Quindi: il dato sorgente resta disponibile in DB (`raw_payload`) e la UI usa sempre la projection server-side.

## 3) Conversioni unita (punto unico)
Le conversioni sono centralizzate in `convertGarminRaw()`.

Regole principali:
- Durata -> secondi (`toSeconds`)
- Distanza -> metri (`pickDistanceMeters`)
- Velocita -> m/s (`normalizeSpeed`)
- Passo -> min/km (`calcPace`)
- Elevazione -> metri
- Calorie -> `calories_kcal` con euristiche per evitare valori in unita incoerenti

La projection finale per UI avviene in `projectActivity()`.

## 4) Dedup e indici
### Dedup in import (POST)
Comparatore unificato:
1. `source_id/activityId`
2. `fingerprint`

Se due record hanno lo stesso ID esterno, viene fatto upsert sullo stesso documento (non viene creata una seconda attivita).

### Dedup in lettura
`GET /api/activities/garmin` filtra eventuali duplicati residui prima della risposta.

### Dedup fisica DB
- endpoint: `POST /api/activities/garmin/deduplicate`
- modalita: dry-run / apply
- stesso comparatore unificato + fallback hash da `raw_payload`

### Indici
- endpoint: `POST /api/activities/garmin/indexes`
- sincronizza indici del modello Activity.

## 5) Flussi supportati
### Flusso A - Upload JSON via app
1. Upload file JSON.
2. `POST /api/activities/garmin`.
3. Upsert/dedup su DB.
4. Refresh con `GET /api/activities/garmin`.

### Flusso B - Inserimento diretto nel DB
1. Documento inserito direttamente in `activities`.
2. FE legge via API.
3. Projection server-side normalizza la risposta.

Nota: il flusso consigliato resta A, perche applica comparatore e regole in ingresso in modo coerente.

## 6) Foto Cloudinary
- Sync manuale: `GET /api/sync-photos?secret=...`
- Sync automatica: `POST /api/cloudinary-webhook`
- Match activity tramite `activityId` (e fallback su `source_id` numerico)
- Cleanup ownership su `public_id` per evitare una stessa foto su piu attivita.

## 7) Variabili `.env.local`
```env
MONGODB_URI=
MONGODB_DB_NAME=
MONGODB_MAX_POOL_SIZE=10
MONGODB_MIN_POOL_SIZE=1
MONGODB_SERVER_SELECTION_TIMEOUT_MS=10000
MONGODB_SOCKET_TIMEOUT_MS=45000
MONGODB_AUTO_MAINTENANCE=true

SYNC_SECRET=

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=
```

## 8) Troubleshooting rapido
- Errore Atlas IP whitelist: verifica VPN/proxy e Network Access Atlas.
- Errori dati incoerenti: controlla `convertGarminRaw()` e `projectActivity()`.
- Foto non associate: verifica metadata Cloudinary (`activityId`) + esegui `sync-photos`.

## 9) Comandi utili
```bash
curl -s http://localhost:3000/api/test-db
curl -s http://localhost:3000/api/activities/garmin
curl -s http://localhost:3000/api/status
curl -s "http://localhost:3000/api/sync-photos?secret=YOUR_SYNC_SECRET"
```
