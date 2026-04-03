import Link from 'next/link';

export default function Home() {
  const previewSections = [
    {
      title: 'Chi Sono',
      description: 'Scopri la mia storia, i miei obiettivi e la mia passione per il running e l\'avventura.',
      icon: '👤',
      href: '/about',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Exploration',
      description: 'Esplora le mie avventure: running, trekking e viaggi intorno al mondo.',
      icon: '🗺️',
      href: '/exploration',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Contatti',
      description: 'Mettiti in contatto con me. Sono sempre disponibile per nuove collaborazioni e amicizie.',
      icon: '📧',
      href: '/contact',
      color: 'from-purple-500 to-purple-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto py-20 px-4 text-center">
        <h1 className="text-6xl font-bold mb-4 text-slate-900 dark:text-white">
          🏃 mz-grm
        </h1>
        <p className="text-2xl text-gray-600 dark:text-gray-300 mb-8">
          Scopri le mie avventure di running, trekking e viaggi intorno al mondo
        </p>

        <div className="flex gap-4 justify-center mb-16 flex-wrap">
          <Link
            href="/exploration"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-bold"
          >
            Esplora le Avventure →
          </Link>
          <Link
            href="/about"
            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-8 py-3 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition font-bold"
          >
            Scopri Chi Sono
          </Link>
        </div>
      </div>

      {/* Preview Sections */}
      <div className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-slate-900 dark:text-white">
          Esplora il Sito
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {previewSections.map((section) => (
            <Link
              key={section.title}
              href={section.href}
              className="group relative overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition"
            >
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

              {/* Content */}
              <div className="relative p-8">
                <div className="text-5xl mb-4">{section.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {section.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {section.description}
                </p>
                <div className="inline-flex items-center text-blue-600 dark:text-blue-400 font-semibold group-hover:translate-x-2 transition-transform">
                  Scopri di più →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-blue-600 dark:bg-blue-900 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Statistiche Generali</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold">150+</p>
              <p className="text-blue-100 mt-2">Corse</p>
            </div>
            <div>
              <p className="text-5xl font-bold">45+</p>
              <p className="text-blue-100 mt-2">Escursioni</p>
            </div>
            <div>
              <p className="text-5xl font-bold">25+</p>
              <p className="text-blue-100 mt-2">Paesi Visitati</p>
            </div>
            <div>
              <p className="text-5xl font-bold">2000+</p>
              <p className="text-blue-100 mt-2">km Percorsi</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-6xl mx-auto py-16 px-4 text-center">
        <h2 className="text-4xl font-bold mb-8 text-slate-900 dark:text-white">
          Pronto a Scoprire le Mie Avventure?
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Inizia a esplorare le mie storie, metriche e esperienze
        </p>
        <Link
          href="/exploration"
          className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-bold text-lg"
        >
          Esplora Ora →
        </Link>
      </div>
    </div>
  );
}