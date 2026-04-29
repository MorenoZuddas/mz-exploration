import { HomeExperienceCarousel } from './components/home/HomeExperienceCarousel';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-800">
      <section className="px-4 pt-12 pb-6 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm uppercase tracking-wider text-blue-600 dark:text-blue-300 mb-3">
            MZ Exploration
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white leading-tight">
            Corro, esploro e trasformo ogni attivita in una storia da condividere.
          </h1>
        </div>
      </section>

      <HomeExperienceCarousel />

      <section className="px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-white/80 dark:bg-slate-800/80 p-6 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
            Coming Soon
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">Sezione Libri Foto Musica</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            Qui inseriro una raccolta di libri, foto e musica che raccontano mindset, performance e avventura.
          </p>
        </div>
      </section>
    </main>
  );
}