"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import type { ButtonTone, ButtonVariant } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardMedia, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Carousel,
  CarouselCards,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselGap,
} from "@/components/ui/carousel"
import Loader from "@/components/Loader"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import { Modal } from "@/components/Modal"
import type { ApiPhoto } from "@/components/Modal"
import { BadgeChip, type BadgeChipType } from "@/components/BadgeChip"
import { ActivityPhotos } from "@/components/ActivityPhotos"
import { ActivityClickHandler } from "@/components/ActivityClickWrapper"
import { Filter, type FilterConfig, type FilterType } from "@/components/Filter"
import { Statistics, type StatisticsMetricKey } from "@/components/Statistics"
import { AnimatedSection } from "@/components/generic/AnimatedSection"
import { CardGrid, type CardGridItem } from "@/components/generic/CardGrid"
import { Divider } from "@/components/generic/Divider"
import { Hero } from "@/components/generic/Hero"
import { Text } from "@/components/generic/Text"

type Tone = "current" | "blue" | "purple" | "black"
type HeroAlign = "center" | "left" | "right"
type CardVariant = "default" | "horizontal" | "vertical"
type CardSize = "sm" | "md" | "lg"

const BTN_VARIANTS: ButtonVariant[] = ["default", "destructive", "outline", "secondary", "ghost", "link"]
const BTN_TONES: ButtonTone[] = ["current", "blue", "purple", "black", "navy", "white", "transparent-white"]
const CARD_VARIANTS: CardVariant[] = ["default", "horizontal", "vertical"]
const CARD_TONES: Tone[] = ["current", "blue", "purple", "black"]
const CARD_SIZES: CardSize[] = ["sm", "md", "lg"]
const HERO_ALIGNS: HeroAlign[] = ["center", "left", "right"]
const HERO_SIZES = {
  little: "text-2xl sm:text-3xl",
  medium: "text-3xl sm:text-4xl lg:text-5xl",
  large: "text-4xl sm:text-5xl lg:text-6xl",
  extralarge: "text-5xl sm:text-6xl lg:text-7xl",
} as const
const SUBTITLE_SIZES = {
  little: "text-sm sm:text-base",
  medium: "text-base sm:text-lg lg:text-xl",
  large: "text-lg sm:text-xl lg:text-2xl",
  extralarge: "text-xl sm:text-2xl lg:text-3xl",
} as const
const LOADER_TONES: Tone[] = ["current", "blue", "purple", "black"]
const LOADER_SIZES = ["sm", "md", "lg"] as const
const BADGE_TYPES: BadgeChipType[] = ["running", "trekking", "trip", "books", "photo", "music"]
const BG_OPTIONS = {
  navy: "bg-slate-900",
  black: "bg-black",
  blue: "bg-blue-900",
  purple: "bg-violet-900",
  white: "bg-white",
} as const
type BgKey = keyof typeof BG_OPTIONS
const DIVIDER_ICON_TYPES = ["running", "trekking", "trip", "books", "photo", "music", "default"] as const
const FILTER_TYPES: FilterType[] = ["dateStart", "dateEnd", "activityType", "distanceMin", "distanceMax", "durationMin", "durationMax", "location", "pace"]
const TEXT_TONES = ["current", "blue", "purple", "black", "navy", "white"] as const
const TEXT_VARIANTS = ["title", "subtitle", "body", "caption", "overline"] as const
const TEXT_SIZES = ["xs", "sm", "md", "lg", "xl", "2xl", "3xl", "4xl"] as const
const TEXT_WEIGHTS = ["normal", "medium", "semibold", "bold", "extrabold"] as const
const TEXT_TAGS = ["h1", "h2", "h3", "h4", "h5", "p", "span", "div"] as const
const TEXT_ALIGNS = ["left", "center", "right", "justify"] as const
const TEXT_POSITIONS = ["left", "center", "right"] as const
const STAT_METRICS_ALL: StatisticsMetricKey[] = [
  "pb_100",
  "pb_200",
  "pb_400",
  "pb_800",
  "pb_1000",
  "pb_1500",
  "pb_2000",
  "pb_5000",
  "pb_10000",
  "pb_half",
  "pb_marathon",
  "total_activities",
  "total_runs",
  "total_trekkings",
  "total_distance",
  "total_distance_runs",
  "longest_run",
  "total_running_hours",
  "total_trekking_hours",
]

const MOCK_PHOTOS = [
  {
    public_id: "storybook/photo-1",
    secure_url: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
    width: 1200,
    height: 800,
  },
  {
    public_id: "storybook/photo-2",
    secure_url: "https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&cs=tinysrgb&w=1200",
    width: 1200,
    height: 800,
  },
  {
    public_id: "storybook/photo-3",
    secure_url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
    width: 1200,
    height: 800,
  },
] as const

function Ctl<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly T[] | T[]
  onChange: (v: T) => void
}) {
  return (
    <label className="flex flex-col gap-1 text-xs">
      <span className="uppercase tracking-wider text-slate-400 font-semibold">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="h-8 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </label>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-2 text-xs">
      <span className="uppercase tracking-wider text-slate-400 font-semibold">{label}</span>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4" />
    </label>
  )
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="py-8 border-b border-slate-200 dark:border-slate-800">
      <h2 className="text-xl font-bold mb-4">{title}</h2>
      {children}
    </section>
  )
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900">{children}</div>
}

function PropsLegend({ items }: { items: Array<{ prop: string; values: string[] }> }) {
  return (
    <Panel>
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Variabili disponibili</p>
      <div className="space-y-1.5 text-xs">
        {items.map((item) => (
          <p key={item.prop}>
            <span className="font-semibold text-slate-700 dark:text-slate-200">{item.prop}:</span>{" "}
            <span className="text-slate-500">{item.values.join(" | ")}</span>
          </p>
        ))}
      </div>
    </Panel>
  )
}

const STORYBOOK_NAV = [
  { id: "activity-components", label: "Activity Components" },
  { id: "animated", label: "AnimatedSection" },
  { id: "badge-chip", label: "Badge / Chip" },
  { id: "button", label: "Button" },
  { id: "card", label: "Card" },
  { id: "cardgrid", label: "CardGrid" },
  { id: "carousel", label: "Carousel" },
  { id: "divider", label: "Divider" },
  { id: "filter", label: "Filter" },
  { id: "header-footer", label: "Header + Footer" },
  { id: "hero", label: "Hero" },
  { id: "input-select", label: "Input + Select" },
  { id: "loader", label: "Loader" },
  { id: "modal", label: "Modal" },
  { id: "statistics-single", label: "Statistics - Single Test" },
  { id: "statistics", label: "Statistics + Filter Sync" },
  { id: "text", label: "Text" },
]

function StorybookSidebar() {
  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-6 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Componenti (A-Z)</p>
        <nav className="space-y-1.5">
          {STORYBOOK_NAV.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="block text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </aside>
  )
}

