# shadcn/ui Setup - Documentazione

## ✅ Configurazione Completata

Ho configurato con successo shadcn/ui nel tuo progetto **mantenendo i font intatti**. Ecco cosa è stato fatto:

---

## 📦 Cosa è Stato Installato

### Dipendenze Aggiunte:
- `shadcn-ui` - CLI e componenti UI
- `class-variance-authority` - Gestione delle varianti di classi
- `clsx` - Utility per gestire classi condizionali
- `tailwind-merge` - Merge intelligente di classi Tailwind
- `@radix-ui/react-slot` - Primitiva Radix UI per composizione componenti

### File Creati:
1. **`components.json`** - Configurazione di shadcn/ui
2. **`components/ui/globals-shadcn.css`** - Variabili CSS per shadcn/ui
3. **`components/ui/button.tsx`** - Componente Button
4. **`components/ui/card.tsx`** - Componente Card
5. **`lib/utils.ts`** - Funzione utility `cn()` per merge di classi

### File Modificati:
1. **`app/globals.css`** - Aggiunto tutte le variabili CSS di shadcn/ui (senza font)
2. **`app/layout.tsx`** - Aggiunto import del file CSS di shadcn/ui

---

## 🎨 I Tuoi Font Rimangono Intatti

✅ **Font Geist** - Importati da Google Fonts e applicati tramite classi
✅ **Font Arial** - Rimane il font-family predefinito nel body
✅ **Nessuna modifica** ai tuoi stili originali

```css
/* app/globals.css - Riga 61-63 */
body {
  background: var(--background);
  color: var(--foreground);
  font-family: Arial, Helvetica, sans-serif;  /* ← INTATTO */
}
```

---

## 🚀 Come Usare shadcn/ui

### 1. Aggiungere Componenti

Puoi aggiungere nuovi componenti usando il CLI:

```bash
npx shadcn-ui@latest add [component-name] --yes
```

Esempio:
```bash
npx shadcn-ui@latest add input --yes
npx shadcn-ui@latest add dialog --yes
npx shadcn-ui@latest add dropdown-menu --yes
```

### 2. Usare i Componenti nel Codice

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MyComponent() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Titolo</CardTitle>
      </CardHeader>
      <CardContent>
        <Button>Clicca qui</Button>
      </CardContent>
    </Card>
  )
}
```

### 3. Varianti Disponibili

#### Button Variants:
```tsx
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

#### Button Sizes:
```tsx
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
<Button size="icon">Icon</Button>
```

---

## 🎯 Componenti Disponibili

I seguenti componenti sono già pronti all'uso:

- ✅ **Button** - Bottone versatile
- ✅ **Card** - Contenitore con header, content, footer
- 📋 **Input** - Campo input
- 📋 **Dialog** - Modal dialog
- 📋 **Dropdown Menu** - Menu dropdown
- 📋 **Select** - Selezione
- 📋 **Checkbox** - Checkbox
- 📋 **Radio** - Radio button
- 📋 **Tabs** - Tab navigation
- 📋 **Toast** - Notifiche toast
- ...e molti altri (aggiungi con il CLI)

---

## 🎨 Personalizzazione Colori

I colori di shadcn/ui sono controllati dalle variabili CSS in `app/globals.css`. Per modificarli, edita le variabili HSL:

```css
:root {
  --primary: 0 0% 9%;                    /* Nero */
  --secondary: 0 0% 96.1%;               /* Grigio chiaro */
  --accent: 0 0% 9%;                     /* Nero */
  --destructive: 0 84.2% 60.2%;         /* Rosso */
  /* ... altre variabili ... */
}
```

Usa questo tool per convertire colori esadecimali a HSL:
https://www.rapidtables.com/convert/color/hex-to-hsl.html

---

## ⚡ Build e Dev

```bash
# Sviluppo
npm run dev

# Build produzione
npm run build

# Start produzione
npm start
```

---

## ✨ Vantaggi di Questa Setup

1. **✅ Font Protetti** - I tuoi font rimangono esattamente come erano
2. **✅ Componenti Pronti** - Accesso a componenti UI professionali
3. **✅ Tailwind Integrato** - shadcn/ui usa Tailwind CSS v4 (che hai già)
4. **✅ Personalizzabile** - Tutti i componenti sono nel tuo repo
5. **✅ Nessun Breaking Change** - Il tuo design attuale rimane intatto

---

## 📝 Prossimi Step

1. **Aggiungere componenti**: `npx shadcn-ui@latest add [component]`
2. **Personalizzare stili**: Modifica le variabili in `app/globals.css`
3. **Creare pagine**: Usa i componenti nelle tue pagine

---

## ❓ Domande Frequenti

**D: Posso usare i font Geist con i componenti shadcn/ui?**
A: Sì! I componenti erediteranno i font dal body. I Geist sono già applicati via classi.

**D: Come cambio i colori?**
A: Modifica le variabili HSL in `app/globals.css` (linee 5-24 e 37-56).

**D: Posso aggiungere nuovi componenti?**
A: Sì, usa `npx shadcn-ui@latest add [component-name]`

**D: I miei vecchi stili verranno sovrascritti?**
A: No, shadcn/ui è completamente isolato. Il tuo design rimane intatto.

---

## 📚 Risorse Utili

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Tailwind CSS](https://tailwindcss.com)
- [Radix UI Primitives](https://www.radix-ui.com)

Buon lavoro! 🚀

