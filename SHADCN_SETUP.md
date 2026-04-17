# shadcn/ui Setup - Stato attuale

Aggiornato: 2026-04-17

## Stato integrazione
- shadcn/ui e` attivo nel progetto.
- Componenti principali presenti in `components/ui/`.
- Utility classi presente in `lib/utils.ts`.
- Tema centralizzato in `app/globals.css`.

## Font e tema (stato reale)
- In `app/layout.tsx` sono caricati `Geist` e `Geist_Mono`.
- `Geist_Mono` ha `preload: false` per evitare preload non usato.
- In `app/globals.css` il body usa:

```css
font-family: var(--font-sans), Arial, Helvetica, sans-serif;
```

Quindi il font principale e` quello di Next (`--font-sans`) con fallback classico.

## Componenti UI gia presenti
- `button.tsx`
- `card.tsx`
- `input.tsx`
- `label.tsx`
- `select.tsx`
- `carousel.tsx`

## Aggiunta nuovi componenti
```bash
npx shadcn-ui@latest add <component-name> --yes
```

## Note operative
- Evitare override locali dei token globali se non necessari.
- Se noti warning font preload in dev, verifica `layout.tsx` e hard refresh browser.
- Mantieni i componenti custom in `components/` separati da `components/ui/`.

## Verifica rapida
```bash
npm run dev
```

Apri:
- `/components-demo`
- `/exploration/running`

per controllare varianti button/card/select/carousel con tema corrente.
