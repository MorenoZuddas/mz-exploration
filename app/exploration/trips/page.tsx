import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { CardGrid, type CardGridItem } from '@/components/generic/CardGrid';
import { Divider } from '@/components/generic/Divider';

interface Trip {
  id: string;
  name: string;
  country: string;
  period: string;
  description: string;
  highlights: string[];
}

const trips: Trip[] = [
  {
    id: 'dolomiti',
    name: 'Dolomiti',
    country: 'Italia',
    period: 'Estate 2024',
    description: 'Trekking in quota tra rifugi e passi alpini.',
    highlights: ['Tre Cime', 'Lago di Braies', 'Rifugi'],
  },
  {
    id: 'barcellona',
    name: 'Barcellona',
    country: 'Spagna',
    period: 'Primavera 2024',
    description: 'City break tra corsa urbana, cultura e mare.',
    highlights: ['Sagrada Familia', 'Barceloneta', 'Montjuic'],
  },
  {
    id: 'parigi',
    name: 'Parigi',
    country: 'Francia',
    period: 'Inverno 2023',
    description: 'Weekend lungo con percorsi running lungo la Senna.',
    highlights: ['Louvre', 'Senna', 'Montmartre'],
  },
  {
    id: 'amsterdam',
    name: 'Amsterdam',
    country: 'Paesi Bassi',
    period: 'Autunno 2023',
    description: 'Esplorazione cittadina tra canali e parchi.',
    highlights: ['Canali', 'Vondelpark', 'Museumsplein'],
  },
  {
    id: 'portogallo',
    name: 'Portogallo',
    country: 'Portogallo',
    period: 'Estate 2022',
    description: 'Road trip tra costa atlantica e centri storici.',
    highlights: ['Lisbona', 'Porto', 'Algarve'],
  },
];

const relatedExplorationCards: CardGridItem[] = [
  {
    id: 'exp-overview',
    title: 'Exploration',
    description: 'Panoramica generale',
    href: '/exploration',
    image: 'https://res.cloudinary.com/derbnvxif/image/upload/v1777886949/MZEXPLORATION_1_vm9xop.png',
  },
  {
    id: 'exp-running-mini',
    title: 'Running',
    description: 'Road to Marathon',
    href: '/exploration/running',
    image: 'https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777450410/running_Large_zorzw2.jpg',
  },
  {
    id: 'exp-trekking-mini',
    title: 'Trekking',
    description: 'Natura e dislivello',
    href: '/exploration/trekking',
    image: 'https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777450410/trekking_h2lev5.jpg',
  },
];

export default function TripsPage() {
  const countries = new Set(trips.map((trip) => trip.country));

  return (
    <main className="min-h-screen bg-sky-50 dark:bg-slate-900 trip-main-1" data-testid="trip-main-1">
      <section className="relative w-full h-[34vh] sm:h-[38vh] overflow-hidden trip-hero-2" data-testid="trip-hero-2">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 trip-hero-background-2"
          style={{
            backgroundImage:
              'url(https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777450410/trips_exvdmu.avif)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/15 trip-hero-overlay-2" />

        <Link
          href="/exploration"
          className="absolute top-6 left-6 sm:left-10 inline-flex items-center gap-1.5 text-white/75 hover:text-white text-sm font-medium transition z-10 trip-back-link-2"
          data-testid="trip-back-link-2"
        >
          ← Exploration
        </Link>

        <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-7 sm:px-10 sm:pb-8 trip-hero-content-2" data-testid="trip-hero-content-2">
          <div className="w-full max-w-2xl space-y-2 mb-5 text-center trip-hero-text-2" data-testid="trip-hero-text-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight trip-title-2" data-testid="trip-title-2">
              Trips
            </h1>
            <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto trip-description-2" data-testid="trip-description-2">
              Una panoramica dei viaggi principali con focus su esperienze outdoor, percorsi e tappe.
            </p>
          </div>

          <div className="flex flex-wrap gap-px overflow-hidden rounded-xl border border-white/15 bg-white/10 backdrop-blur-md w-full max-w-3xl mx-auto trip-stats-bar-2" data-testid="trip-stats-bar-2">
            {[
              { label: 'Trips', value: String(trips.length), testId: 'total' },
              { label: 'Paesi', value: String(countries.size), testId: 'countries' },
              { label: 'Focus', value: 'Travel + Sport', testId: 'focus' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex-1 min-w-[4.5rem] px-4 py-3 flex flex-col gap-0.5 trip-stat-item-2"
                data-testid={`trip-stat-${stat.testId}-2`}
              >
                <span className="text-[10px] uppercase tracking-widest text-white/55 font-semibold trip-stat-label-2">
                  {stat.label}
                </span>
                <span className="text-xl font-bold text-white leading-none trip-stat-value-2">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pt-6 pb-10 sm:px-6 lg:px-8 bg-sky-50 dark:bg-slate-900 trip-cards-section-3" data-testid="trip-cards-section-3">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 trip-cards-grid-3" data-testid="trip-cards-grid-3">
            {trips.map((trip) => (
              <Card
                key={trip.id}
                className="p-5 bg-white dark:bg-slate-900 border-slate-300/80 dark:border-slate-700 trip-card-3"
                data-testid={`trip-card-${trip.id}-3`}
              >
                <h2 className="text-xl font-semibold text-slate-900 dark:text-white trip-card-title-3" data-testid={`trip-card-title-${trip.id}-3`}>
                  {trip.name}
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 trip-card-meta-3" data-testid={`trip-card-meta-${trip.id}-3`}>
                  {trip.country} - {trip.period}
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 mt-3 trip-card-description-3" data-testid={`trip-card-description-${trip.id}-3`}>
                  {trip.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-4 trip-card-highlights-3" data-testid={`trip-card-highlights-${trip.id}-3`}>
                  {trip.highlights.map((item) => (
                    <span
                      key={`${trip.id}-${item}`}
                      className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 trip-highlight-3"
                      data-testid={`trip-highlight-${trip.id}-${item}-3`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <Divider tone="blue" size="sm" data-testid="trip-divider-4" />

      <CardGrid
        title="Categorie"
        subtitle="Continua l'esplorazione"
        items={relatedExplorationCards}
        showTypeBadge={false}
        showDate={false}
        showDescription={true}
        columnsClassName="grid grid-cols-1 sm:grid-cols-3 gap-4"
        sectionClassName="px-4 pt-2 pb-8 sm:px-6 lg:px-8 bg-sky-50 dark:bg-slate-900"
        containerClassName="max-w-6xl"
        titleColor="black"
        subtitleColor="black"
        cardClassName="border border-slate-300/80 dark:border-slate-700 bg-white"
        useMotion={false}
        showVisibilityToggle={false}
        data-testid="trip-related-categories-5"
      />
    </main>
  );
}
