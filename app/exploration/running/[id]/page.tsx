"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityPhotos } from '@/components/ActivityPhotos';

interface ActivityDetail {
  _id?: string;
  source_id?: string;
  name: string;
  type: string;
  date: string | null;
  distance_m: number | null;
  duration_sec: number | null;
  calories_kcal?: number | null;
  pace_min_per_km?: number | null;
  elevation_gain_m?: number | null;
  elevation_loss_m?: number | null;
  avg_hr?: number | null;
  max_hr?: number | null;
  avg_cadence?: number | null;
  location?: string | null;
  photos?: Array<{ public_id: string; secure_url: string; width?: number; height?: number }>;
}

function formatDuration(durationSec: number | null): string {
  if (!durationSec || durationSec <= 0) return '—';
  const total = Math.floor(durationSec);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return total >= 3600
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function formatDistance(distanceM: number | null): string {
  if (!distanceM) return '—';
  const km = distanceM / 1000;
  return km < 10 ? `${Math.round(distanceM).toLocaleString('it-IT')} m` : `${km.toFixed(2)} km`;
}

function formatPace(pace: number | null | undefined): string {
  if (!pace || pace <= 0) return 'N/A';
  const min = Math.floor(pace);
  const sec = Math.round((pace % 1) * 60);
  return `${min}:${String(sec).padStart(2, '0')}`;
}

export default function RunningActivityDetailPage() {
  const params = useParams<{ id: string }>();
  const activityId = params?.id;

  const [activity, setActivity] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!activityId) return;

    const fetchActivity = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/activities/${activityId}`);
        const data = await response.json();

        if (!response.ok || data.status !== 'success' || !data.data?.activity) {
          throw new Error(data.message || 'Attività non trovata');
        }

        setActivity(data.data.activity as ActivityDetail);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore durante il caricamento');
      } finally {
        setLoading(false);
      }
    };

    void fetchActivity();
  }, [activityId]);

  if (loading) {
    return <main className="p-8">Caricamento...</main>;
  }

  if (error || !activity) {
    return (
      <main className="p-8">
        <Link href="/exploration/running" className="text-blue-600 hover:underline">← Torna a Running</Link>
        <p className="mt-4 text-red-600">{error ?? 'Attività non trovata'}</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-6 md:p-10">
      <div className="mx-auto max-w-5xl space-y-6">
        <Link href="/exploration/running" className="inline-flex text-blue-600 dark:text-blue-400 hover:underline">
          ← Torna a Running
        </Link>

        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{activity.name}</h1>
          <p className="text-slate-600 dark:text-slate-300 mt-1">
            {activity.date ? new Date(activity.date).toLocaleDateString('it-IT') : '—'} · {activity.location ?? 'Luogo n/d'}
          </p>
        </div>

        {activity.photos && activity.photos.length > 0 && (
          <section>
            <h2 className="mb-3 text-lg font-semibold text-slate-900 dark:text-white">Foto attività</h2>
            <ActivityPhotos photos={activity.photos} />
          </section>
        )}

        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card><CardHeader><CardTitle className="text-sm">Distanza</CardTitle></CardHeader><CardContent className="text-xl font-bold">{formatDistance(activity.distance_m)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Tempo</CardTitle></CardHeader><CardContent className="text-xl font-bold">{formatDuration(activity.duration_sec)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Pace</CardTitle></CardHeader><CardContent className="text-xl font-bold">{formatPace(activity.pace_min_per_km)}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Kcal</CardTitle></CardHeader><CardContent className="text-xl font-bold">{activity.calories_kcal ?? '—'}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Dislivello+</CardTitle></CardHeader><CardContent className="text-xl font-bold">{activity.elevation_gain_m != null ? `${Math.round(activity.elevation_gain_m)} m` : '—'}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">Dislivello-</CardTitle></CardHeader><CardContent className="text-xl font-bold">{activity.elevation_loss_m != null ? `${Math.round(activity.elevation_loss_m)} m` : '—'}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">FC media</CardTitle></CardHeader><CardContent className="text-xl font-bold">{activity.avg_hr ?? '—'}</CardContent></Card>
          <Card><CardHeader><CardTitle className="text-sm">FC max</CardTitle></CardHeader><CardContent className="text-xl font-bold">{activity.max_hr ?? '—'}</CardContent></Card>
        </section>
      </div>
    </main>
  );
}
