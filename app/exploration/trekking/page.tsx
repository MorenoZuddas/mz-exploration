"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ActivityDetailModal } from '@/components/ActivityDetailModal';

interface Activity {
  id: string;
  name: string;
  type: string;
  date: string;
  originalDate: string;
  distance_km: string;
  distance_formatted: string;
  duration_min: number;
  duration_formatted: string;
  calories_kcal: number;
  location?: string;
}

function formatDistance(distanceM: number | null): string {
  if (!distanceM) return '—';
  const km = distanceM / 1000;
  return km < 10 ? `${Math.round(distanceM).toLocaleString('it-IT')} m` : `${km.toFixed(2)} km`;
}

function formatDurationFromSeconds(durationSec: number): string {
  const total = Math.max(0, Math.floor(durationSec));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  if (total >= 3600) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function safeTimestamp(value: string | undefined): number {
  if (!value) return 0;
  const ts = new Date(value).getTime();
  return Number.isNaN(ts) ? 0 : ts;
}

export default function TrekkingPage() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Determina se desktop
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mediaQuery.matches);
    const handleChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleActivityClick = (activityId: string) => {
    if (isDesktop) {
      setSelectedActivityId(activityId);
    } else {
      router.push(`/exploration/trekking/${activityId}`);
    }
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activities/garmin');
        const data = await response.json();

        if (data.status === 'success') {
          const source = data?.data?.recent_activities ?? [];

          const trekkingActivities = source
            .filter((act: any) => {
              const type = (act.type || '').toLowerCase();
              return type.includes('hik') || type.includes('trek') || type.includes('walk');
            })
            .map((act: any) => ({
              id: act._id ?? `${act.name}-${act.date}-${act.distance_m}`,
              name: act.name,
              type: act.type,
              date: new Date(act.date || 0).toLocaleDateString('it-IT'),
              originalDate: act.date || '',
              distance_km: ((act.distance_m ?? 0) / 1000).toFixed(2),
              distance_formatted: formatDistance(act.distance_m),
              duration_min: Math.round((act.duration_sec ?? 0) / 60),
              duration_formatted: formatDurationFromSeconds(act.duration_sec ?? 0),
              calories_kcal: act.calories_kcal ?? 0,
              location: act.location,
            }))
            .sort((a: Activity, b: Activity) => safeTimestamp(b.originalDate) - safeTimestamp(a.originalDate));

          setActivities(trekkingActivities);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchActivities();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <p className="text-lg">Caricamento...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/exploration"
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 font-semibold"
          >
            ← Torna a Exploration
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            🥾 Trekking
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            I miei percorsi trekking e escursioni. Scopri le statistiche di ogni uscita.
          </p>
          <div className="mt-6 flex gap-4">
            <Link
              href="/exploration/trekking/equipment"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              🎒 Attrezzatura
            </Link>
          </div>
        </div>
      </section>

      {/* Trekking Activities */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Nessuna attività trekking trovata.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activities.map((activity, index) => (
                <div
                  key={activity.id}
                  onClick={() => handleActivityClick(activity.id)}
                  className="cursor-pointer"
                >
                  <Card
                    className="p-6 hover:shadow-lg hover:scale-[1.02] transition-all"
                    dataName={`card ${index + 1}`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {activity.name}
                      </h3>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {activity.date}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Distanza</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {activity.distance_formatted}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600 dark:text-slate-400">Tempo</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                          {activity.duration_formatted}
                        </p>
                      </div>
                      {activity.location && (
                        <div className="col-span-2">
                          <p className="text-sm text-slate-600 dark:text-slate-400">Luogo</p>
                          <p className="text-lg font-semibold text-slate-900 dark:text-white">
                            {activity.location}
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Activity Detail Modal (Desktop only) */}
      {selectedActivityId && (
        <ActivityDetailModal
          activityId={selectedActivityId}
          isOpen={true}
          onClose={() => setSelectedActivityId(null)}
          detailsPageUrl={`/exploration/trekking/${selectedActivityId}`}
        />
      )}
    </main>
  );
}

