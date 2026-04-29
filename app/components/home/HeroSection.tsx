import Link from 'next/link';
import type { HomeHero } from '@/app/types/home';

interface HeroSectionProps {
  hero: HomeHero;
}

export function HeroSection({ hero }: HeroSectionProps) {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white mb-6">
          {hero.title}
        </h1>
        <p className="mx-auto max-w-3xl text-lg sm:text-xl text-slate-600 dark:text-slate-300 mb-10">
          {hero.subtitle}
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href={hero.primaryCta.href}
            className="inline-flex items-center rounded-lg bg-blue-600 px-6 py-3 text-white font-semibold hover:bg-blue-700 transition"
          >
            {hero.primaryCta.label}
          </Link>
          <Link
            href={hero.secondaryCta.href}
            className="inline-flex items-center rounded-lg bg-slate-200 px-6 py-3 text-slate-900 font-semibold hover:bg-slate-300 transition dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
          >
            {hero.secondaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}