function CardSection() {
  const [variant, setVariant] = useState<CardVariant>("default")
  const [tone, setTone] = useState<Tone>("current")
  const [size, setSize] = useState<CardSize>("md")
  const [withImage, setWithImage] = useState(true)
  const [imagePos, setImagePos] = useState<"top" | "left">("top")
  const [animated, setAnimated] = useState(true)
  const [b1v, setB1v] = useState<ButtonVariant>("default")
  const [b1t, setB1t] = useState<ButtonTone>("blue")
  const [b2v, setB2v] = useState<ButtonVariant>("ghost")
  const [b2t, setB2t] = useState<ButtonTone>("current")
  const [dataName, setDataName] = useState("storybook-card")
  const [customClass, setCustomClass] = useState("")
  const body = (
    <Card
      variant={variant}
      tone={tone}
      size={size}
      dataName={dataName || undefined}
      className={`${variant === "horizontal" && withImage ? "overflow-hidden" : ""} ${customClass}`.trim()}
    >
      {withImage && variant !== "horizontal" && imagePos === "top" ? <div className="h-28 bg-gradient-to-r from-blue-600 to-violet-600" /> : null}
      {withImage && variant === "horizontal" ? <CardMedia className="w-28 bg-gradient-to-b from-blue-600 to-violet-600" /> : null}
      {withImage && variant !== "horizontal" && imagePos === "left" ? <div className="w-24 bg-gradient-to-b from-blue-600 to-violet-600" /> : null}
      <div className={withImage && (variant === "horizontal" || imagePos === "left") ? "flex-1" : ""}>
        <CardHeader>
          <CardTitle>Card demo</CardTitle>
          <CardDescription>Con immagine, animazione e footer configurabile.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">Variant {variant} - Tone {tone} - Size {size}</p>
        </CardContent>
        <CardFooter className="gap-2">
          <Button variant={b1v} tone={b1t} size="sm">
            Primaria
          </Button>
          <Button variant={b2v} tone={b2t} size="sm">
            Secondaria
          </Button>
        </CardFooter>
      </div>
    </Card>
  )

  return (
    <Section id="card" title="Card">
      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        <Panel>
          <div className="grid gap-2">
            <Ctl label="variant" value={variant} options={CARD_VARIANTS} onChange={setVariant} />
            <Ctl label="tone" value={tone} options={CARD_TONES} onChange={setTone} />
            <Ctl label="size" value={size} options={CARD_SIZES} onChange={setSize} />
            {variant !== "horizontal" ? <Ctl label="image position" value={imagePos} options={["top", "left"]} onChange={setImagePos} /> : null}
            <Toggle label="show image" checked={withImage} onChange={setWithImage} />
            <Toggle label="animated section" checked={animated} onChange={setAnimated} />
            <Ctl label="btn1 variant" value={b1v} options={BTN_VARIANTS} onChange={setB1v} />
            <Ctl label="btn1 tone" value={b1t} options={BTN_TONES} onChange={setB1t} />
            <Ctl label="btn2 variant" value={b2v} options={BTN_VARIANTS} onChange={setB2v} />
            <Ctl label="btn2 tone" value={b2t} options={BTN_TONES} onChange={setB2t} />
            <label className="flex flex-col gap-1 text-xs">
              <span className="uppercase tracking-wider text-slate-400 font-semibold">dataName</span>
              <input value={dataName} onChange={(e) => setDataName(e.target.value)} className="h-8 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="uppercase tracking-wider text-slate-400 font-semibold">className</span>
              <input value={customClass} onChange={(e) => setCustomClass(e.target.value)} className="h-8 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
            </label>
          </div>
        </Panel>
        <Panel>
          <AnimatedSection disabled={!animated} once={false}>
            <div className="max-w-xl">{body}</div>
          </AnimatedSection>
        </Panel>
      </div>
      <div className="mt-4">
        <PropsLegend
          items={[
            { prop: "variant", values: [...CARD_VARIANTS] },
            { prop: "tone", values: [...CARD_TONES] },
            { prop: "size", values: [...CARD_SIZES] },
            { prop: "imagePos", values: ["top", "left"] },
            { prop: "CardMedia", values: ["slot immagine per horizontal"] },
            { prop: "button.variant", values: [...BTN_VARIANTS] },
            { prop: "button.tone", values: [...BTN_TONES] },
            { prop: "dataName", values: ["string"] },
            { prop: "className", values: ["string"] },
          ]}
        />
      </div>
    </Section>
  )
}

function HeroSection() {
  const [titleColor, setTitleColor] = useState<Tone>("current")
  const [subtitleColor, setSubtitleColor] = useState<Tone>("current")
  const [align, setAlign] = useState<HeroAlign>("center")
  const [titleSize, setTitleSize] = useState<keyof typeof HERO_SIZES>("medium")
  const [subtitleSize, setSubtitleSize] = useState<keyof typeof SUBTITLE_SIZES>("medium")

  return (
    <Section id="hero" title="Hero">
      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        <Panel>
          <div className="grid gap-2">
            <Ctl label="title color" value={titleColor} options={CARD_TONES} onChange={setTitleColor} />
            <Ctl label="subtitle color" value={subtitleColor} options={CARD_TONES} onChange={setSubtitleColor} />
            <Ctl label="align" value={align} options={HERO_ALIGNS} onChange={setAlign} />
            <Ctl label="title size" value={titleSize} options={Object.keys(HERO_SIZES) as Array<keyof typeof HERO_SIZES>} onChange={setTitleSize} />
            <Ctl label="subtitle size" value={subtitleSize} options={Object.keys(SUBTITLE_SIZES) as Array<keyof typeof SUBTITLE_SIZES>} onChange={setSubtitleSize} />
          </div>
        </Panel>
        <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <Hero
            useVideo={false}
            posterSrc="https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777467700/cagliar_dallalto_-_stefano_garau_-_shutterstock.com__1_mzsy2n.jpg"
            heightClassName="h-[36vh]"
            titleColor={titleColor}
            subtitleColor={subtitleColor}
            contentAlign={align}
            titleClassName={HERO_SIZES[titleSize]}
            subtitleClassName={SUBTITLE_SIZES[subtitleSize]}
          />
        </div>
      </div>
      <div className="mt-4">
        <PropsLegend
          items={[
            { prop: "titleColor", values: [...CARD_TONES] },
            { prop: "subtitleColor", values: [...CARD_TONES] },
            { prop: "contentAlign", values: [...HERO_ALIGNS] },
            { prop: "titleSize", values: Object.keys(HERO_SIZES) },
            { prop: "subtitleSize", values: Object.keys(SUBTITLE_SIZES) },
          ]}
        />
      </div>
    </Section>
  )
}

function makeItems(total: number): CardGridItem[] {
  const kind: Array<"running" | "trekking" | "trip"> = ["running", "trekking", "trip"]
  return Array.from({ length: total }).map((_, i) => {
    const day = ((i % 28) + 1)
    const dateObj = new Date(2026, 3, day)
    const dateStr = dateObj.toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })
    return {
      id: `item-${i + 1}`,
      title: `Item ${i + 1}`,
      href: "#",
      type: kind[i % 3],
      date: dateStr,
      description: `Descrizione card ${i + 1}`,
      image:
        i % 3 === 0
          ? "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80"
          : i % 3 === 1
            ? "https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&cs=tinysrgb&w=800"
            : "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80",
    }
  })
}

