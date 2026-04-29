interface IntroSectionProps {
  title: string;
  text: string;
}

export function IntroSection({ title, text }: IntroSectionProps) {
  return (
    <section className="px-4 py-10 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3">{title}</h2>
        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{text}</p>
      </div>
    </section>
  );
}

