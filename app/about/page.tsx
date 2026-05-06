import Link from 'next/link';

import { PageShell } from '@/components/generic';

export default function AboutPage() {
  return (
    <PageShell background="sky" className="ab-main-1" data-testid="ab-main-1">
      <section className="relative w-full h-[34vh] sm:h-[38vh] overflow-hidden ab-hero-2" data-testid="ab-hero-2">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 ab-hero-background-2"
          style={{
            backgroundImage:
              'url(https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777967174/ABOUT_x03o0c.png)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20 ab-hero-overlay-2" />

        <Link
          href="/"
          className="absolute top-6 left-6 sm:left-10 inline-flex items-center gap-1.5 text-white/75 hover:text-white text-sm font-medium transition z-10 ab-back-link-2"
          data-testid="ab-back-link-2"
        >
          ← Home
        </Link>

        <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-7 sm:px-10 sm:pb-8 ab-hero-content-2" data-testid="ab-hero-content-2">
          <div className="w-full max-w-2xl space-y-2 mb-5 text-center ab-hero-text-2" data-testid="ab-hero-text-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight ab-title-2" data-testid="ab-title-2">
              Chi Sono
            </h1>
            <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto ab-subtitle-2" data-testid="ab-subtitle-2">
              Visione, metodo e obiettivi dietro il progetto MZ Exploration.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pt-6 pb-10 sm:px-6 lg:px-8 ab-content-3" data-testid="ab-content-3">
        <div className="max-w-4xl mx-auto">
          <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-8 ab-description-3" data-testid="ab-description-3">
            Ciao, sono Moreno. In questo progetto raccolgo e racconto attivita di running, trekking e
            viaggi, unendo dati, immagini e storie personali in un unico spazio.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10 ab-cards-group-3" data-testid="ab-cards-group-3">
            <div className="rounded-lg border-2 border-slate-300/80 dark:border-slate-500/90 bg-white dark:bg-slate-950/40 p-5 ab-card-mission-3" data-testid="ab-card-mission-3">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-2 ab-card-title-3" data-testid="ab-card-mission-title-3">Missione</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 ab-card-text-3" data-testid="ab-card-mission-text-3">
                Trasformare i dati delle attivita in insight semplici e utili, con un&apos;esperienza visiva pulita.
              </p>
            </div>
            <div className="rounded-lg border-2 border-slate-300/80 dark:border-slate-500/90 bg-white dark:bg-slate-950/40 p-5 ab-card-focus-3" data-testid="ab-card-focus-3">
              <h2 className="font-semibold text-slate-900 dark:text-white mb-2 ab-card-title-3" data-testid="ab-card-focus-title-3">Focus attuale</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 ab-card-text-3" data-testid="ab-card-focus-text-3">
                Migliorare analisi, dettaglio attivita e gestione foto associate tramite Cloudinary.
              </p>
            </div>
          </div>

          <Link
            href="/exploration"
            className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-3 text-white font-semibold hover:bg-black transition ab-cta-4"
            data-testid="ab-cta-4"
          >
            Vai a Exploration
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
