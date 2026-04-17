# Setup shadcn/ui - Summary

Aggiornato: 2026-04-17

## Stato
- Integrazione completata e in uso nel progetto.
- Componenti base disponibili in `components/ui/`.
- Demo disponibile in `app/components-demo/page.tsx`.

## Dipendenze rilevanti
- `shadcn-ui`
- `@radix-ui/react-slot`
- `@radix-ui/react-select`
- `class-variance-authority`
- `clsx`
- `tailwind-merge`
- `embla-carousel-react`

## Font (stato reale)
- Font principali caricati da Next in `app/layout.tsx`.
- `Geist_Mono` non viene preloadato (`preload: false`).
- Body CSS: `var(--font-sans)` con fallback Arial/Helvetica.

## Check rapido suggerito
```bash
npm run dev
```

Controlla:
- `/components-demo`
- `/exploration/running`

## Nota
Questa integrazione UI non sostituisce la pipeline dati: la visualizzazione attivita continua a dipendere dagli endpoint API e dalla projection server-side.