function makeActivityItems(total: number): CardGridItem[] {
   return Array.from({ length: total }).map((_, i) => {
     const day = (i % 28) + 1
     const dateObj = new Date(2026, 3, day)
     const dateStr = dateObj.toLocaleDateString("it-IT", { year: "numeric", month: "long", day: "numeric" })
     const km = (6 + i * 1.3).toFixed(2)
     // Nota: Non includiamo 'image' per le activity card poiché la foto viene mostrata solo nella modale
     // Usiamo 'hasPhoto' per mostrare il badge "Foto" sulla card
     const withPhoto = i % 3 !== 0
     return {
       id: `activity-${i + 1}`,
       title: `Running Activity ${i + 1}`,
       href: "#",
       type: i % 4 === 0 ? "track_running" : "running",
       date: dateStr,
       distance: `${km} km`,
       duration: `${42 + i}:${String((i * 7) % 60).padStart(2, "0")}`,
       pace: `5:${String((i * 5) % 60).padStart(2, "0")} min/km`,
       kcal: `${450 + i * 12}`,
       hasPhoto: withPhoto,
     }
   })
 }

function CardGridSection() {
   const [total, setTotal] = useState("8")
   const [visible, setVisible] = useState("4")
   const [maxCards, setMaxCards] = useState("")
   const [tone, setTone] = useState<Tone>("current")
   const [variant, setVariant] = useState<"default" | "activity">("default")
   const [badgePos, setBadgePos] = useState<"border" | "date-row">("border")
   const [badgeSize, setBadgeSize] = useState<"small" | "medium" | "large">("small")
   const [badgeRounded, setBadgeRounded] = useState(true)
   const [activityTextColor, setActivityTextColor] = useState<Tone>("current")
   const [showDate, setShowDate] = useState(true)
   const [showBadge, setShowBadge] = useState(true)
   const [showBadgeOnImage, setShowBadgeOnImage] = useState(false)
   const [showDesc, setShowDesc] = useState(false)
   const items = useMemo(() => (variant === "activity" ? makeActivityItems(Number(total)) : makeItems(Number(total))), [total, variant])

  return (
    <Section id="cardgrid" title="CardGrid">
      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        <Panel>
           <div className="grid gap-2">
             <Ctl label="tone" value={tone} options={CARD_TONES} onChange={setTone} />
             <Ctl label="variant" value={variant} options={["default", "activity"]} onChange={setVariant} />
             {variant === "activity" && (
               <>
                 <Ctl label="photo badge pos" value={badgePos} options={["border", "date-row"]} onChange={(v) => setBadgePos(v as "border" | "date-row")} />
                 <Ctl label="photo badge size" value={badgeSize} options={["small", "medium", "large"]} onChange={(v) => setBadgeSize(v as "small" | "medium" | "large")} />
                 <Ctl label="activity text color" value={activityTextColor} options={CARD_TONES} onChange={(v) => setActivityTextColor(v as Tone)} />
                 <Toggle label="photo badge rounded" checked={badgeRounded} onChange={setBadgeRounded} />
               </>
             )}
             <Ctl label="total cards" value={total} options={["3", "4", "6", "8", "10", "12"]} onChange={setTotal} />
             <Ctl label="visible cards" value={visible} options={["3", "4", "6", "8", "10", "12"]} onChange={setVisible} />
             <Ctl label="maxCards" value={maxCards} options={["", "1", "2", "3", "4", "6", "8"]} onChange={setMaxCards} />
             <Toggle label="show date" checked={showDate} onChange={setShowDate} />
             <Toggle label="show badge" checked={showBadge} onChange={setShowBadge} />
             <Toggle label="badge on image" checked={showBadgeOnImage} onChange={setShowBadgeOnImage} />
             <Toggle label="show desc" checked={showDesc} onChange={setShowDesc} />
           </div>
        </Panel>
         <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
           <CardGrid
             title="CardGrid riusabile"
             subtitle={`Totali ${total}${maxCards ? `, max ${maxCards}` : `, visibili ${visible}`}`}
             items={items}
             variant={variant}
             tone={tone}
             visibleItems={maxCards ? undefined : Number(visible)}
             showVisibilityToggle={!maxCards}
             showMoreLabel="Mostra tutte"
             showLessLabel="Mostra meno"
             useMotion={false}
             showDate={showDate}
             showTypeBadge={variant === "default" ? showBadge : false}
             showBadgeOnImage={showBadgeOnImage}
             showDescription={variant === "default" ? showDesc : false}
             maxCards={maxCards ? Number(maxCards) : undefined}
             activityPhotoBadgePosition={variant === "activity" ? badgePos : undefined}
             activityPhotoBadgeSize={variant === "activity" ? badgeSize : undefined}
             activityPhotoBadgeRounded={variant === "activity" ? badgeRounded : undefined}
             activityTextColor={variant === "activity" ? activityTextColor : undefined}
             sectionClassName="px-6 py-8 bg-white dark:bg-slate-900"
           />
         </div>
      </div>

       <Panel>
         <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
           <p className="font-semibold uppercase tracking-wider">📅 Data attività:</p>
           <p>Le card mostrano la data dell&apos;attività nel formato italiano (es: &quot;1 aprile 2026&quot;). Utilizza il toggle <span className="font-medium">&quot;show date&quot;</span> per mostrare o nascondere le date sulle card.</p>
           <p><span className="font-medium">&quot;badge on image&quot;</span> sposta il BadgeChip dalla riga titolo alla parte alta della foto (overlay).</p>
           <p><span className="font-medium">Variant &quot;activity&quot;</span>: card per attività running con foto opzionale, titolo, data, distanza e tempo.</p>
           <p className="mt-3 font-semibold uppercase tracking-wider">🎲 maxCards:</p>
           <p>La prop <span className="font-medium">maxCards</span> limita il numero di card visualizzate in modo diretto (senza toggle &quot;Mostra tutte&quot;). Utile per mostrare un numero fisso di card, es: 4 card per riga. Lascia vuoto per usare il sistema di pagina con toggle.</p>
         </div>
       </Panel>

       <div className="mt-4">
         <PropsLegend
           items={[
             { prop: "tone", values: [...CARD_TONES] },
             { prop: "variant", values: ["default", "activity"] },
             { prop: "total cards", values: ["3", "4", "6", "8", "10", "12"] },
             { prop: "visible cards", values: ["3", "4", "6", "8", "10", "12"] },
             { prop: "maxCards", values: ["", "1", "2", "3", "4", "6", "8"] },
             { prop: "activityPhotoBadgePosition", values: ["border", "date-row"] },
             { prop: "activityPhotoBadgeSize", values: ["small", "medium", "large"] },
             { prop: "activityPhotoBadgeRounded", values: ["true", "false"] },
             { prop: "activityTextColor", values: [...CARD_TONES] },
             { prop: "showDate", values: ["true", "false"] },
             { prop: "showTypeBadge", values: ["true", "false"] },
             { prop: "showBadgeOnImage", values: ["true", "false"] },
             { prop: "showDescription", values: ["true", "false"] },
           ]}
         />
       </div>
    </Section>
  )
}

