import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { headers } from 'next/headers';
import { ActivityPhotos } from '@/components/ActivityPhotos';
import type { ActivityPhoto } from '@/types/activity';

interface ActivityPageProps {
  params: Promise<{
    id: string;
  }>;
}

interface ActivityDetail {
  id?: string;
  source_id: string;
  activityId?: number | null;
  name: string;
  type: string;
  date: string | null;
  distance_m: number | null;
  distance_km: string;
  distance_formatted: string;
  duration_sec: number | null;
  duration_formatted: string;
  calories_kcal: number | null;
  pace_min_per_km: number | null;
  location: string | null;
  photos?: ActivityPhoto[];
}

async function getActivityById(id: string): Promise<ActivityDetail | null> {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host');
  const proto = h.get('x-forwarded-proto') ?? 'http';
  if (!host) return null;

  const res = await fetch(`${proto}://${host}/api/activities/${encodeURIComponent(id)}`, {
    cache: 'no-store',
  });

  if (!res.ok) return null;
  const payload = (await res.json()) as { data?: { activity?: ActivityDetail } };
  return payload.data?.activity ?? null;
}

export default async function ActivityDetailPage({
  params,
}: ActivityPageProps): Promise<React.JSX.Element> {
  const { id } = await params;
  const activity = await getActivityById(id);

  if (!activity) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-12 dark:from-slate-900 dark:to-slate-800 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <Link
          href="/exploration/running"
          className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Torna a Running
        </Link>

        <section className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-700 dark:bg-slate-800">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{activity.name}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {activity.date ? new Date(activity.date).toLocaleString('it-IT') : '—'} · {activity.type}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Distanza</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                {activity.distance_formatted}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Durata</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                {activity.duration_formatted}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Calorie</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                {activity.calories_kcal ?? '—'}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Foto</p>
              <p className="text-lg font-semibold text-slate-900 dark:text-white">
                {activity.photos?.length ?? 0}
              </p>
            </div>
          </div>
        </section>

        <ActivityPhotos photos={activity.photos} />
      </div>
    </main>
  );
}
