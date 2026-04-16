# 🎯 STRATEGIA SITO VETRINA - mz-grm

## ANALISI ATTUALE
Il sito è ben strutturato con:
- ✅ Homepage accattivante con hero section
- ✅ Sezioni exploration (Running, Trekking, Trips)
- ✅ About (Chi sono)
- ✅ Contatti
- ✅ Sistema di login/registrazione
- ✅ Database con attività reali

---

## 📊 COSA MOSTRARE NELLA VETRINA (PUBBLICO)

### 🏠 HOMEPAGE
**MODIFICARE** le statistiche statiche con dati reali aggregati:
- Somma totale km corsi (calcolare da DB)
- Somma totale km trekking
- Numero paesi visitati
- Anno di attività

```
Esempio:
- 2,000+ km
- 45+ trekking
- 15+ paesi
- Dal 2015
```

### 🏃 SEZIONE RUNNING (PUBBLICA)

**MOSTRA:**
- [ ] Gallery with 5-6 foto delle corse più belle (aggiungere foto)
- [ ] Descrizione: "Amante del running su strada e trail da 10+ anni"
- [ ] Statistiche aggregate:
  - Totale corse: 150+
  - Km totali: 2,000+
  - Preferenza: Running strada 60%, Trail running 40%
- [ ] Top 3 locations dove corro (con mappa)
- [ ] **SEZIONE ATTREZZATURA** (NUOVO ✨):
  - Link alla pagina Equipment
  - Preview di 3 scarpe in highlight
  - "Scopri di più" → Equipment page

**NASCONDI (solo dopo login):**
- ❌ Tutte le attività singole
- ❌ Pace personale
- ❌ Calorie bruciate
- ❌ Filtri per data/tipo
- ❌ Statistiche dettagliate

---

### 🏔️ SEZIONE TREKKING (PUBBLICA)

**MOSTRA:**
- [ ] Foto montagne spettacolari (aggiungere)
- [ ] Descrizione trekking
- [ ] Top 5 escursioni fatte con foto hero
- [ ] Montagne preferite (lista + mappa)
- [ ] **SEZIONE ATTREZZATURA** (NUOVO ✨):
  - Link Equipment page
  - Focus su scarpe e zaino

**NASCONDI (login):**
- ❌ Dettagli di tutte le salite
- ❌ Dati privati

---

### ✈️ SEZIONE TRIPS (PUBBLICA)

**MOSTRA:**
- [ ] Mappa interattiva paesi visitati (IMPORTANTE!)
- [ ] Gallery viaggi (foto paesaggi)
- [ ] Card per ogni trip con:
  - Nome viaggio
  - Paese
  - Periodo
  - 1-2 foto hero
  - Breve descrizione (max 50 parole)
  
Esempio card:
```
"Sulle Dolomiti"
🇮🇹 Italia | Agosto 2024
Trekking tra le Tre Cime di Lavaredo
→ Scopri di più
```

**NASCONDI (login):**
- ❌ Costi
- ❌ Itinerari dettagliati
- ❌ Note personali

---

## 🔐 COSA MOSTRARE DOPO LOGIN

### 🏃 RUNNING COMPLETA
- ✅ Tutte le attività con filtri (com'è ora)
- ✅ Statistiche dettagliate con filtri data/tipo/distanza
- ✅ "My Best" con carousel
- ✅ Equipment completa

### 🏔️ TREKKING COMPLETA
- ✅ Tutte le escursioni dettagliate
- ✅ Mappa con traccia GPX
- ✅ Note personali
- ✅ Equipment

### 📊 DASHBOARD (AREA PROTETTA)
Aggiungere una dashboard riassuntiva con:
- Corse questo mese
- Km totali questo anno
- Ultimi trip
- Statistiche personali

---

## 🛠️ IMPLEMENTAZIONE PRIORITARIA

### FASE 1 (FATTO ✅):
- ✅ Pagina Equipment Running
- ✅ Pagina Equipment Trekking
- ✅ Link nelle pagine corrispondenti

### FASE 2 (CONSIGLIATO):
1. Aggiungere gallery/foto alle sezioni
2. Implementare mappa interattiva Trips
3. Modificare Home con statistiche reali da DB
4. Aggiungere sezione preview nella vetrina pubblica

### FASE 3 (OPZIONALE):
1. Dashboard area riservata
2. Certificati/achievement
3. Blog con trip reports
4. Timeline attività

---

## 🎨 STRUTTURA PUBBLICO vs PRIVATO

```
SITO VETRINA (No Login)
├── Home (statistiche aggregate)
├── Chi Sono
├── Running (preview + equipment)
├── Trekking (preview + equipment)
├── Trips (preview mappa + storie)
└── Contatti

AREA RISERVATA (Login richiesto)
├── Dashboard personale
├── Running completa (filtri, dati)
├── Trekking completa
├── Trips (full details)
├── Profilo
└── Equipment (modifica/aggiungi)
```

---

## 💡 CONSIGLI FINALI

1. **Foto**: Aggiungi foto di qualità per attirare visitatori
2. **Mappa**: Una buona mappa aumenta l'engagement (Trips)
3. **CTA chiaro**: "Scopri di più" → Login necessario
4. **Social proof**: Mostra badge/achievement sulla vetrina
5. **Statistiche reali**: Calcola da DB, non hardcoded
6. **SEO**: Descrizioni dettagliate delle attività (soprattutto Trips)
7. **Equipment**: È una buona idea per la monetizzazione (link affiliati futuri)

---

**Data**: Aprile 2026  
**Stato**: Strategia defined, Phase 1 completata ✅

