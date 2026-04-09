"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

type CardType = "vertical-simple" | "vertical-image" | "horizontal"

type CardDemo = {
  id: CardType
  label: string
}

const demos: CardDemo[] = [
  { id: "vertical-simple", label: "Verticale semplice" },
  { id: "vertical-image", label: "Verticale con immagine" },
  { id: "horizontal", label: "Orizzontale" },
]

export function CardTypeCarousel() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Carousel Card
        </p>
        <p className="text-sm text-muted-foreground">
          Le card scorrono in orizzontale senza filtro Select.
        </p>
      </div>

      <Carousel
        orientation="horizontal"
        opts={{ align: "start" }}
        className="mx-auto w-full max-w-4xl"
      >
        <CarouselContent>
          {demos.map((demo) => (
            <CarouselItem key={demo.id} className="md:basis-1/1">
              {demo.id === "vertical-simple" && <VerticalSimpleCard />}
              {demo.id === "vertical-image" && <VerticalImageCard />}
              {demo.id === "horizontal" && <HorizontalCard />}
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}

function VerticalSimpleCard() {
  return (
    <Card className="flex min-h-[320px] flex-col">
      <CardHeader>
        <CardTitle>Card Verticale - Semplice</CardTitle>
        <CardDescription>Testo e CTA in una struttura classica.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground">
          Questa versione e utile quando vuoi contenuto lineare: titolo, descrizione e azione.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Default</Button>
      </CardFooter>
    </Card>
  )
}

function VerticalImageCard() {
  return (
    <Card className="flex min-h-[320px] flex-col overflow-hidden">
      <div className="h-40 w-full bg-muted" />
      <CardHeader>
        <CardTitle>Card Verticale - Con immagine</CardTitle>
        <CardDescription>Header sotto hero visuale.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground">
          Ottima per gallery, articoli o schede esperienza con visual in apertura.
        </p>
      </CardContent>
      <CardFooter>
        <Button size="sm">Default</Button>
      </CardFooter>
    </Card>
  )
}

function HorizontalCard() {
  return (
    <Card className="flex min-h-[320px] flex-col overflow-hidden md:min-h-[220px] md:flex-row">
      <div className="h-40 w-full shrink-0 bg-muted md:h-auto md:w-44" />
      <div className="flex flex-1 flex-col">
        <CardHeader>
          <CardTitle>Card Orizzontale - Custom</CardTitle>
          <CardDescription>Visual a sinistra, contenuto a destra.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground">
            Layout pensato per riassunti rapidi con anteprima visiva e CTA compatta.
          </p>
        </CardContent>
        <CardFooter>
          <Button size="sm">Default</Button>
        </CardFooter>
      </div>
    </Card>
  )
}
