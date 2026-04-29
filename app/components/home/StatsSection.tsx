import type { HomeStat } from '@/app/types/home';

interface StatsSectionProps {
  title: string;
  stats: HomeStat[];
}

export function StatsSection({ title, stats }: StatsSectionProps) {
  return (
    <section className="px-4 py-14 sm:px-6 lg:px-8 bg-blue-600 text-white dark:bg-blue-900">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat) => (
            <div key={stat.id}>
              <p className="text-4xl md:text-5xl font-bold">{stat.value}</p>
              <p className="text-blue-100 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

