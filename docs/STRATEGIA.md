# Strategia sito vetrina
Aggiornata: Aprile 2026 | Fase 1 completata
---
## Struttura pubblica vs privata
SITO VETRINA (No Login):
- Home (statistiche aggregate reali da DB)
- Chi Sono
- Running (preview + equipment)
- Trekking (preview + equipment)
- Trips (preview mappa + storie)
- Contatti
AREA RISERVATA (Login richiesto):
- Dashboard personale
- Running completa (filtri, dati, pace, calorie)
- Trekking completa (traccia GPX, note)
- Trips (itinerari, costi, note)
- Profilo
- Equipment (modifica/aggiungi)
---
## Cosa mostrare nella vetrina pubblica
### Home
- Statistiche aggregate reali dal DB (km corsi, trekking, paesi, anni attivita)
### Running
- Gallery con foto corse
- Statistiche aggregate (totale corse, km, preferenza strada/trail)
- Top 3 locations
- Preview attrezzatura con link a Equipment page
### Trekking
- Foto montagne
- Top 5 escursioni con foto hero
- Montagne preferite (lista + mappa)
- Preview attrezzatura
### Trips
- Mappa interattiva paesi visitati
- Card per ogni trip: nome, paese, periodo, 1-2 foto, descrizione breve (max 50 parole)
Dati da nascondere (solo dopo login): pace personale, calorie, filtri dettagliati, costi, itinerari completi, note private.
---
## Roadmap
### Fase 1 - COMPLETATA
- Pagina Equipment Running e Trekking
- Link nelle sezioni corrispondenti
### Fase 2 - Prioritaria
- [ ] Gallery/foto alle sezioni
- [ ] Mappa interattiva Trips
- [ ] Home con statistiche reali da DB
- [ ] Preview pubblica delle attivita
### Fase 3 - Opzionale
- [ ] Dashboard area riservata
- [ ] Certificati/achievement
- [ ] Blog trip reports
- [ ] Timeline attivita
---
## Consigli implementativi
1. Foto di qualita: aumentano l'engagement piu di qualsiasi feature
2. Mappa Trips: elemento di maggior impatto visivo per i visitatori
3. Statistiche reali: calcolare dal DB, non hardcoded
4. CTA chiari: "Scopri di piu" porta al login per i dettagli
5. SEO: descrizioni dettagliate per i Trips
6. Equipment: predisposto per link affiliati futuri
