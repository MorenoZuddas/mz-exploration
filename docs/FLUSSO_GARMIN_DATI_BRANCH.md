# Flusso dati Garmin (branch corrente)

## Perche ci sono stati molti cambiamenti

Il problema iniziale era strutturale:

- nel DB poteva arrivare un documento Garmin "wrapper" con `summarizedActivitiesExport: [...]`
- le API prima assumevano quasi sempre `1 documento Mongo = 1 attivita`
- risultato: conteggi errati, attivita non lette, dettagli non trovati

Quindi i cambi non sono stati estetici: servivano per supportare **entrambi** i formati senza rompere il frontend.

---

## Obiettivo tecnico (vincolo richiesto)

Obiettivo esplicito: poter caricare dati Garmin nel DB senza preprocess manuale del file.

In pratica ora il backend supporta:

1. formato canonico (1 doc = 1 attivita)
2. formato wrapper Garmin (`summarizedActivitiesExport`)

---

## Cosa e stato cambiato davvero (e cosa no)

### Cosa e stato cambiato

- aggiunto adapter condiviso per espandere wrapper: `lib/garmin/db.ts`
- aggiunta migrazione wrapper -> documenti canonici: `lib/garmin/migrate.ts`
- aggiunto endpoint migrazione manuale: `app/api/activities/garmin/migrate-wrapper/route.ts`
- integrate letture wrapper-aware in API principali:
  - `app/api/activities/garmin/route.ts`
  - `app/api/activities/all/route.ts`
  - `app/api/activities/[id]/route.ts`
  - `app/api/status/route.ts`
  - `app/api/diagnose/db/route.ts`
  - `app/api/test-db/route.ts`
- integrata auto-manutenzione DB con migrazione wrapper: `lib/db/maintenance.ts`
- per ridurre dati stale lato UI locale:
  - cache key bump in `lib/cache/activities.ts`
  - cache disabilitata in dev su running: `app/exploration/running/page.tsx`
  - fetch GET no-store su demo: `app/demo-garmin/page.tsx`

### Cosa NON e stato cambiato

- non e stata cambiata la navigazione del sito
- non sono stati cambiati gli URL principali usati dal FE
- non e stata cambiata la logica di business delle card (ordinamento/filtri base restano FE)
- non e stato introdotto un nuovo datastore o una nuova architettura applicativa

In sintesi: e stata cambiata la robustezza del **layer dati**, non la struttura del sito.

---

## Flusso completo attuale (end-to-end)

### 1) Ingresso dati (POST `/api/activities/garmin`)

File: `app/api/activities/garmin/route.ts`

1. Riceve JSON Garmin (array, oggetto singolo, o wrapper con `summarizedActivitiesExport`).
2. Estrae attivita raw valide.
3. Fa dedup nel payload caricato.
4. Per ogni attivita:
   - converte in forma canonica (`convertGarminRaw`)
   - genera fingerprint
   - upsert su collection `activities` con chiavi dedup (`source_id` o `fingerprint`)
5. Esegue cleanup duplicati.
6. Restituisce metriche (salvate, duplicate, saltate, errori).

### 2) Lettura dati (GET `/api/activities/garmin`)

File: `app/api/activities/garmin/route.ts`

1. Legge documenti da Mongo.
2. Espande eventuali wrapper via `expandGarminActivitiesFromDocuments`.
3. Ordina e deduplica in lettura (`buildReadDedupKey`).
4. Converte per risposta FE e risolve `activityId` numerico quando possibile.
5. Fa merge opzionale con asset Cloudinary (foto).
6. Restituisce payload finale con header no-store.

### 3) Stato e diagnostica

- `GET /api/status`: ora espone `total_documents`, `total_activities`, `wrapper_documents`.
- `GET /api/diagnose/db`: mostra DB effettivo e conteggi documenti/attivita.
- `GET /api/test-db`: check rapido con conteggi DB.

Questo serve a capire subito se il runtime sta leggendo il DB giusto.

### 4) Self-healing wrapper

File: `lib/db/maintenance.ts`

Durante maintenance:

1. trova wrapper docs
2. migra in documenti canonici (`migrateGarminWrapperDocuments`)
3. opzionalmente elimina i wrapper origine
4. normalizza `activityId`
5. rimuove duplicati
6. sincronizza index

Endpoint manuale di supporto:

- `POST /api/activities/garmin/migrate-wrapper`
- supporta dry-run/apply
- supporta protezione con `MIGRATION_API_SECRET`

---

## Produzione: vale anche li?

Si, il codice e unico: stesso flusso local/prod.

Pero il comportamento dipende da env runtime:

- `MONGODB_URI`
- `MONGODB_DB_NAME`
- `MONGODB_AUTO_MAINTENANCE`
- opzionale `MIGRATION_API_SECRET`

Nota importante: in questa sessione e stata verificata l'esecuzione locale e una esecuzione production-like locale con `NODE_ENV=production`. Non e stato eseguito un deploy live in hosting production da questa sessione.

---

## Verifica effettuata per il target production `mz-exploration`

Verifiche eseguite in questa sessione:

1. build di produzione eseguita con successo (`npm run build`)
2. istanza avviata in modalita production-like su porta dedicata
3. env runtime verificato con:
   - `MONGODB_DB_NAME = mz-exploration`
   - `NODE_ENV = production`
4. DB effettivo verificato con `/api/diagnose/db`:
   - `database.name = mz-exploration`
   - `documentsCount = 170`
   - `activitiesCount = 170`
   - `wrapperDocumentsCount = 0`
5. endpoint principali verificati:
   - `GET /api/activities/garmin` -> success, 170/170
   - `GET /api/activities/all` -> success, 170
   - `GET /api/activities/[id]` -> success
   - `GET /api/status` -> success

### Nota importante sulla configurazione production

Dai test eseguiti, `dbName` viene rispettato anche se la URI contiene un altro database nel path.

Pero la raccomandazione operativa resta questa:

- in produzione imposta **entrambi** coerentemente:
  - `MONGODB_URI=.../mz-exploration?...`
  - `MONGODB_DB_NAME=mz-exploration`

Questo evita ambiguita future.

---

## Perche vedevi attivita "inesistenti"

Cause principali viste in questo ciclo:

1. runtime puntava al DB sbagliato
2. cache client/browser mostrava dati precedenti
3. processo dev precedente ancora in esecuzione

Mitigazioni applicate:

- allineamento env al DB target
- disattivazione cache running in dev
- fetch no-store in demo
- diagnostica DB piu esplicita

---

## Cosa controllare prima di andare in release

Checklist minima:

1. `MONGODB_DB_NAME=mz-exploration`
2. `MONGODB_URI` coerente con `mz-exploration`
3. `MONGODB_AUTO_MAINTENANCE=true` se vuoi self-healing automatico
4. test endpoint:
   - `/api/diagnose/env`
   - `/api/diagnose/db`
   - `/api/status`
   - `/api/activities/garmin`
5. se arrivano wrapper raw nel DB, opzionalmente testare dry-run su `/api/activities/garmin/migrate-wrapper`

---

## Garanzia su cambi futuri (proposta operativa)

Per evitare cambi non richiesti in futuro, propongo questo patto operativo:

1. prima: mini design in markdown (max 1 pagina) con impatto file
2. poi: implementazione solo dei file approvati
3. infine: check con endpoint diagnostici + output atteso

Se vuoi, nel prossimo step aggiungo anche una sezione "Change Control" nel README con questo workflow e una checklist di approvazione.

