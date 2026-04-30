# Component Props Guide

Questa guida descrive come usare, modificare ed estendere i componenti props-based del progetto `mz-exploration`.

## Obiettivo

- Usare componenti riutilizzabili con props consistenti.
- Evitare hardcode di colori/size/layout nelle pagine.
- Mantenere una grammatica comune: `tone`, `size`, `className`, `...ClassName`.

---

## Convenzioni globali

- `tone`: tema colore (`current | blue | purple | black`)
- `size`: taglia componente (`sm | md | lg` o varianti specifiche)
- `className`: override CSS finale
- `...ClassName`: override di una porzione (es. `contentClassName`, `gridClassName`)
- `variant`: stile funzionale (es. `default`, `outline`, `stats`)
- Props legacy (es. `color`) mantenute come alias dove presente

---

## Components UI

## `components/ui/button.tsx`

### Props principali
- `variant`: `default | destructive | outline | secondary | ghost | link`
- `tone`: `current | blue | purple | black`
- `size`: `xs | sm | default | lg | xl | icon`
- `radius`: `sm | default | lg | full | none`
- `width`: `auto | full`
- `asChild`: usa il bottone con `Link`/`a`
- `className`

### Esempi

```tsx
<Button tone="blue" size="lg">Conferma</Button>
<Button variant="outline" tone="purple">Annulla</Button>
<Button asChild width="full">
  <Link href="/exploration">Vai</Link>
</Button>
```

---

## `components/ui/card.tsx`

### Props principali
- `variant`: `default | horizontal | vertical | stats`
- `tone`: `current | blue | purple | black`
- `size`: `sm | md | lg`
- `className`
- `dataName`

### Esempio

```tsx
<Card variant="vertical" tone="blue" size="md" className="hover:shadow-lg" />
```

---

## `components/ui/carousel.tsx`

### Componenti esportati
- `Carousel`
- `CarouselContent`
- `CarouselItem`
- `CarouselPrevious`
- `CarouselNext`
- `CarouselCards` (helper alto livello)

### Props principali (`Carousel`)
- `orientation`: `horizontal | vertical`
- `horizontal`: `boolean` (alias rapido)
- `gap`: `sm | md | lg`
- `opts`, `plugins`, `setApi`, `className`

### Props principali (`CarouselCards`)
- `items?`, `renderItem?` (modalita dati)
- `children?` (modalita composizione)
- `carouselCard` o `cardsPerView`: numero card visibili
  - numero singolo: `1..6`
  - responsive: `{ base?, sm?, md?, lg?, xl? }`
- `showControls`
- `previousButtonProps`, `nextButtonProps`
- `itemClassName`, `contentClassName`

### Esempio

```tsx
<CarouselCards
  horizontal
  carouselCard={{ base: 1, md: 2, lg: 3 }}
  gap="md"
  previousButtonProps={{ tone: 'blue' }}
  nextButtonProps={{ tone: 'blue' }}
>
  <Card />
  <Card />
  <Card />
</CarouselCards>
```

---

## Components Generic

## `components/generic/Hero.tsx`

### Props principali
- `title`, `subtitle`
- `tone` (applica colore a titolo/sottotitolo)
- `titleColor`, `subtitleColor` (compat legacy)
- `useVideo`, `showOverlay`
- `videoMp4Src`, `videoWebmSrc`, `posterSrc`
- `heightClassName`, `overlayClassName`
- `className`, `containerClassName`, `contentClassName`
- `titleClassName`, `subtitleClassName`

### Esempio

```tsx
<Hero
  title="MZ Exploration"
  subtitle="Running, Trekking, Trips"
  tone="current"
  heightClassName="h-[34vh] sm:h-[40vh]"
/>
```

---

## `components/generic/CardGrid.tsx`

### Props principali
- `title`, `subtitle`, `items`
- `tone`, `titleColor`, `subtitleColor`
- `showTypeBadge`, `showDate`, `showDescription`
- `useMotion`
- `fallbackImage`
- `columnsClassName`
- `className`, `containerClassName`, `gridClassName`, `cardClassName`, `imageClassName`
- `sectionClassName`

### Esempio

```tsx
<CardGrid
  title="Ultime avventure"
  tone="blue"
  showDescription
  columnsClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
/>
```

---

## `components/generic/Divider.tsx`

### Props principali
- `tone` (nuovo)
- `color` (legacy alias)
- `size`: `sm | md | lg`
- `symbol`
- `className`, `containerClassName`, `backgroundClassName`

### Esempio

```tsx
<Divider tone="purple" size="sm" symbol="✦" />
```

---

## `components/generic/AnimatedSection.tsx`

