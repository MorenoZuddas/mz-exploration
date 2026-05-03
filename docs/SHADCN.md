# shadcn/ui — Setup e utilizzo

## Dipendenze installate

```json
{
  "dependencies": { "@radix-ui/react-slot": "^1.2.4" },
  "devDependencies": {
    "shadcn-ui": "^0.9.5",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "tailwind-merge": "^3.5.0"
  }
}
```

## File creati/modificati

| File | Descrizione |
|------|-------------|
| `components.json` | Configurazione CLI shadcn/ui |
| `components/ui/button.tsx` | Componente Button |
| `components/ui/card.tsx` | Componente Card |
| `lib/utils.ts` | Funzione utility `cn()` |
| `app/globals.css` | Variabili tema usate da shadcn/ui |

> **Font protetti**: Geist (Google Fonts) e Arial rimangono intatti. shadcn/ui non li sovrascrive.

---

## Componenti disponibili

- ✅ `Button` — varianti: `default | secondary | destructive | outline | ghost | link`; size: `xs | sm | default | lg | xl | icon`
- ✅ `Card` — con `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`
- ✅ `Input`, `Label`, `Select`, `Dialog`, `Carousel` (già aggiunti al progetto)

### Aggiungere nuovi componenti

```bash
npx shadcn-ui@latest add [component-name] --yes
```

---

## Utilizzo rapido

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function Example() {
  return (
    <Card>
      <CardHeader><CardTitle>Titolo</CardTitle></CardHeader>
      <CardContent>
        <Button variant="outline" tone="blue">Clicca</Button>
      </CardContent>
    </Card>
  )
}
```

---

## Personalizzazione colori

Modifica le variabili HSL in `app/globals.css`:

```css
:root {
  --primary: 0 0% 9%;       /* Colore primario */
  --secondary: 0 0% 96.1%;  /* Colore secondario */
  --destructive: 0 84.2% 60.2%; /* Rosso */
}
```

Convertitore esadecimale → HSL: https://www.rapidtables.com/convert/color/hex-to-hsl.html

---

## Risorse

- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Radix UI Primitives](https://www.radix-ui.com)
- [Tailwind CSS](https://tailwindcss.com)

