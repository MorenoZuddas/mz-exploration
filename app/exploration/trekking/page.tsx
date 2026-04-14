import Link from 'next/link';

export default function TrekkingPage() {
  const trekkingActivities = [
    {
      id: 1,
      title: 'Monte Rosa',
      elevation: '4634 m',
      duration: '2 giorni',
      date: '2024-01-10',
      difficulty: 'Difficile',
      distance: '25 km',
    },
    {
      id: 2,
      title: 'Gran Paradiso',
      elevation: '4061 m',
      duration: '1 giorno',
      date: '2024-01-08',
      difficulty: 'Medio',
      distance: '18 km',
    },
    {
      id: 3,
      title: 'Tre Cime di Lavaredo',
      elevation: '2999 m',
      duration: '1 giorno',
      date: '2024-01-05',
      difficulty: 'Medio',
      distance: '12 km',
    },
    {
      id: 4,
      title: 'Sentiero dei Parchi',
      elevation: '1500 m',
      duration: '1 giorno',
      date: '2024-01-01',
      difficulty: 'Facile',
      distance: '15 km',
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
            🏔️ Trekking
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Le mie avventure in montagna e i trekking più affascinanti.
          </p>
          <div className="mt-6 flex gap-4">
            <Link
              href="/exploration/equipment/trekking"
              className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
            >
              🎽 Attrezzatura
            </Link>
          </div>
        </div>
      </section>

      {/* Trekking Activities Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trekkingActivities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {activity.title}
                  </h3>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    {activity.difficulty}
                  </span>
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                  {activity.date}
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Elevazione</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {activity.elevation}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Durata</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {activity.duration}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Distanza</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {activity.distance}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Dislivello</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      +800 m
                    </p>
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
            Statistiche Trekking
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Escursioni Totali</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">45+</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">km Totali</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">400+</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Vette Conquistate</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">30+</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Dislivello Totale</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">15000+</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}