import Link from 'next/link';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-sky-50 dark:bg-slate-900 co-main-1" data-testid="co-main-1">
      <section className="relative w-full h-[34vh] sm:h-[38vh] overflow-hidden co-hero-2" data-testid="co-hero-2">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 co-hero-background-2"
          style={{
            backgroundImage:
              'url(https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777966565/CONTACT_ajntod.png)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20 co-hero-overlay-2" />

        <Link
          href="/"
          className="absolute top-6 left-6 sm:left-10 inline-flex items-center gap-1.5 text-white/75 hover:text-white text-sm font-medium transition z-10 co-back-link-2"
          data-testid="co-back-link-2"
        >
          ← Home
        </Link>

        <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-7 sm:px-10 sm:pb-8 co-hero-content-2" data-testid="co-hero-content-2">
          <div className="w-full max-w-2xl space-y-2 mb-5 text-center co-hero-text-2" data-testid="co-hero-text-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight co-title-2" data-testid="co-title-2">
              Contatti
            </h1>
            <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto co-subtitle-2" data-testid="co-subtitle-2">
              Collaborazioni, idee e confronto su running, trekking e sviluppo.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 pt-6 pb-10 sm:px-6 lg:px-8 bg-sky-50 dark:bg-slate-900 co-content-3" data-testid="co-content-3">
        <div className="max-w-3xl mx-auto">
          <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 co-description-3" data-testid="co-description-3">
            Se vuoi collaborare o semplicemente fare due chiacchiere su running, trekking o sviluppo,
            scrivimi pure.
          </p>

          <div className="rounded-lg border border-slate-300/80 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 space-y-4 co-contact-box-3" data-testid="co-contact-box-3">
            <div className="co-contact-item-3" data-testid="co-contact-email-3">
              <p className="text-sm text-slate-500 dark:text-slate-400 co-contact-label-3" data-testid="co-contact-email-label-3">Email</p>
              <a
                href="mailto:moreno@example.com"
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline co-contact-link-3"
                data-testid="co-contact-email-link-3"
              >
                moreno@example.com
              </a>
            </div>

            <div className="co-contact-item-4" data-testid="co-contact-linkedin-4">
              <p className="text-sm text-slate-500 dark:text-slate-400 co-contact-label-4" data-testid="co-contact-linkedin-label-4">LinkedIn</p>
              <a
                href="https://www.linkedin.com/in/moreno-zuddas-12321a128/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 font-medium hover:underline co-contact-link-4"
                data-testid="co-contact-linkedin-link-4"
              >
                Moreno Zuddas
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
