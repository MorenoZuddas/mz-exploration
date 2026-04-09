# MZ Exploration - Guida operativa DB + JSON Garmin

Aggiornata: 2026-04-09

## 1) Obiettivo
Questa guida descrive come e stato impostato il flusso Garmin nel progetto, dove vengono salvati i dati, come funzionano le API e come continuare i lavori senza perdere il contesto.

---

## 2) Architettura in breve
- Frontend demo: `app/demo-garmin/page.tsx`
- Import JSON Garmin: `POST /api/activities/garmin`
- Lettura attivita per UI: `GET /api/activities/garmin`
- Connessione DB: `lib/db/connection.ts`
- Modello attivita: `lib/db/models/Activity.ts`
- Conversione raw -> canonico: `lib/garmin/converter.ts`
- Manutenzione (dedup + indici): `lib/db/maintenance.ts`

---

## 3) Cosa e stato fatto (step reali)

### Step A - Connessione MongoDB centralizzata
In `lib/db/connection.ts`:
- usa `MONGODB_URI` da `.env.local`;
- riusa una connessione cache per evitare reconnessioni continue;
- configura pool e timeout con variabili `MONGODB_*`;
- esegue manutenzione automatica al primo accesso (se non disabilitata).

### Step B - Normalizzazione dati Garmin
In `lib/garmin/converter.ts` e nel route handler:
- i record Garmin vengono convertiti in campi canonici (`distance_m`, `duration_sec`, `pace_min_per_km`, ecc.);
- supporta dati che arrivano in formati diversi (raw JSON Garmin o record gia canonici);
- fallback robusti per date/tipo/metriche.

### Step C - Import JSON con upsert e dedup
In `app/api/activities/garmin/route.ts` (POST):
- estrae attivita da payload (`summarizedActivitiesExport` o array flat);
- elimina duplicati interni al file caricato;
- genera fingerprint;
- fa upsert su DB (non inserisce doppioni se gia presenti);
- logga in `sync_logs`;
- lancia manutenzione dedup prima e dopo import.

### Step D - Lettura con conversione e protezione UI
In `app/api/activities/garmin/route.ts` (GET):
- legge da MongoDB;
- rimuove eventuali doppioni residui in memoria prima della risposta;
- converte per il frontend;
- ritorna `total_activities`, `total_unique_activities`, `recent_activities`.

### Step E - Deduplica fisica del DB
In `lib/db/maintenance.ts`:
- raggruppa record simili (`source_id`, `activityId`, fingerprint, fallback comparativo);
- mantiene il record piu recente;
- elimina i duplicati dal DB;
- sincronizza gli indici.

---

## 4) Flussi supportati (entrambi)

### Flusso 1: Upload dal componente JSON
1. Upload file da `app/demo-garmin/page.tsx`.
2. Chiamata `POST /api/activities/garmin`.
3. Conversione + dedup + upsert su DB.
4. `GET /api/activities/garmin` per refresh UI.

### Flusso 2: Inserimento diretto raw nel DB
1. Inserisci documenti raw Garmin in `activities` (Atlas/Compass/shell).
2. La UI legge via `GET /api/activities/garmin`.
3. I dati vengono convertiti al volo per il frontend.
4. La manutenzione elimina doppioni fisici quando rilevati.

Nota: il flusso consigliato resta sempre l'upload via API, perche applica subito tutte le regole di qualita dati.

---

## 5) Dove finiscono i dati
- Collection principale: `activities`
- Collection log sync: `sync_logs`

Il salvataggio avviene in formato canonico (non in puro raw Garmin), cosi le query e la UI restano coerenti.

---

## 6) Unita di misura e conversioni (prima del FE)

Questa e la sezione di riferimento per capire come i campi Garmin vengono tradotti prima della visualizzazione in UI.

