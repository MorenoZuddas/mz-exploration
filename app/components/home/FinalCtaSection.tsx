import Link from 'next/link';
import type { HomeCta } from '@/app/types/home';

interface FinalCtaSectionProps {
  cta: HomeCta;
}

export function FinalCtaSection({ cta }: FinalCtaSectionProps) {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-5">{cta.title}</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">{cta.subtitle}</p>
        <Link
          href={cta.buttonHref}
          className="inline-flex items-center rounded-lg bg-blue-600 px-7 py-3 text-white font-semibold hover:bg-blue-700 transition"
        >
          {cta.buttonLabel}
        </Link>
      </div>
    </section>
  );
}

