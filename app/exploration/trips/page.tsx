import { Card } from '@/components/ui/card';

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

export default function TripsPage() {
  const countries = new Set(trips.map((trip) => trip.country));

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <section className="max-w-6xl mx-auto px-4 py-14 trip-hero-1" data-testid="trip-hero-1">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3 trip-title-1" data-testid="trip-title-1">Trips</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-10 trip-description-1" data-testid="trip-description-1">
          Una panoramica dei viaggi principali con focus su esperienze outdoor, percorsi e tappe.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 trip-cards-grid-2">
          {trips.map((trip) => (
            <Card key={trip.id} className="p-5 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 trip-card-2" data-testid={`trip-card-${trip.id}-2`}>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white trip-card-title-2" data-testid={`trip-card-title-${trip.id}-2`}>{trip.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 trip-card-meta-2" data-testid={`trip-card-meta-${trip.id}-2`}>
                {trip.country} - {trip.period}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-3 trip-card-description-2" data-testid={`trip-card-description-${trip.id}-2`}>{trip.description}</p>
              <div className="flex flex-wrap gap-2 mt-4 trip-card-highlights-2" data-testid={`trip-card-highlights-${trip.id}-2`}>
                {trip.highlights.map((item) => (
                  <span
                    key={`${trip.id}-${item}`}
                    className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200 trip-highlight-2"
                    data-testid={`trip-highlight-${trip.id}-${item}-2`}
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 trip-stats-3" data-testid="trip-stats-3">
          <Card className="p-5 text-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 trip-stat-card-3" data-testid="trip-stat-total-3">
            <p className="text-sm text-slate-500 dark:text-slate-400 trip-stat-label-3" data-testid="trip-stat-label-total-3">Trips totali</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white trip-stat-value-3" data-testid="trip-stat-value-total-3">{trips.length}</p>
          </Card>
          <Card className="p-5 text-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 trip-stat-card-3" data-testid="trip-stat-countries-3">
            <p className="text-sm text-slate-500 dark:text-slate-400 trip-stat-label-3" data-testid="trip-stat-label-countries-3">Paesi visitati</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white trip-stat-value-3" data-testid="trip-stat-value-countries-3">{countries.size}</p>
          </Card>
          <Card className="p-5 text-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 trip-stat-card-3" data-testid="trip-stat-focus-3">
            <p className="text-sm text-slate-500 dark:text-slate-400 trip-stat-label-3" data-testid="trip-stat-label-focus-3">Focus</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white trip-stat-value-3" data-testid="trip-stat-value-focus-3">Travel + Sport</p>
          </Card>
        </section>
      </section>
    </main>
  );
}

