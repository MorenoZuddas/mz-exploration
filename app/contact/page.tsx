export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      <section className="max-w-3xl mx-auto px-4 py-16">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">MZ Exploration</p>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Contatti</h1>
        <p className="text-lg text-slate-700 dark:text-slate-300 mb-8">
          Se vuoi collaborare o semplicemente fare due chiacchiere su running, trekking o sviluppo,
          scrivimi pure.
        </p>

        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 space-y-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
            <a
              href="mailto:moreno@example.com"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              moreno@example.com
            </a>
          </div>

          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">LinkedIn</p>
            <a
              href="https://www.linkedin.com/in/moreno-zuddas-12321a128/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            >
              Moreno Zuddas
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

