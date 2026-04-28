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
      <section className="max-w-6xl mx-auto px-4 py-14">
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-3">Trips</h1>
        <p className="text-slate-600 dark:text-slate-300 mb-10">
          Una panoramica dei viaggi principali con focus su esperienze outdoor, percorsi e tappe.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {trips.map((trip) => (
            <Card key={trip.id} className="p-5 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{trip.name}</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {trip.country} - {trip.period}
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 mt-3">{trip.description}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {trip.highlights.map((item) => (
                  <span
                    key={`${trip.id}-${item}`}
                    className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-200"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-5 text-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Trips totali</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{trips.length}</p>
          </Card>
          <Card className="p-5 text-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Paesi visitati</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{countries.size}</p>
          </Card>
          <Card className="p-5 text-center bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">Focus</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">Travel + Sport</p>
          </Card>
        </section>
      </section>
    </main>
  );
}

