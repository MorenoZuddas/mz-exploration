import Link from 'next/link';

export default function TripsPage() {
  const trips = [
    {
      id: 1,
      title: 'Giappone 2024',
      location: 'Tokyo, Kyoto, Osaka',
      duration: '14 giorni',
      date: '2024-01-05',
      highlights: 'Templi, Montagne, Città',
      countries: 1,
    },
    {
      id: 2,
      title: 'Europa Centrale',
      location: 'Austria, Repubblica Ceca, Ungheria',
      duration: '10 giorni',
      date: '2023-12-20',
      highlights: 'Castelli, Fiumi, Città Storiche',
      countries: 3,
    },
    {
      id: 3,
      title: 'Patagonia',
      location: 'Argentina, Cile',
      duration: '12 giorni',
      date: '2023-11-15',
      highlights: 'Montagne, Ghiacciai, Natura Selvaggia',
      countries: 2,
    },
    {
      id: 4,
      title: 'Marocco',
      location: 'Marrakech, Fes, Deserto del Sahara',
      duration: '8 giorni',
      date: '2023-10-01',
      highlights: 'Deserto, Medina, Montagne dell\'Atlante',
      countries: 1,
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/exploration"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 font-semibold"
          >
            ← Torna a Exploration
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            ✈️ Trips
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Viaggi e avventure internazionali. Scopri i paesi che ho visitato e le esperienze indimenticabili.
          </p>
        </div>
      </section>

      {/* Trips Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trips.map((trip) => (
              <div
                key={trip.id}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {trip.title}
                  </h3>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">
                    {trip.countries} {trip.countries === 1 ? 'Paese' : 'Paesi'}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {trip.date}
                </p>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Destinazioni</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {trip.location}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Durata</p>
                      <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                        {trip.duration}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Highlights</p>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">
                        {trip.highlights}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Summary */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-slate-100 dark:bg-slate-700">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            Statistiche Viaggi
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Viaggi Totali</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">25+</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Paesi Visitati</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">25+</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Giorni di Viaggio</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">200+</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Continenti</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">5</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}