### Props principali
- `delay`, `duration`
- `offsetY`
- `once`, `margin`
- `disabled`
- `className`

### Esempio

```tsx
<AnimatedSection delay={0.1} duration={0.5} offsetY={24}>
  <div>Contenuto</div>
</AnimatedSection>
```

---

## Components Root

## `components/Header.tsx`

### Props principali
- `tone`, `backgroundClassName`, `className`
- `logoSrc`, `logoAlt`, `logoWidth`, `logoHeight`
- `aboutLink`, `contactLink`, `explorationLink`
- `explorationItems`

### Esempio

```tsx
<Header
  tone="blue"
  explorationItems={[
    { label: '🏃 Running', href: '/exploration/running' },
    { label: '🥾 Trekking', href: '/exploration/trekking' },
  ]}
/>
```

---

## `components/Footer.tsx`

### Props principali
- `tone`, `backgroundClassName`, `className`
- `logoSrc`, `logoAlt`, `logoWidth`, `logoHeight`
- `navLinks`
- `socialLinks`
- `copyrightText`

### Esempio

```tsx
<Footer
  tone="purple"
  navLinks={[{ label: 'Home', href: '/' }, { label: 'About', href: '/about' }]}
/>
```

---

## `components/Loader.tsx`

### Props principali
- `title`, `subtitle`
- `tone`
- `size`
- `className`

### Esempio

```tsx
<Loader tone="blue" size="sm" title="Carico dati" />
```

---

## `components/ActivityPhotos.tsx`

### Props principali
- `photos`
- `columns`: `2 | 3 | 4`
- `tone`
- `clickable`, `showModal`
- `className`, `gridClassName`, `imageClassName`

### Esempio

```tsx
<ActivityPhotos photos={activity.photos} columns={3} tone="current" />
```

---

## `components/ActivityDetailModal.tsx`

### Props principali
- `activityId`, `isOpen`, `onClose`, `detailsPageUrl`
- `photo`
- `tone`
- `className`, `contentClassName`

### Esempio

```tsx
<ActivityDetailModal
  activityId={id}
  isOpen={isOpen}
  onClose={close}
  detailsPageUrl={`/exploration/running/${id}`}
  tone="blue"
/>
```

---

## `components/ActivityClickWrapper.tsx`

### Props principali
- `activityId`, `detailsPageUrl`
- `children`
- `className`
- `desktopBreakpoint`
- `onDesktopOpen`
- `tone`

### Esempio

```tsx
<ActivityClickHandler
  activityId={id}
  detailsPageUrl={`/exploration/running/${id}`}
  tone="current"
>
  <Card>...</Card>
</ActivityClickHandler>
```

---

## `components/EquipmentPage.tsx`

### Props principali
- `title`, `backUrl`, `items`
- `subtitle`, `backLabel`
- `tone`
- `className`
- `conditionClassMap`

### Esempio

```tsx
<EquipmentPage
  title="Running Equipment"
  backUrl="/exploration/running"
  items={items}
  tone="blue"
  backLabel="← Torna al Running"
/>
```

---

## Come modificare le props esistenti

1. Apri il file del componente (es. `components/generic/Hero.tsx`).
2. Aggiorna l'interfaccia `Props` aggiungendo il nuovo campo opzionale.
3. Definisci default nel destructuring della funzione.
4. Usa la prop in classi/rami logici con fallback sicuro.
5. Mantieni alias legacy se la prop sostituisce un nome vecchio.
6. Aggiorna questa guida.

---

## Come aggiungere una nuova prop (pattern consigliato)

### Esempio: nuova prop `elevation` per Card

```tsx
type CardElevation = 'none' | 'sm' | 'md' | 'lg';

interface CardProps {
  elevation?: CardElevation;
}

const elevationClasses: Record<CardElevation, string> = {
  none: 'shadow-none',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};
```

Poi nel componente:

```tsx
<Card className={cn(elevationClasses[elevation ?? 'sm'])} />
```

---

## Regole per nuove props (importante)

- Preferire props opzionali con default.
- Non rompere API esistenti se non necessario.
- Niente inline style quando possibile: usare mappe classi.
- Se una prop e solo estetica, usa naming `tone`, `size`, `className`.
- Se una prop e comportamentale, usa naming esplicito (`useMotion`, `showOverlay`, `clickable`).

---

## Checklist prima di commit

```bash
cd "/Users/mzuddas/Library/CloudStorage/OneDrive-Deloitte(O365D)/Desktop/Learning/mz-exploration"
npx tsc --noEmit
npm run build
```

Se entrambi passano, il refactor props-based e pronto.