### Dove avvengono le conversioni
- Funzione principale: `convertGarminRaw(raw)` in `lib/garmin/converter.ts`.
- Funzioni helper coinvolte:
  - `toSeconds(...)`: normalizza durata/elapsed/moving in secondi.
  - `pickDistanceMeters(...)`: sceglie se trattare il valore distanza come metri o centimetri.
  - `normalizeSpeed(...)`: normalizza la velocita quando il valore raw e compresso.
  - `calcPace(...)`: calcola il passo in min/km da m/s.
  - `normalizeType(...)`: normalizza il tipo attivita.

### Mappa unita raw -> canoniche
- `startTimeLocal`, `startTimeGmt`, `beginTimestamp` -> `date`
  - Atteso: epoch in millisecondi.
  - Conversione: `new Date(ms)`.

- `totalTimeInSeconds`, `duration` -> `duration_sec`
  - Canonico: secondi.
  - Logica: se arriva `totalTimeInSeconds` viene usato diretto; altrimenti `duration` passa da `toSeconds` (sec/ms).

- `elapsedDuration`, `elapsed_sec` -> `elapsed_sec`
  - Canonico: secondi.
  - Logica: stessa regola sec/ms via `toSeconds` quando serve.

- `moving_time`, `movingDuration` -> `moving_sec`
  - Canonico: secondi.
  - Logica: `moving_time` gia canonico, `movingDuration` passa da `toSeconds`.

- `totalDistance`, `distance` -> `distance_m`
  - Canonico: metri.
  - Logica:
    - `totalDistance` e interpretato come metri.
    - `distance` viene valutato da `pickDistanceMeters` per gestire raw misti (metri vs centimetri).

- `avgSpeed`, `averageSpeed`, `avg_speed` -> `avg_speed_mps`
  - Canonico: metri/secondo.
  - Logica: `normalizeSpeed` corregge valori raw compressi (es. < 2) quando necessario.

- `maxSpeed`, `max_speed` -> `max_speed_mps`
  - Canonico: metri/secondo.
  - Logica: stessa normalizzazione di `avg_speed_mps`.

- `avg_speed_mps` -> `pace_min_per_km`
  - Canonico: minuti/km.
  - Logica: calcolo con `calcPace`.

- `elevationGain`, `elevationLoss` -> `elevation_gain_m`, `elevation_loss_m`
  - Canonico: metri.
  - Logica: se record raw Garmin, conversione cm -> m; se campo canonico gia presente, lasciato invariato.

- `minElevation`, `maxElevation` -> `min_elevation_m`, `max_elevation_m`
  - Canonico: metri.
  - Logica: raw Garmin cm -> m.

- `calories` -> `calories_kcal`
  - Canonico: kcal.
  - Logica: valore mantenuto as-is (arrotondato), nessuna conversione kJ->kcal.

- `avgRunCadence`, `avgDoubleCadence`, `avg_cadence` -> `avg_cadence`
  - Canonico: passi/min.
  - Logica: `avgRunCadence` (per gamba) viene raddoppiato; `avgDoubleCadence` e gia totale.

- `avgStrideLength` -> `avg_stride_length_m`
  - Canonico: metri.
  - Logica: raw Garmin cm -> m.

### Dove viene usata la conversione
- In `POST /api/activities/garmin` (`app/api/activities/garmin/route.ts`):
  - `convertGarminRaw` converte prima di fare `upsert` su MongoDB.
- In `GET /api/activities/garmin` (`app/api/activities/garmin/route.ts`):
  - `convertGarminRaw` converte i documenti letti dal DB prima della response al frontend.

### Nota pratica
La pagina `app/demo-garmin/page.tsx` non fa conversioni di dominio: fa solo formattazione visuale (es. metri -> km in tabella, durata `m:ss`/`h:mm:ss`).

---

