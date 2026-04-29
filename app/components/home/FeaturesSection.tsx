import Link from 'next/link';
import type { HomeFeatureCard } from '@/app/types/home';

interface FeaturesSectionProps {
  title: string;
  features: HomeFeatureCard[];
}

export function FeaturesSection({ title, features }: FeaturesSectionProps) {
  return (
    <section className="px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 dark:text-white mb-10">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link
              key={feature.id}
              href={feature.href}
              className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-7 shadow-sm transition hover:shadow-lg dark:border-slate-700 dark:bg-slate-800"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradientClass} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
              />
              <div className="relative">
                <p className="text-4xl mb-3">{feature.icon}</p>
                <h3 className="text-2xl font-semibold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-300">{feature.description}</p>
                <p className="mt-4 text-blue-600 dark:text-blue-400 font-semibold">Scopri di piu -&gt;</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

