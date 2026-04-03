import Link from 'next/link';

export default function ExplorationPage() {
  const explorationCategories = [
    {
      title: 'Running',
      description: 'Le mie corse e i percorsi preferiti',
      icon: '🏃',
      href: '/exploration/running',
    },
    {
      title: 'Trekking',
      description: 'Escursioni in montagna e natura',
      icon: '🥾',
      href: '/exploration/trekking',
    },
    {
      title: 'Trips',
      description: 'Viaggi e avventure internazionali',
      icon: '✈️',
      href: '/exploration/trips',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Exploration
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">
            Scopri tutte le mie avventure: dalle corse mattutine alle escursioni in montagna, fino ai viaggi internazionali.
          </p>
        </div>
      </section>

      {/* Exploration Categories Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {explorationCategories.map((category) => (
              <Link
                key={category.title}
                href={category.href}
                className="group relative overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-8 transition-all hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-600"
              >
                <div className="text-5xl mb-4">{category.icon}</div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {category.title}
                </h2>
                <p className="text-slate-600 dark:text-slate-400">
                  {category.description}
                </p>
                <div className="mt-4 inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                  Scopri di più →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-slate-100 dark:bg-slate-700">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
            Statistiche Generali
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">150+</div>
              <p className="text-slate-600 dark:text-slate-300 mt-2">Corse</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">45+</div>
              <p className="text-slate-600 dark:text-slate-300 mt-2">Escursioni</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">25+</div>
              <p className="text-slate-600 dark:text-slate-300 mt-2">Paesi Visitati</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">2000+</div>
              <p className="text-slate-600 dark:text-slate-300 mt-2">km Percorsi</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}