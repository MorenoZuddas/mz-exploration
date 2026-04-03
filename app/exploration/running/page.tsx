import Link from 'next/link';

export default function RunningPage() {
  const runningActivities = [
    {
      id: 1,
      title: 'Corsa Mattutina',
      distance: '10 km',
      time: '50 min',
      date: '2024-01-15',
      pace: '5:00 min/km',
    },
    {
      id: 2,
      title: 'Trail Running',
      distance: '15 km',
      time: '75 min',
      date: '2024-01-14',
      pace: '5:00 min/km',
    },
    {
      id: 3,
      title: 'Corsa Serale',
      distance: '8 km',
      time: '40 min',
      date: '2024-01-13',
      pace: '5:00 min/km',
    },
    {
      id: 4,
      title: 'Long Run',
      distance: '20 km',
      time: '100 min',
      date: '2024-01-12',
      pace: '5:00 min/km',
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
            🏃 Running
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Le mie corse e i percorsi preferiti. Scopri le statistiche e i dettagli di ogni attività.
          </p>
        </div>
      </section>

      {/* Running Activities Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {runningActivities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {activity.title}
                  </h3>
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {activity.date}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Distanza</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {activity.distance}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Tempo</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {activity.time}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Pace</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {activity.pace}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Velocità Media</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      12 km/h
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
            Statistiche Running
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Corse Totali</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">150+</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">km Totali</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">1500+</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Ore di Corsa</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">125+</p>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Pace Media</p>
              <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">5:00</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}