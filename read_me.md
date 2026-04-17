# MZ Exploration - Runbook Operativo

Aggiornato: 2026-04-17

## 1) Stato allineamento architettura dati
Esito check: **allineato** con il flusso concordato.

Stato reale nel codice:
- In `app/api/activities/garmin/route.ts` (POST) il payload Garmin viene salvato in `raw_payload`.
- Il DB mantiene il dato sorgente e metadati di supporto (`source_id`, `activityId`, `fingerprint`, ecc.).
- In lettura (`GET /api/activities/garmin`) i dati vengono convertiti/proiettati server-side e solo il risultato post-processato arriva al FE.
- L'estensione `photos` sullo schema e` presente e corretta.

## 2) Flussi dati attuali
### Flusso A - Import JSON Garmin
1. Upload JSON.
2. `POST /api/activities/garmin`:
   - extract attivita,
   - dedup nel payload,
   - comparazione con DB su `source_id/activityId` poi `fingerprint`,
   - upsert su `activities`,
   - log su `sync_logs`.
3. FE legge con `GET /api/activities/garmin`.

### Flusso B - Dati gia presenti nel DB
1. Record letti da `activities`.
2. `GET /api/activities/garmin` materializza `raw_payload` quando presente.
3. `projectActivity()` restituisce campi post-processati.
4. FE renderizza solo i campi proiettati.

### Flusso C - Foto Cloudinary
1. Sync manuale: `GET /api/sync-photos?secret=...`.
2. Sync automatica: `POST /api/cloudinary-webhook`.
3. Match attivita per `activityId` e fallback su `source_id` numerico.
4. Cleanup ownership: stesso `public_id` rimosso da attivita non proprietarie.

## 3) API operative
- `GET /api/test-db`
- `GET /api/status`
- `GET /api/activities/garmin`
- `POST /api/activities/garmin`
- `GET /api/activities/[id]`
- `POST /api/activities/garmin/deduplicate`
- `POST /api/activities/garmin/indexes`
- `POST /api/activities/garmin/normalize`
- `GET /api/sync-photos?secret=...`
- `POST /api/cloudinary-webhook`

Dettagli request/response: `docs/API_README.md`.

## 4) Variabili ambiente
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

## 5) Integrita tecnica (snapshot)
- API critiche e maintenance senza errori TS nel controllo statico corrente.
- Per stato lint completo usa:

```bash
npm run lint
```

## 6) Comandi operativi consigliati
```bash
curl -s http://localhost:3000/api/test-db
curl -s http://localhost:3000/api/status
curl -s http://localhost:3000/api/activities/garmin
curl -s -X POST http://localhost:3000/api/activities/garmin/deduplicate -H "Content-Type: application/json" -d '{}'
```
