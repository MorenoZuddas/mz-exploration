# Strategia sito - MZ Exploration

Aggiornata: 2026-04-17

## Stato di partenza
- Sezioni pubbliche presenti: home, about, exploration, running, trekking, trips, contact.
- Pipeline dati attivita` disponibile via API Garmin + MongoDB.
- Associazione foto attivita` disponibile via Cloudinary.
- Area autenticata completa e policy pubblico/privato: ancora da consolidare.

## Obiettivo prodotto
Separare chiaramente:
- esperienza pubblica vetrina (storytelling + highlights),
- esperienza personale/tecnica (dettagli attivita, filtri avanzati, gestione dati).

## Priorita` suggerite
1. Rendere la home realmente data-driven (metriche aggregate da API).
2. Uniformare le card Running/Trekking/Trips con stesso standard visivo.
3. Definire policy di visibilita` (campi pubblici vs campi privati).
4. Aggiungere una pagina tecnica amministrativa separata per sync/import/debug.

## Running (pubblico)
Mostrare:
- ultime attivita` ordinate per data,
- card con foto quando presenti,
- metriche aggregate (km, durata, numero sessioni).

Nascondere (o rinviare ad area privata):
- dettagli sensibili per singola attivita,
- strumenti di manutenzione DB/API.

## Running (tecnico/admin)
Mantenere in area dedicata:
- upload JSON,
- dedup/normalize/index,
- diagnostica sync foto.

## Trekking e Trips
- replicare schema Running: preview pubblica + dettaglio progressivo.
- priorita` a contenuti foto/mappa e narrativa prima di metriche tecniche.

## KPI di avanzamento
- card ordinate per data in tutte le sezioni attivita.
- riduzione errori lint critici.
- zero discrepanze tra API payload e valori mostrati a FE.
- documentazione aggiornata ad ogni modifica di endpoint/flow.

## Regola operativa
Ogni nuova feature deve aggiornare nello stesso branch:
- `README.md`
- `docs/API_README.md`
- eventuale runbook specifico in `docs/`
