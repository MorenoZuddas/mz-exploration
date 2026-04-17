# API README - MZ Exploration

Aggiornato: 2026-04-17

## Base URL
Locale: `http://localhost:3000`

## Convenzioni risposta
- Successo: `status: "success"` oppure `ok: true`
- Errore: `status: "error"` oppure `ok: false/error`
- Molti endpoint write hanno modalita `dry-run`/`apply`

## Endpoint

### GET `/api/test-db`
Verifica connessione MongoDB e conteggio collezioni principali.

### GET `/api/status`
Stato DB con conteggi e ultimi record (`activities`, `sync_logs`).

### GET `/api/activities/garmin`
Restituisce attivita post-processate:
- materializza `raw_payload` quando presente
- dedup in lettura
- projection con `projectActivity`
- conversioni da `convertGarminRaw`

Include error mapping per casi Atlas IP non in allowlist (utile con VPN/proxy).

### POST `/api/activities/garmin`
Import JSON Garmin.
- Supporta array flat e wrapper `summarizedActivitiesExport`.
- Dedup nel payload (stesso file).
- Confronto con DB tramite comparatore unificato:
  1. `source_id/activityId` (priorita massima)
  2. `fingerprint`
- Upsert su DB (se ID coincide, non crea un nuovo record).
- Salva sempre il record originale in `raw_payload`.
- Aggiorna anche metadati utili a query/indici (`source`, `source_id`, `activityId`, `fingerprint`, ecc.).

### GET `/api/activities/[id]`
Dettaglio singola attivita in formato post-processato.

### POST `/api/activities/garmin/deduplicate`
Deduplica manuale record Garmin-like.

Body:
```json
{ "apply": false }
```
- `apply=false` (default): preview dry-run
- `apply=true`: elimina duplicati

Comparatore unificato:
1. `source_id/activityId`
2. `fingerprint`
3. fallback hash da `raw_payload` (`date+type+distance+duration`)

### POST `/api/activities/garmin/indexes`
Sincronizza indici collection `activities`.

Body:
```json
{ "apply": false }
```
- `apply=false`: mostra indici correnti
- `apply=true`: drop legacy + `syncIndexes()`

### POST `/api/activities/garmin/normalize`
Normalizza record storici non coerenti.

Body opzionale:
```json
{ "apply": false, "limit": 100 }
```

### GET `/api/sync-photos?secret=...`
Sync manuale Cloudinary -> MongoDB.
- Richiede query `secret` uguale a `SYNC_SECRET`.
- Cerca immagini per `activityId`.
- Aggiorna `photos` su activity target.
- Esegue cleanup ownership cross-attivita.

### POST `/api/cloudinary-webhook`
Webhook Cloudinary.
- Verifica firma (`x-cld-signature`, `x-cld-timestamp`).
- Accetta `upload` e `resource_update`.
- Legge `metadata.activityId`.
- Aggiorna `photos` in MongoDB + cleanup ownership.

## Variabili ambiente richieste
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

## Smoke test rapido
```bash
curl -s http://localhost:3000/api/test-db
curl -s http://localhost:3000/api/status
curl -s http://localhost:3000/api/activities/garmin
curl -s "http://localhost:3000/api/sync-photos?secret=YOUR_SYNC_SECRET"
```
