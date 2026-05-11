# Color Palette

Single source of truth: `app/globals.css`.

## Obiettivo

- Avere un solo posto dove definire i colori.
- Sapere subito l'impatto di una modifica.
- Evitare hardcode (`slate-*`, `blue-*`, `black`, `white`) nei componenti.

## Naming Convention

- `--color-ref-*` -> palette base (raw)
- `--color-role-*` -> ruoli UI globali (surface/text/border)
- `--color-comp-*` -> varianti per componente
- `--gradient-page-*` -> sfondi pagina
- `--color-brand-*` -> alias business leggibili

## Sezioni e impatto

### 1) Reference Tokens (`ref`)

**Quando toccarli:** quando vuoi cambiare i colori sorgente del tema.

**Impatto:** alto (propagazione a cascata).

Token principali:

- `--color-ref-white`
- `--color-ref-ink`
- `--color-ref-slate-50`
- `--color-ref-slate-100`
- `--color-ref-slate-300`
- `--color-ref-slate-600`
- `--color-ref-slate-700`
- `--color-ref-slate-800`
- `--color-ref-slate-900`
- `--color-ref-slate-950`
- `--color-ref-sky-50`
- `--color-ref-sky-100`
- `--color-ref-crimson-600`
- `--color-ref-crimson-500`
- `--color-ref-pear-500`
- `--color-ref-pear-100`
- `--color-ref-pear-900`

### 2) Role Tokens (`role`)

**Quando toccarli:** quando vuoi cambiare comportamento globale (es. tutti i testi secondari, tutte le superfici soft).

**Impatto:** medio-alto.

Token principali:

- `--color-role-surface-base`
- `--color-role-surface-soft`
- `--color-role-surface-muted`
- `--color-role-surface-strong`
- `--color-role-surface-stronger`
- `--color-role-text-primary`
- `--color-role-text-secondary`
- `--color-role-text-inverse`
- `--color-role-border-soft`
- `--color-role-border-strong`

### 3) Component Tokens (`comp`)

**Quando toccarli:** quando vuoi modificare solo una famiglia di componenti.

**Impatto:** mirato.

Famiglie presenti:

- Card tones (`--color-comp-tone-*`)
- Stripe (`--color-comp-stripe-*`)
- Header (`--color-comp-header-*`)
- Footer (`--color-comp-footer-*`)
- Modal / ActivityDetailModal (`--color-comp-modal-*`)
- BadgeChip (`--color-comp-badge-*`)
- Divider (`--color-comp-divider-*`)
- Hero (`--color-comp-hero-*`)

### 4) Page Backgrounds (`gradient-page`)

**Quando toccarli:** quando vuoi cambiare lo sfondo macro delle pagine.

**Impatto:** alto su tutte le pagine che usano `PageShell`.

- `--gradient-page-white` -> bianco sfumato
- `--gradient-page-sky` -> celestino sfumato
- `--gradient-page-navy` -> navy

### 5) Brand Aliases (`brand`)

**Quando toccarli:** quando vuoi mantenere naming business stabile senza esporre token tecnici.

**Impatto:** variabile (dipende dagli alias usati nel codice).

- `--color-brand-navy`
- `--color-brand-navy-strong`
- `--color-brand-sky`
- `--color-brand-sky-strong`
- `--color-brand-crimson`
- `--color-brand-crimson-strong`
- `--color-brand-pear`
- `--color-brand-pear-soft`

## Compatibilita Legacy

I token shadcn (`--color-background`, `--color-card`, `--color-border`, ecc.) restano attivi per compatibilita durante la migrazione graduale.

## Workflow consigliato

1. Parti da Storybook -> sezione `Color Palette` (preview dinamica runtime).
2. Scegli il livello giusto (`ref`, `role`, `comp`, `page`, `brand`).
3. Modifica solo i token necessari in `app/globals.css`.
4. Verifica i componenti impattati in Storybook.


