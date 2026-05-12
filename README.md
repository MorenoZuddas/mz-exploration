# mz-exploration

Web app personale (Next.js + TypeScript) per presentare attività di running, trekking e viaggi.

```yaml
framework: next.js (App Router)
language: typescript
styling: tailwindcss v4
ui: shadcn/ui
database: mongodb
package_manager: npm
```

## Setup locale

```bash
npm install
# Crea .env.local con le variabili MongoDB (vedi docs/GARMIN_DB.md)
npm run dev
```

App: `http://localhost:3000`

## Script

```bash
npm run dev      # sviluppo
npm run build    # build produzione
npm run lint     # linting
```

## Contact

- `app/contact/page.tsx` include:
  - form di ricontatto email (`POST /api/contact`)
  - salvataggio richieste contatto in MongoDB (`contact_messages`)
- Per abilitare il ricontatto, configura in `.env.local`:
  - `MONGODB_URI`
  - `MONGODB_DB_NAME` (in produzione: `mz-experience`)
  - `ADMIN_EMAIL` (es. `morenozuddas1@gmail.com`)
- Se vuoi anche l’invio automatico della notifica email al tuo indirizzo, configura anche:
  - `EMAIL_HOST`
  - `EMAIL_PORT`
  - `EMAIL_USER`
  - `EMAIL_PASSWORD`
  - `EMAIL_FROM` (opzionale: fallback su `EMAIL_USER`)
  - `NOTIFY_EMAIL=true`
- Il messaggio viene sempre salvato su MongoDB; l’email parte solo se SMTP è configurato correttamente.

## Documentazione

| File | Contenuto |
|------|-----------|
| `docs/GARMIN_DB.md` | DB MongoDB, flusso Garmin, API, migrazione, env vars |
| `docs/CONTACT_SETUP.md` | Setup contatti, anti-spam, MongoDB e deploy Vercel |
| `docs/SHADCN.md` | Setup shadcn/ui, componenti disponibili, personalizzazione |
| `docs/COMPONENT_PROPS_GUIDE.md` | Props di tutti i componenti del progetto |
| `docs/STRATEGIA.md` | Struttura pubblica/privata del sito, roadmap |