## 7) API utili (stato attuale)
- `GET /api/test-db`: verifica connessione DB.
- `GET /api/status`: stato generale + ultimi dati.
- `POST /api/activities/garmin`: import JSON Garmin.
- `GET /api/activities/garmin`: lista attivita normalizzate.
- `POST /api/activities/garmin/deduplicate`: dedup manuale (dry-run/apply).
- `POST /api/activities/garmin/indexes`: gestione/sync indici.
- `POST /api/activities/garmin/normalize`: normalizzazione storica.

---

## 8) Mini-sezione `.env.local` (MONGODB_*)

Aggiungi o verifica in `.env.local`:

```bash
MONGODB_URI="mongodb+srv://<user>:<password>@<cluster>/<db>?retryWrites=true&w=majority"
MONGODB_MAX_POOL_SIZE=10
MONGODB_MIN_POOL_SIZE=1
MONGODB_SERVER_SELECTION_TIMEOUT_MS=10000
MONGODB_SOCKET_TIMEOUT_MS=45000
MONGODB_AUTO_MAINTENANCE=true
```

Valori consigliati:
- `MONGODB_MAX_POOL_SIZE=10`: buono per dev e piccoli carichi.
- `MONGODB_MIN_POOL_SIZE=1`: evita sprechi in idle.
- `MONGODB_SERVER_SELECTION_TIMEOUT_MS=10000`: timeout connessione ragionevole.
- `MONGODB_SOCKET_TIMEOUT_MS=45000`: evita chiusure premature su operazioni lente.
- `MONGODB_AUTO_MAINTENANCE=true`: consigliato per tenere il DB pulito.

Se fai troubleshooting rete/Atlas:
- prova `MONGODB_SERVER_SELECTION_TIMEOUT_MS=15000`.
- controlla IP allowlist Atlas e credenziali utente DB.

---

## 9) Prompt pronto per AI (handoff)
Copia questo prompt quando vuoi continuare il progetto con un altro assistente AI:

```text
Sei un senior Next.js 15 + TypeScript engineer. Lavori sul progetto "MZ Exploration".

Contesto tecnico gia implementato:
- MongoDB con connessione centralizzata in `lib/db/connection.ts`
- Modello attivita in `lib/db/models/Activity.ts`
- Import Garmin JSON in `POST /api/activities/garmin`
- Lettura attivita in `GET /api/activities/garmin`
- Conversione Garmin in `lib/garmin/converter.ts`
- Manutenzione dedup + indici in `lib/db/maintenance.ts`
- UI demo in `app/demo-garmin/page.tsx`

Obiettivo ora:
1) Verificare che i due flussi (upload JSON e inserimento diretto DB) producano sempre stessa resa a frontend.
2) Migliorare tracciamento campi mancanti (type, pace, HR, elevazione, location).
3) Aggiungere report diagnostico per import (quali campi sono mancanti per ogni attivita).
4) Preparare integrazione Strava come seconda fonte, con dedup cross-source.

Vincoli:
- Niente `any`
- TypeScript strict
- API con try/catch e risposte chiare
- Nessuna regressione su deduplica esistente

Prima di modificare codice:
- analizza i file attuali
- proponi piano breve
- poi applica patch incrementali e testabili
- mostra sempre come verificare da browser/API
```

---

## 10) Verifiche rapide

```bash
curl -s http://localhost:3000/api/test-db
curl -s http://localhost:3000/api/activities/garmin
curl -s http://localhost:3000/api/status
```

Per dedup manuale (solo se serve):

```bash
curl -s -X POST http://localhost:3000/api/activities/garmin/deduplicate -H "Content-Type: application/json" -d '{}'
curl -s -X POST http://localhost:3000/api/activities/garmin/deduplicate -H "Content-Type: application/json" -d '{"apply": true}'
```

---

## 11) Nota finale
Se in UI vedi dati strani ma nel DB sono raw o misti, il punto da controllare prima e sempre `convertGarminRaw` in `lib/garmin/converter.ts`, perche e il layer unico di traduzione verso il frontend.