function CarouselSection() {
  const [orientation, setOrientation] = useState<"horizontal" | "vertical">("horizontal")
  const [gap, setGap] = useState<CarouselGap>("md")
  const [perView, setPerView] = useState<"1" | "2" | "3" | "4">("3")
  const [loop, setLoop] = useState(false)
  const [controls, setControls] = useState(true)
  const [mode, setMode] = useState<"items" | "children">("items")
  const slides = useMemo(() => Array.from({ length: 8 }, (_, i) => i + 1), [])

  return (
    <Section id="carousel" title="Carousel">
      <div className="grid lg:grid-cols-[320px_1fr] gap-4 mb-4">
        <Panel>
          <div className="grid gap-2">
            <Ctl label="mode" value={mode} options={["items", "children"]} onChange={setMode} />
            <Ctl label="orientation" value={orientation} options={["horizontal", "vertical"]} onChange={setOrientation} />
            <Ctl label="gap" value={gap} options={["sm", "md", "lg"] as CarouselGap[]} onChange={setGap} />
            <Ctl label="cards/view" value={perView} options={["1", "2", "3", "4"]} onChange={setPerView} />
            <Toggle label="show controls" checked={controls} onChange={setControls} />
            <Toggle label="loop" checked={loop} onChange={setLoop} />
          </div>
        </Panel>
        <Panel>
          <div className={orientation === "vertical" ? "h-[320px]" : ""}>
            {mode === "items" ? (
              <CarouselCards
                items={slides}
                orientation={orientation}
                gap={gap}
                cardsPerView={Number(perView) as 1 | 2 | 3 | 4}
                showControls={controls}
                opts={{ align: "start", loop }}
                className={orientation === "vertical" ? "h-full" : ""}
                renderItem={(n) => (
                  <Card className="h-36">
                    <CardHeader>
                      <CardTitle>Slide {n}</CardTitle>
                      <CardDescription>Mode items</CardDescription>
                    </CardHeader>
                  </Card>
                )}
              />
            ) : (
              <CarouselCards
                orientation={orientation}
                gap={gap}
                cardsPerView={Number(perView) as 1 | 2 | 3 | 4}
                showControls={controls}
                opts={{ align: "start", loop }}
                className={orientation === "vertical" ? "h-full" : ""}
              >
                {slides.map((n) => (
                  <Card key={n} className="h-36">
                    <CardHeader>
                      <CardTitle>Slide {n}</CardTitle>
                      <CardDescription>Mode children</CardDescription>
                    </CardHeader>
                  </Card>
                ))}
              </CarouselCards>
            )}
          </div>
        </Panel>
      </div>

      <Panel>
        <p className="text-sm mb-3">Core API variant (Carousel + CarouselContent + CarouselItem)</p>
        <Carousel opts={{ align: "start", loop: true }} className="px-10" gap="sm">
          <CarouselContent>
            {Array.from({ length: 6 }).map((_, i) => (
              <CarouselItem key={i} className="basis-1/2 md:basis-1/3">
                <div className="h-24 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                  Core {i + 1}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious tone="blue" />
          <CarouselNext tone="blue" />
        </Carousel>
      </Panel>
      <div className="mt-4">
        <PropsLegend
          items={[
            { prop: "mode", values: ["items", "children"] },
            { prop: "orientation", values: ["horizontal", "vertical"] },
            { prop: "gap", values: ["sm", "md", "lg"] },
            { prop: "cardsPerView", values: ["1", "2", "3", "4"] },
            { prop: "loop", values: ["true", "false"] },
            { prop: "showControls", values: ["true", "false"] },
          ]}
        />
      </div>
    </Section>
  )
}

function DividerSection() {
  const [tone, setTone] = useState<Tone>("current")
  const [size, setSize] = useState<"sm" | "md" | "lg">("md")
  const [iconType, setIconType] = useState<typeof DIVIDER_ICON_TYPES[number]>("running")

  return (
    <Section id="divider" title="Divider">
      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        <Panel>
          <div className="grid gap-2">
            <Ctl label="icon type" value={iconType} options={[...DIVIDER_ICON_TYPES]} onChange={setIconType} />
            <Ctl label="tone" value={tone} options={CARD_TONES} onChange={setTone} />
            <Ctl label="size" value={size} options={["sm", "md", "lg"]} onChange={setSize} />
          </div>
        </Panel>
        <Panel>
          <Divider
            iconType={iconType}
            tone={tone}
            size={size}
            backgroundClassName="bg-white dark:bg-slate-900"
          />
        </Panel>
      </div>
      <div className="mt-4">
        <PropsLegend
          items={[
            { prop: "tone", values: [...CARD_TONES] },
            { prop: "size", values: ["sm", "md", "lg"] },
            { prop: "iconType", values: [...DIVIDER_ICON_TYPES] },
          ]}
        />
      </div>
    </Section>
  )
}

function BasicSections() {
  const [selected, setSelected] = useState("")
  const [showLoader, setShowLoader] = useState(false)
  const [loaderTone, setLoaderTone] = useState<Tone>("purple")
  const [loaderSize, setLoaderSize] = useState<(typeof LOADER_SIZES)[number]>("md")

  return (
    <>
      <Section id="button" title="Button">
        <Panel>
          <p className="text-xs text-slate-500 mb-3">Combinazioni variant x tone</p>
          <div className="space-y-2 mb-4">
            {BTN_VARIANTS.map((variant) => (
              <div key={variant} className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
                {BTN_TONES.map((tone) => (
                  <div key={`${variant}-${tone}`} className={tone === "white" || tone === "transparent-white" ? "bg-slate-900 p-2 rounded" : "p-2"}>
                    <Button variant={variant} tone={tone} size="sm" className="w-full">
                      {variant}
                    </Button>
                  </div>
                ))}
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-500 mb-2">Combinazioni size</p>
          <div className="flex flex-wrap items-end gap-2">
            {(["xs", "sm", "default", "lg", "xl", "icon"] as const).map((size) => (
              <Button key={size} size={size} tone="blue">
                {size === "icon" ? ">" : size}
              </Button>
            ))}
          </div>
        </Panel>
        <div className="mt-4">
          <PropsLegend
            items={[
              { prop: "variant", values: [...BTN_VARIANTS] },
              { prop: "tone", values: [...BTN_TONES] },
              { prop: "size", values: ["xs", "sm", "default", "lg", "xl", "icon"] },
            ]}
          />
        </div>
      </Section>

      <Section id="input-select" title="Input + Select">
        <div className="grid md:grid-cols-2 gap-4">
          <Panel>
            <Label htmlFor="sb-input">Input</Label>
            <Input id="sb-input" placeholder="Testo" className="mt-2" />
          </Panel>
          <Panel>
            <Label>Select</Label>
            <Select value={selected} onValueChange={setSelected}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Scegli..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="run">Running</SelectItem>
                <SelectItem value="trk">Trekking</SelectItem>
                <SelectItem value="trip">Trip</SelectItem>
              </SelectContent>
            </Select>
          </Panel>
        </div>
        <div className="mt-4">
          <PropsLegend
            items={[
              { prop: "Input.type", values: ["text", "email", "password", "number", "search", "tel", "url"] },
              { prop: "Select.value", values: ["run", "trk", "trip"] },
            ]}
          />
        </div>
      </Section>

      <Section id="loader" title="Loader">
        <div className="grid lg:grid-cols-[320px_1fr] gap-4">
          <Panel>
            <div className="grid gap-2">
              <Ctl label="tone" value={loaderTone} options={LOADER_TONES} onChange={setLoaderTone} />
              <Ctl label="size" value={loaderSize} options={LOADER_SIZES} onChange={setLoaderSize} />
              <Button
                tone="purple"
                onClick={() => {
                  setShowLoader(true)
                  setTimeout(() => setShowLoader(false), 1800)
                }}
              >
                Mostra loader fullscreen
              </Button>
            </div>
          </Panel>
          <Panel>
            <p className="text-xs text-slate-500 mb-3">Combinazioni tone x size</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {LOADER_TONES.map((tone) =>
                LOADER_SIZES.map((size) => (
                  <div key={`${tone}-${size}`} className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-white dark:bg-slate-950">
                    <InlineLoader tone={tone} size={size} />
                    <p className="text-[11px] mt-2 text-center text-slate-500">
                      {tone} / {size}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Panel>
          {showLoader ? <Loader tone={loaderTone} size={loaderSize} /> : null}
        </div>
        <div className="mt-4">
          <PropsLegend items={[{ prop: "tone", values: [...LOADER_TONES] }, { prop: "size", values: [...LOADER_SIZES] }]} />
        </div>
      </Section>
    </>
  )
}

function InlineLoader({ tone, size }: { tone: Tone; size: (typeof LOADER_SIZES)[number] }) {
  const toneClass = {
    current: { primary: "border-t-blue-600 border-r-blue-600", secondary: "border-b-blue-400" },
    blue: { primary: "border-t-blue-600 border-r-blue-600", secondary: "border-b-blue-400" },
    purple: { primary: "border-t-violet-700 border-r-violet-700", secondary: "border-b-violet-400" },
    black: {
      primary: "border-t-slate-900 border-r-slate-900 dark:border-t-slate-100 dark:border-r-slate-100",
      secondary: "border-b-slate-500 dark:border-b-slate-300",
    },
  }[tone]

  const sizeClass = {
    sm: { wrapper: "w-10 h-10", inner: "inset-1.5" },
    md: { wrapper: "w-14 h-14", inner: "inset-2" },
    lg: { wrapper: "w-20 h-20", inner: "inset-3" },
  }[size]

  return (
    <div className={`relative mx-auto ${sizeClass.wrapper}`}>
      <div className={`absolute inset-0 border-4 border-transparent ${toneClass.primary} rounded-full animate-spin`} />
      <div
        className={`absolute ${sizeClass.inner} border-4 border-transparent ${toneClass.secondary} rounded-full animate-spin`}
        style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
      />
    </div>
  )
}

function HeaderFooterSection() {
  const [tone, setTone] = useState<Tone>("current")
  const [headerBg, setHeaderBg] = useState<BgKey>("navy")
  const [footerBg, setFooterBg] = useState<BgKey>("navy")

  const headerIsWhite = headerBg === "white"
  const computedHeaderTone: Tone = headerIsWhite ? "black" : tone

  return (
    <Section id="header-footer" title="Header + Footer">
      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        <Panel>
          <div className="grid gap-2">
            <Ctl label="tone" value={tone} options={CARD_TONES} onChange={setTone} />
            <Ctl label="header bg" value={headerBg} options={Object.keys(BG_OPTIONS) as BgKey[]} onChange={setHeaderBg} />
            <Ctl label="footer bg" value={footerBg} options={Object.keys(BG_OPTIONS) as BgKey[]} onChange={setFooterBg} />
          </div>
        </Panel>
        <div className="space-y-4">
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <Header
              tone={computedHeaderTone}
              backgroundClassName={BG_OPTIONS[headerBg]}
              className={headerIsWhite ? "text-slate-900 border-b-2 border-slate-900" : ""}
            />
          </div>
          <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
            <Footer
              tone={tone}
              backgroundClassName={BG_OPTIONS[footerBg]}
              className={footerBg === "white" ? "mt-0 text-slate-900" : "mt-0"}
            />
          </div>
        </div>
      </div>
      <div className="mt-4">
        <PropsLegend
          items={[
            { prop: "tone", values: [...CARD_TONES] },
            { prop: "header.backgroundClassName", values: Object.keys(BG_OPTIONS) },
            { prop: "footer.backgroundClassName", values: Object.keys(BG_OPTIONS) },
            { prop: "header rule", values: ["if white bg -> navy border + navy text"] },
          ]}
        />
      </div>
    </Section>
  )
}

function ActivityComponentsSection() {
  const [tone, setTone] = useState<Tone>("current")
  const [columns, setColumns] = useState<"2" | "3" | "4">("3")

  return (
    <Section id="activity-components" title="Activity Components (Modal, Wrapper, Photos)">
      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        <Panel>
          <div className="grid gap-2">
            <Ctl label="tone" value={tone} options={CARD_TONES} onChange={setTone} />
            <Ctl label="photo columns" value={columns} options={["2", "3", "4"]} onChange={setColumns} />
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <p className="text-xs text-slate-500 mb-2">ActivityPhotos</p>
            <ActivityPhotos photos={[...MOCK_PHOTOS]} columns={Number(columns) as 2 | 3 | 4} tone={tone} />
          </Panel>

          <Panel>
            <p className="text-xs text-slate-500 mb-2">ActivityClickWrapper</p>
            <ActivityClickHandler activityId="storybook-demo-id" detailsPageUrl="/exploration/running" tone={tone}>
              <Card className="max-w-sm cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle>Apri dettaglio activity</CardTitle>
                  <CardDescription>Desktop apre modal, mobile naviga alla pagina dettaglio.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Click su questa card per testare il wrapper.</p>
                </CardContent>
              </Card>
            </ActivityClickHandler>
          </Panel>
        </div>
      </div>
      <div className="mt-4">
        <PropsLegend
          items={[
            { prop: "ActivityPhotos.columns", values: ["2", "3", "4"] },
            { prop: "ActivityPhotos.tone", values: [...CARD_TONES] },
            { prop: "ActivityClickHandler.activityId", values: ["string"] },
            { prop: "ActivityClickHandler.detailsPageUrl", values: ["string"] },
            { prop: "ActivityClickHandler.tone", values: [...CARD_TONES] },
          ]}
        />
      </div>
    </Section>
  )
}

function ModalSection() {
  const [isOpen, setIsOpen] = useState(false)
  const [tone, setTone] = useState<Tone>("current")
  const [activityId, setActivityId] = useState("")
  const [detailsUrl, setDetailsUrl] = useState("/exploration/running")
  const [className, setClassName] = useState("")
  const [contentClassName, setContentClassName] = useState("")
  const [withFallbackPhoto, setWithFallbackPhoto] = useState(false)
  const [availableIds, setAvailableIds] = useState<string[]>([])

  useEffect(() => {
    let cancelled = false
    const loadIds = async () => {
      try {
        const response = await fetch("/api/activities/all")
        if (!response.ok) return
        const payload = await response.json()
        const activities = Array.isArray(payload?.data?.activities) ? payload.data.activities : []
        const ids = activities
          .map((item: { _id?: string; id?: string | number }) => String(item?._id ?? item?.id ?? ""))
          .filter((id: string) => id.length > 0)
          .slice(0, 30)
        if (cancelled) return
        setAvailableIds(ids)
        if (!activityId && ids.length > 0) {
          setActivityId(ids[0])
        }
      } catch {
        if (!cancelled) setAvailableIds([])
      }
    }
    void loadIds()
    return () => {
      cancelled = true
    }
  }, [activityId])

  const fallbackPhoto: ApiPhoto | null = withFallbackPhoto
    ? {
        publicId: "storybook/modal-fallback",
        secureUrl: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80",
        width: 1200,
        height: 800,
      }
    : null

  return (
    <Section id="modal" title="Modal">
      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        <Panel>
          <div className="grid gap-2">
            <Ctl label="tone" value={tone} options={CARD_TONES} onChange={setTone} />
            {availableIds.length > 0 ? <Ctl label="activityId preset" value={activityId} options={availableIds} onChange={setActivityId} /> : null}
            <label className="flex flex-col gap-1 text-xs">
              <span className="uppercase tracking-wider text-slate-400 font-semibold">activityId</span>
              <input value={activityId} onChange={(e) => setActivityId(e.target.value)} className="h-8 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="uppercase tracking-wider text-slate-400 font-semibold">detailsPageUrl</span>
              <input value={detailsUrl} onChange={(e) => setDetailsUrl(e.target.value)} className="h-8 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="uppercase tracking-wider text-slate-400 font-semibold">className</span>
              <input value={className} onChange={(e) => setClassName(e.target.value)} className="h-8 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
            </label>
            <label className="flex flex-col gap-1 text-xs">
              <span className="uppercase tracking-wider text-slate-400 font-semibold">contentClassName</span>
              <input value={contentClassName} onChange={(e) => setContentClassName(e.target.value)} className="h-8 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
            </label>
            <Toggle label="fallback photo" checked={withFallbackPhoto} onChange={setWithFallbackPhoto} />
            <Toggle label="isOpen" checked={isOpen} onChange={setIsOpen} />
            <Button tone="blue" onClick={() => setIsOpen(true)}>
              Apri modal
            </Button>
            {availableIds.length === 0 ? <p className="text-[11px] text-amber-600">Nessun preset ID disponibile dall&apos;API. Inserisci activityId manualmente.</p> : null}
          </div>
        </Panel>
        <Panel>
          <p className="text-sm text-slate-500">Modal con le stesse props di ActivityDetailModal, pronta per sostituzione diretta.</p>
        </Panel>
      </div>
      <div className="mt-4">
        <PropsLegend
          items={[
            { prop: "activityId", values: ["string"] },
            { prop: "isOpen", values: ["boolean"] },
            { prop: "onClose", values: ["function"] },
            { prop: "detailsPageUrl", values: ["string"] },
            { prop: "photo", values: ["ApiPhoto | null"] },
            { prop: "className", values: ["string"] },
            { prop: "contentClassName", values: ["string"] },
            { prop: "tone", values: [...CARD_TONES] },
          ]}
        />
      </div>

      <Modal
        activityId={activityId}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        detailsPageUrl={detailsUrl}
        photo={fallbackPhoto}
        className={className}
        contentClassName={contentClassName}
        tone={tone}
      />
    </Section>
  )
}

function BadgeChipSection() {
  const [type, setType] = useState<BadgeChipType>("running")
  const [text, setText] = useState("Badge custom")
  const [size, setSize] = useState<"small" | "medium" | "large">("medium")
  const [rounded, setRounded] = useState(true)
  const [floating, setFloating] = useState(false)
  const [position, setPosition] = useState<"top-left" | "top-center" | "top-right">("top-right")

  return (
    <Section id="badge-chip" title="Badge / Chip">
      <div className="grid lg:grid-cols-[320px_1fr] gap-4">
        <Panel>
          <div className="grid gap-2">
            <Ctl label="type" value={type} options={BADGE_TYPES} onChange={setType} />
            <Ctl label="size" value={size} options={["small", "medium", "large"]} onChange={setSize} />
            <Toggle label="rounded" checked={rounded} onChange={setRounded} />
            <Toggle label="floating" checked={floating} onChange={setFloating} />
            <Ctl label="position" value={position} options={["top-left", "top-center", "top-right"]} onChange={setPosition} />
            <label className="flex flex-col gap-1 text-xs">
              <span className="uppercase tracking-wider text-slate-400 font-semibold">text</span>
              <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="h-8 px-2 rounded border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
            </label>
          </div>
        </Panel>
        <Panel>
          <div className="mb-4 relative h-16 border border-dashed border-slate-300 rounded-lg p-2">
            <BadgeChip type={type} text={text} size={size} rounded={rounded} floating={floating} position={position} />
          </div>
          <div className="flex flex-wrap gap-2">
            {BADGE_TYPES.map((badgeType) => (
              <BadgeChip key={badgeType} type={badgeType} size={size} rounded={rounded} />
            ))}
          </div>
        </Panel>
      </div>
      <div className="mt-4">
        <PropsLegend
          items={[
            { prop: "type", values: [...BADGE_TYPES] },
            { prop: "text", values: ["string"] },
            { prop: "size", values: ["small", "medium", "large"] },
            { prop: "rounded", values: ["true", "false"] },
            { prop: "floating", values: ["true", "false"] },
            { prop: "position", values: ["top-left", "top-center", "top-right"] },
          ]}
        />
      </div>
    </Section>
  )
}

function FilterSection() {
  const [selectedFilters, setSelectedFilters] = useState<FilterType[]>(["dateStart", "activityType"])
  const [tone, setTone] = useState<Tone>("current")
  const [demoState, setDemoState] = useState<{ [key: string]: string }>({})

  const availableFilters: Array<{ type: FilterType; label: string; placeholder?: string; options?: Array<{ value: string; label: string }> }> = [
    {
      type: "dateStart",
      label: "Data inizio",
      placeholder: "Seleziona una data",
    },
    {
      type: "dateEnd",
      label: "Data fine",
      placeholder: "Seleziona una data",
    },
    {
      type: "activityType",
      label: "Tipo attività",
      options: [
        { value: "running", label: "Running" },
        { value: "trekking", label: "Trekking" },
        { value: "trip", label: "Trip" },
      ],
    },
    {
      type: "distanceMin",
      label: "Distanza minima (km)",
      placeholder: "Es. 5",
    },
    {
      type: "distanceMax",
      label: "Distanza massima (km)",
      placeholder: "Es. 20",
    },
    {
      type: "durationMin",
      label: "Durata minima (min)",
      placeholder: "Es. 30",
    },
    {
      type: "durationMax",
      label: "Durata massima (min)",
      placeholder: "Es. 120",
    },
    {
      type: "location",
      label: "Luogo",
      placeholder: "Es. Sardegna",
    },
    {
      type: "pace",
      label: "Pace (min/km)",
      placeholder: "Es. 5",
    },
  ]

  const selectedFilterConfigs = availableFilters.filter((f) => selectedFilters.includes(f.type))

  return (
    <Section id="filter" title="Filter">
      <div className="grid lg:grid-cols-[320px_1fr] gap-4 mb-4">
        <Panel>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Filtri attivi</p>
          <div className="mb-3">
            <Ctl label="tone" value={tone} options={CARD_TONES} onChange={setTone} />
          </div>
          <div className="space-y-1.5">
            {FILTER_TYPES.map((type) => (
              <label key={type} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedFilters.includes(type)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFilters([...selectedFilters, type])
                    } else {
                      setSelectedFilters(selectedFilters.filter((t) => t !== type))
                    }
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm">{availableFilters.find((f) => f.type === type)?.label}</span>
              </label>
            ))}
          </div>
        </Panel>
        <Panel>
          <p className="text-xs text-slate-500 mb-3">
            Componente Filter riusabile: configura quale filtri mostrare tramite prop &quot;filters&quot;.
          </p>
          <pre className="text-[10px] bg-slate-900 text-slate-100 p-2 rounded overflow-x-auto">
            {JSON.stringify(demoState, null, 2)}
          </pre>
        </Panel>
      </div>

      {selectedFilterConfigs.length > 0 && (
        <Panel>
          <Filter
            filters={selectedFilterConfigs}
            tone={tone}
            onFilterChange={setDemoState}
            onReset={() => setDemoState({})}
            resetLabel="Ripristina"
            applyLabel="Applica filtri"
          />
        </Panel>
      )}

      <div className="mt-4">
        <PropsLegend
          items={[
            { prop: "filters", values: ["Array<FilterConfig>"] },
            { prop: "onFilterChange", values: ["(state: FilterState) => void"] },
            { prop: "onReset", values: ["() => void"] },
            { prop: "FilterType", values: [...FILTER_TYPES] },
            { prop: "FilterConfig.type", values: [...FILTER_TYPES] },
            { prop: "FilterConfig.options (optional)", values: ["Array<{value, label}>"] },
          ]}
        />
      </div>
    </Section>
  )
}

function TextSection() {
  const [variant, setVariant] = useState<typeof TEXT_VARIANTS[number]>("title")
  const [tag, setTag] = useState<typeof TEXT_TAGS[number]>("h2")
  const [tone, setTone] = useState<typeof TEXT_TONES[number]>("current")
  const [size, setSize] = useState<typeof TEXT_SIZES[number]>("xl")
  const [weight, setWeight] = useState<typeof TEXT_WEIGHTS[number]>("bold")
  const [align, setAlign] = useState<typeof TEXT_ALIGNS[number]>("left")
  const [position, setPosition] = useState<typeof TEXT_POSITIONS[number]>("left")

  return (
    <Section id="text" title="Text">
      <div className="grid lg:grid-cols-[320px_1fr] gap-4 mb-4">
        <Panel>
          <div className="grid gap-2">
            <Ctl label="variant" value={variant} options={[...TEXT_VARIANTS]} onChange={setVariant} />
            <Ctl label="tag" value={tag} options={[...TEXT_TAGS]} onChange={setTag} />
            <Ctl label="tone" value={tone} options={[...TEXT_TONES]} onChange={setTone} />
            <Ctl label="size" value={size} options={[...TEXT_SIZES]} onChange={setSize} />
            <Ctl label="weight" value={weight} options={[...TEXT_WEIGHTS]} onChange={setWeight} />
            <Ctl label="align" value={align} options={[...TEXT_ALIGNS]} onChange={setAlign} />
            <Ctl label="position" value={position} options={[...TEXT_POSITIONS]} onChange={setPosition} />
          </div>
        </Panel>
        <Panel>
          <div className="min-h-[140px] flex w-full">
            <Text variant={variant} as={tag} tone={tone} size={size} weight={weight} align={align} position={position}>
              Testo demo: variant {variant}, tag {tag}
            </Text>
          </div>
          <div className="mt-4 space-y-2">
            {TEXT_VARIANTS.map((v) => (
              <Text key={v} variant={v} tone="current">
                Variante {v}
              </Text>
            ))}
          </div>
        </Panel>
      </div>
      <PropsLegend
        items={[
          { prop: "variant", values: [...TEXT_VARIANTS] },
          { prop: "as/tag", values: [...TEXT_TAGS] },
          { prop: "tone", values: [...TEXT_TONES] },
          { prop: "size", values: [...TEXT_SIZES] },
          { prop: "weight", values: [...TEXT_WEIGHTS] },
          { prop: "align", values: [...TEXT_ALIGNS] },
          { prop: "position", values: [...TEXT_POSITIONS] },
        ]}
      />
    </Section>
  )
}

function StatisticsSingleTestSection() {
  const [backgroundColor, setBackgroundColor] = useState<"white" | "blue" | "purple" | "navy" | "slate">("white")
  const [tone, setTone] = useState<"current" | "blue" | "purple" | "black">("blue")
  const [columns, setColumns] = useState<"2" | "3" | "4">("4")
  const [metrics, setMetrics] = useState<StatisticsMetricKey[]>([
    "pb_1000",
    "pb_5000",
    "total_runs",
    "longest_run",
    "total_distance_runs",
    "total_running_hours",
  ])

  const toggleMetric = (metric: StatisticsMetricKey, enabled: boolean) => {
    if (enabled) {
      setMetrics((prev) => (prev.includes(metric) ? prev : [...prev, metric]))
    } else {
      setMetrics((prev) => prev.filter((m) => m !== metric))
    }
  }

  return (
    <Section id="statistics-single" title="Statistics - Single Component Test">
      <div className="grid lg:grid-cols-[320px_1fr] gap-4 mb-4">
        <Panel>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Display Options</p>
          <div className="grid gap-2 mb-4">
            <Ctl label="background color" value={backgroundColor} options={["white", "blue", "purple", "navy", "slate"]} onChange={(v) => setBackgroundColor(v as "white" | "blue" | "purple" | "navy" | "slate")} />
            <Ctl label="tone" value={tone} options={CARD_TONES} onChange={setTone} />
            <Ctl label="columns" value={columns} options={["2", "3", "4"]} onChange={(v) => setColumns(v as "2" | "3" | "4")} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 border-t border-slate-200 dark:border-slate-700 pt-3">Metrics</p>
          <div className="space-y-1.5 max-h-[220px] overflow-auto pr-1">
            {STAT_METRICS_ALL.map((metric) => (
              <label key={metric} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={metrics.includes(metric)}
                  onChange={(e) => toggleMetric(metric, e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">{metric}</span>
              </label>
            ))}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <p className="text-xs text-slate-500 mb-3">✨ <span className="font-semibold">NUOVO:</span> Prova il componente Statistics singolo</p>
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc list-inside">
              <li>Modifica background, tone e colonne a sinistra</li>
              <li>Aggiungi/rimuovi metriche tramite checkbox</li>
              <li>Clicca su un PB o &quot;Run Più Lunga&quot; per navigare all&apos;attività</li>
              <li>Vedi la data dell&apos;attività sopra la metrica</li>
            </ul>
          </Panel>

          <Panel>
            <Statistics
              metrics={metrics}
              tone={tone}
              backgroundColor={backgroundColor}
              columns={Number(columns) as 2 | 3 | 4}
              fetchIfMissing
              endpoint="/api/activities/all"
            />
          </Panel>
        </div>
      </div>

      <div className="mt-4">
        <PropsLegend
          items={[
            { prop: "metrics", values: ["StatisticsMetricKey[]"] },
            { prop: "backgroundColor", values: ["white", "blue", "purple", "navy", "slate"] },
            { prop: "tone", values: [...CARD_TONES] },
            { prop: "columns", values: ["2", "3", "4"] },
            { prop: "fetchIfMissing", values: ["true | false"] },
            { prop: "endpoint", values: ["string (URL API)"] },
          ]}
        />
      </div>
    </Section>
  )
}

function StatisticsSection() {
  const [channel] = useState("storybook-running")
  const [metrics, setMetrics] = useState<StatisticsMetricKey[]>([
    "total_runs",
    "longest_run",
    "total_distance_runs",
    "total_running_hours",
  ])
  const [backgroundColor, setBackgroundColor] = useState<"white" | "blue" | "purple" | "navy" | "slate">("white")
  const [tone, setTone] = useState<"current" | "blue" | "purple" | "black">("blue")
  const [columns, setColumns] = useState<"2" | "3" | "4">("4")

  const toggleMetric = (metric: StatisticsMetricKey, enabled: boolean) => {
    if (enabled) {
      setMetrics((prev) => (prev.includes(metric) ? prev : [...prev, metric]))
    } else {
      setMetrics((prev) => prev.filter((m) => m !== metric))
    }
  }

  const filterConfig: FilterConfig[] = [
    { type: "dateStart", label: "Data inizio" },
    { type: "dateEnd", label: "Data fine" },
    {
      type: "activityType",
      label: "Tipo attivita",
      options: [
        { value: "running", label: "Running" },
        { value: "track_running", label: "Track Running" },
        { value: "trekking", label: "Trekking" },
      ],
    },
    { type: "distanceMin", label: "Distanza min (km)", placeholder: "Distanza min (km)" },
    { type: "distanceMax", label: "Distanza max (km)", placeholder: "Distanza max (km)" },
  ]

  return (
    <Section id="statistics" title="Statistics">
      <div className="grid lg:grid-cols-[320px_1fr] gap-4 mb-4">
        <Panel>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3">Controlli</p>
          <div className="grid gap-2 mb-4">
            <Ctl label="background color" value={backgroundColor} options={["white", "blue", "purple", "navy", "slate"]} onChange={(v) => setBackgroundColor(v as "white" | "blue" | "purple" | "navy" | "slate")} />
            <Ctl label="tone" value={tone} options={CARD_TONES} onChange={setTone} />
            <Ctl label="columns" value={columns} options={["2", "3", "4"]} onChange={(v) => setColumns(v as "2" | "3" | "4")} />
          </div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2 border-t border-slate-200 dark:border-slate-700 pt-3">Metriche visibili</p>
          <div className="space-y-1.5 max-h-[220px] overflow-auto pr-1">
            {STAT_METRICS_ALL.map((metric) => (
              <label key={metric} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={metrics.includes(metric)}
                  onChange={(e) => toggleMetric(metric, e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm">{metric}</span>
              </label>
            ))}
          </div>
        </Panel>
        <Panel>
          <p className="text-xs text-slate-500 mb-3">Modalita con comunicazione Filter {'->'} Statistics</p>
          <Filter
            filters={filterConfig}
            tone="blue"
            syncChannel={channel}
            onFilterChange={() => {}}
            resetLabel="Reset"
            applyLabel="Applica"
          />
        </Panel>
      </div>

      <Panel>
        <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
          <p className="font-semibold uppercase tracking-wider mb-2">✨ Nuove Funzionalità:</p>
          <ul className="space-y-2 list-disc list-inside">
            <li><span className="font-medium">Colore sfondo adaptivo:</span> Scegli lo sfondo e il testo si adatterà automaticamente</li>
            <li><span className="font-medium">Formato tempo intelligente:</span> Durate &lt;1h: mm:ss | Durate ≥1h: hh:mm:ss</li>
            <li><span className="font-medium">Click su PB/Run:</span> Clicca su un PB o sulla &quot;Run Piu Lunga&quot; per navigare all&apos;attività (solo su dati reali)</li>
            <li><span className="font-medium">Data attività:</span> Mostra la data di quando è stata registrata la metrica</li>
            <li><span className="font-medium">Sync Filter:</span> Il componente Statistical si aggiorna dinamicamente quando modifichi i filtri</li>
          </ul>
        </div>
      </Panel>

      <Panel>
        <Statistics
          metrics={metrics}
          syncChannel={channel}
          tone={tone}
          backgroundColor={backgroundColor}
          columns={Number(columns) as 2 | 3 | 4}
          fetchIfMissing
          endpoint="/api/activities/all"
        />
      </Panel>

      <div className="mt-4">
        <PropsLegend
          items={[
            { prop: "metrics", values: ["PBs + totals + distance + hours"] },
            { prop: "backgroundColor", values: ["white", "blue", "purple", "navy", "slate"] },
            { prop: "tone", values: [...CARD_TONES] },
            { prop: "columns", values: ["2", "3", "4"] },
            { prop: "activities", values: ["RawActivity[] (optional)"] },
            { prop: "filters", values: ["StatisticsFilters (optional)"] },
            { prop: "syncChannel", values: ["string (opzionale per sync con Filter)"] },
            { prop: "fetchIfMissing", values: ["true | false"] },
            { prop: "endpoint", values: ["/api/activities/all"] },
          ]}
        />
      </div>
    </Section>
  )
}

function AnimatedSectionDemo() {
  const [disabled, setDisabled] = useState(false)
  return (
    <Section id="animated" title="AnimatedSection">
      <Panel>
        <Toggle label="disabled" checked={disabled} onChange={setDisabled} />
        <div className="mt-3">
          <AnimatedSection disabled={disabled} once={false}>
            <Card className="max-w-sm">
              <CardHeader>
                <CardTitle>Animated wrapper</CardTitle>
              </CardHeader>
              <CardContent>Animazione riusabile.</CardContent>
            </Card>
          </AnimatedSection>
        </div>
      </Panel>
    </Section>
  )
}

export default function StorybookPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="max-w-[1500px] mx-auto px-6 py-8 lg:flex lg:gap-6">
        <StorybookSidebar />
        <main className="flex-1 min-w-0">
          <h1 className="text-3xl font-bold mb-2">Storybook - Componenti</h1>
          <p className="text-slate-500 mb-8">Pagina unica con varianti e controlli per tutti i componenti principali.</p>
          <ActivityComponentsSection />
          <AnimatedSectionDemo />
          <BadgeChipSection />
          <BasicSections />
          <CardSection />
          <CardGridSection />
          <CarouselSection />
          <DividerSection />
           <FilterSection />
           <HeaderFooterSection />
           <HeroSection />
           <ModalSection />
           <StatisticsSingleTestSection />
           <StatisticsSection />
           <TextSection />
        </main>
      </div>
    </div>
  )
}


