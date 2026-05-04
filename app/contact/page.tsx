export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <section className="max-w-3xl mx-auto px-4 py-16 co-hero-1" data-testid="co-hero-1">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 co-eyebrow-1" data-testid="co-eyebrow-1">MZ Exploration</p>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4 co-title-1" data-testid="co-title-1">Contatti</h1>
        <p className="text-lg text-slate-700 dark:text-slate-300 mb-8 co-description-1" data-testid="co-description-1">
          Se vuoi collaborare o semplicemente fare due chiacchiere su running, trekking o sviluppo,
          scrivimi pure.
        </p>

        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-4 co-contact-box-2" data-testid="co-contact-box-2">
          <div className="co-contact-item-2" data-testid="co-contact-email-2">
            <p className="text-sm text-slate-500 dark:text-slate-400 co-contact-label-2" data-testid="co-contact-email-label-2">Email</p>
            <a
              href="mailto:moreno@example.com"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline co-contact-link-2"
              data-testid="co-contact-email-link-2"
            >
              moreno@example.com
            </a>
          </div>

          <div className="co-contact-item-3" data-testid="co-contact-linkedin-3">
            <p className="text-sm text-slate-500 dark:text-slate-400 co-contact-label-3" data-testid="co-contact-linkedin-label-3">LinkedIn</p>
            <a
              href="https://www.linkedin.com/in/moreno-zuddas-12321a128/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline co-contact-link-3"
              data-testid="co-contact-linkedin-link-3"
            >
              Moreno Zuddas
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

