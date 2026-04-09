# 📊 Database Verification & Setup Complete

## ✅ Stato Attuale

### Database MongoDB
- **Status**: 🟢 Online e funzionante
- **Attività totali**: 3
- **Sync logs**: 2 (completati con successo)
- **URI**: `mongodb://127.0.0.1:27017/mz-exploration`

### Attività Salvate
1. **Morning Run** 
   - Tipo: Running
   - Distanza: 5km
   - Durata: 30 minuti
   - Data: 8 Aprile 2026
   - Source: Garmin

2. **Evening Cycling**
   - Tipo: Cycling
   - Distanza: 15km
   - Durata: 40 minuti
   - Data: 7 Aprile 2026
   - Source: Garmin

3. **Test Manual**
   - Tipo: Running
   - Distanza: 1.2km
   - Durata: 1 minuto
   - Source: Manual

---

## 🎯 Come Verificare i Dati

### Metodo 1: Via Browser
Vai a `http://localhost:3000/demo-garmin` e clicca su:
- **"Check Status"** - Visualizza il conteggio delle attività
- **"Load Activities"** - Carica la lista completa

### Metodo 2: Via API
```bash
# Verifica status
curl http://localhost:3000/api/status

# Carica attività
curl http://localhost:3000/api/activities/garmin
```

### Metodo 3: Direttamente MongoDB
```bash
mongosh mongodb://127.0.0.1:27017/mz-exploration

# Nel prompt mongosh:
db.activities.countDocuments()
db.activities.find().pretty()
```

---

## 🛠️ Come Aggiungere Attività

### Via UI (Consigliato)
1. Vai a `http://localhost:3000/demo-garmin`
2. Nel pannello a destra "➕ Aggiungi Manualmente"
3. Compila:
   - **Nome**: Descrizione dell'attività
   - **Tipo**: Scegli tra running, cycling, hiking, walking
   - **Data**: Seleziona la data
   - **Distanza**: Inserisci in metri (es: 5000 = 5km)
   - **Durata**: Inserisci in secondi (es: 3600 = 1 ora)
4. Clicca "Add Activity"
5. Clicca "Load Activities" per vedere la lista aggiornata

### Via API (curl)
```bash
curl -X POST http://localhost:3000/api/activities/garmin \
  -H "Content-Type: application/json" \
  -d '[
    {
      "name": "Morning Run",
      "type": "running",
      "date": "2026-04-08T08:00:00Z",
      "distance": 5000,
      "duration": 1800,
      "source": "garmin",
      "fingerprint": "unique_id_123"
    }
  ]'
```

---

## 📋 Prossimi Passi

- [ ] Integrare Strava API
- [ ] Creare endpoint di sync automatico
- [ ] Aggiungere pagina dashboard con grafici
- [ ] Implementare mappa con tracciato GPS
- [ ] Aggiungere filtri per tipo attività

---

## 🔗 Endpoints Disponibili

| Endpoint | Metodo | Descrizione |
|----------|--------|-------------|
| `/api/test-db` | GET | Test connessione database |
| `/api/status` | GET | Stato attuale del database |
| `/api/activities/garmin` | GET | Carica attività |
| `/api/activities/garmin` | POST | Aggiungi/importa attività |
| `/demo-garmin` | GET | Pagina UI gestione attività |

---

## 📝 Note

- ✅ Le attività vengono salvate con deduplicazione (fingerprint)
- ✅ Ogni attività ha un timestamp di creazione e ultima modifica
- ✅ Il database supporta multiple sorgenti: garmin, strava, manual
- ✅ Tutti i log di sync vengono tracciati in `sync_logs`

---

**Setup completato! Il sistema è pronto per l'uso. 🚀**

