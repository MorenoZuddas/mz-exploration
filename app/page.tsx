import { Hero } from './components/home/Hero';
import { HomeExperienceCarousel } from './components/home/HomeExperienceCarousel';
import { CardGrid } from './components/home/CardGrid';
import { AnimatedSection } from './components/home/AnimatedSection';

export default function Home() {
  return (
    <main className="w-full">
      {/* Hero Video Section */}
      <Hero />

      {/* Carousel Section (Running, Trekking, Trips) */}
      <div id="categories" className="bg-white dark:bg-slate-900 scroll-mt-20">
        <AnimatedSection className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-8">
              Esploriamo assieme
            </h2>
            <HomeExperienceCarousel />
          </div>
        </AnimatedSection>
      </div>

      {/* Latest Adventures Section */}
      <CardGrid />

      {/* Coming Soon Section */}
      <AnimatedSection className="px-4 py-16 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-8 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
            Coming Soon
          </p>
          <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">
            Sezione Libri, Foto, Musica
          </h2>
          <p className="mt-4 text-slate-600 dark:text-slate-300 text-lg">
            Una raccolta che raconta mindset, performance e avventura attraverso diverse forme di media.
          </p>
        </div>
      </AnimatedSection>
    </main>
  );
}