import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <section className="max-w-4xl mx-auto px-4 py-16">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">MZ Exploration</p>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
          Chi Sono
        </h1>
        <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-8">
          Ciao, sono Moreno. In questo progetto raccolgo e racconto attivita di running, trekking e
          viaggi, unendo dati, immagini e storie personali in un unico spazio.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-2">Missione</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Trasformare i dati delle attivita in insight semplici e utili, con un&apos;esperienza visiva pulita.
            </p>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-2">Focus attuale</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Migliorare analisi, dettaglio attivita e gestione foto associate tramite Cloudinary.
            </p>
          </div>
        </div>

        <Link
          href="/exploration"
          className="inline-flex items-center rounded-lg bg-blue-600 px-5 py-3 text-white font-semibold hover:bg-blue-700 transition"
        >
          Vai a Exploration
        </Link>
      </section>
    </div>
  );
}

