# DB Status - Stato tecnico corrente

Aggiornato: 2026-04-17

## Stato infrastrutturale
- Connessione DB gestita da `lib/db/connection.ts` con cache connessione Mongoose.
- Auto maintenance DB disponibile ma **opt-in** via `MONGODB_AUTO_MAINTENANCE=true`.
- Modello Activity in `lib/db/models/Activity.ts` con indici univoci su:
  - `source + source_id` (parziale)
  - `fingerprint` (parziale)
  - `activityId` (parziale)
  - fallback composito `source + date + type + distance + duration`.

## Collections usate
- `activities`
- `sync_logs`

## Flussi DB attivi
- Import Garmin JSON: `POST /api/activities/garmin`.
- Lettura attivita post-processata: `GET /api/activities/garmin`.
- Dedup manuale: `POST /api/activities/garmin/deduplicate`.
- Sync indici: `POST /api/activities/garmin/indexes`.
- Normalizzazione storica: `POST /api/activities/garmin/normalize`.
- Sync foto manuale: `GET /api/sync-photos?secret=...`.
- Sync foto automatica: `POST /api/cloudinary-webhook`.

## Nota su dati Garmin
Stato reale nel codice:
- In import, il payload originale viene mantenuto in `raw_payload`.
- Il confronto duplicati usa comparatore unificato (`source_id/activityId` -> `fingerprint` -> fallback hash da raw).
- In lettura, la UI riceve dati post-processati via `convertGarminRaw` + `projectActivity`.

## Integrita codice (snapshot)
- Check statico sui file critici API/maintenance: nessun errore TypeScript rilevato.
- Eventuali warning lint globali dipendono dal resto del workspace e vanno verificati con `npm run lint` nel tuo ambiente locale.

## Verifica rapida operativa
```bash
curl -s http://localhost:3000/api/test-db
curl -s http://localhost:3000/api/status
curl -s http://localhost:3000/api/activities/garmin
```
