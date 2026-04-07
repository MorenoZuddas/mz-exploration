import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function ComponentsDemo() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-5xl space-y-8">
        <h1 className="text-4xl font-bold text-foreground">shadcn/ui Components Demo</h1>
        <p className="text-muted-foreground">
          Demo reale di varianti, token tema e card verticali/orizzontali.
        </p>

        {/* ── BUTTON VARIANTS ── */}
        <Card>
          <CardHeader>
            <CardTitle>Button Variants</CardTitle>
            <CardDescription>
              Default e Secondary usano token diversi — hover: leggero lift + shadow.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="default">Default</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-md bg-primary p-3 text-sm text-primary-foreground">
                <strong>Token primary</strong> — azione principale (CTA, pulsanti primari)
              </div>
              <div className="rounded-md bg-secondary p-3 text-sm text-secondary-foreground">
                <strong>Token secondary</strong> — azione secondaria (meno enfatica)
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ── CARD VERTICALI ── */}
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Card Verticali
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Verticale semplice */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Card Verticale — Semplice</CardTitle>
                <CardDescription>Solo testo, struttura classica top-to-bottom.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  La Card è un contenitore neutro: header, content e footer si impilano
                  verticalmente. Orientamento e layout li decidi tu con le classi.
                </p>
              </CardContent>
              <CardFooter>
                <Button size="sm">Azione</Button>
              </CardFooter>
            </Card>

            {/* Verticale con immagine */}
            <Card className="flex flex-col overflow-hidden">
              <div className="h-40 w-full bg-muted" />
              <CardHeader>
                <CardTitle>Card Verticale — Con immagine</CardTitle>
                <CardDescription>Immagine in cima, poi header e content sotto.</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Utile per gallery, blog cards o schede prodotto.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* ── CARD ORIZZONTALE ── */}
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Card Orizzontale
          </p>
          <Card className="flex flex-row items-stretch overflow-hidden">
            <div className="w-40 shrink-0 bg-muted" />
            <div className="flex flex-col">
              <CardHeader>
                <CardTitle>Card Orizzontale — Custom</CardTitle>
                <CardDescription>
                  Immagine a sinistra, contenuto a destra — layout `flex-row` sulla Card.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground">
                  Ottieni il layout orizzontale aggiungendo <code>flex flex-row</code> alla Card
                  e un blocco immagine con larghezza fissa. Nessuna modifica al componente base.
                </p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">Dettagli</Button>
              </CardFooter>
            </div>
          </Card>
        </div>

      </div>
    </div>
  )
}
