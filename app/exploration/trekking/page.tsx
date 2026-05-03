"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from "@/components/ui/card"
import { ActivityDetailModal } from '@/components/ActivityDetailModal';
import Image from 'next/image';
import { thumbnailUrl } from '@/lib/cloudinary';
import { getCachedActivities, setCachedActivities } from '@/lib/cache/activities';

interface ApiPhoto {
  activityId: number;
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
}

interface GarminApiActivity {
  _id?: string;
  name: string;
  type: string;
  date: string | null;
  distance_m: number | null;
  duration_sec: number | null;
  calories_kcal?: number | null;
  location?: string | null;
  photo?: ApiPhoto | null;
}

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
  photo?: ApiPhoto | null;
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
   const [displayedCount, setDisplayedCount] = useState(8);
   const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
   const [isDesktop, setIsDesktop] = useState(() =>
     typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : false
   );
   const [error, setError] = useState<string | null>(null);

  // Determina se desktop
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
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
    const abortController = new AbortController();
    let isActive = true;

    const fetchActivities = async () => {
      const cached = getCachedActivities<Activity[]>('trekking');

      if (cached && cached.length > 0) {
        if (isActive) {
          setActivities(cached);
          setLoading(false);
        }
      }

      try {
        const response = await fetch('/api/activities/garmin', {
          cache: 'no-store',
          signal: abortController.signal,
          headers: {
            'cache-control': 'no-cache',
          },
        });
        if (!response.ok) {
          const raw = await response.text();
          console.error('GET /api/activities/garmin failed', response.status, raw);
          throw new Error('Impossibile caricare le attività trekking in questo momento.');
        }

        const data: { status?: string; data?: { recent_activities?: GarminApiActivity[] } } = await response.json();
        if (data.status === 'success') {
          const source: GarminApiActivity[] = data?.data?.recent_activities ?? [];

          const trekkingActivities = source
            .filter((act) => {
              const type = (act.type || '').toLowerCase();
              return type.includes('hik') || type.includes('trek') || type.includes('walk');
            })
            .map((act, index) => ({
              id: act._id ?? `${act.name}-${act.date}-${act.distance_m}-${index}`,
              name: act.name,
              type: act.type,
              date: new Date(act.date || 0).toLocaleDateString('it-IT'),
              originalDate: act.date || '',
              distance_km: ((act.distance_m ?? 0) / 1000).toFixed(2),
              distance_formatted: formatDistance(act.distance_m),
              duration_min: Math.round((act.duration_sec ?? 0) / 60),
              duration_formatted: formatDurationFromSeconds(act.duration_sec ?? 0),
              calories_kcal: act.calories_kcal ?? 0,
              location: act.location ?? undefined,
              photo: act.photo ?? null,
            }))
            .sort((a: Activity, b: Activity) => safeTimestamp(b.originalDate) - safeTimestamp(a.originalDate));

          if (!isActive) {
            return;
          }

          setActivities(trekkingActivities);
          setCachedActivities(trekkingActivities, 'trekking');
          setError(null);
          return;
        }

        throw new Error('Formato risposta API non valido.');
      } catch (fetchError) {
        if ((fetchError instanceof Error && fetchError.name === 'AbortError') || !isActive) {
          return;
        }

        console.error('Error fetching activities:', fetchError);

        if (cached && cached.length > 0) {
          setActivities(cached);
          setError('Connessione instabile: sto mostrando dati recenti dalla cache.');
        } else {
          setError('Impossibile caricare le attività trekking.');
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void fetchActivities();

    return () => {
      isActive = false;
      abortController.abort();
    };
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
          {error && (
            <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
              {error}
            </div>
          )}
          {activities.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-slate-600 dark:text-slate-300">
                Nessuna attività trekking trovata.
              </p>
            </div>
           ) : (
             <>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {activities.slice(0, displayedCount).map((activity, index) => (
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
               {activities.length > displayedCount && (
                 <div className="mt-6 text-center">
                   <button
                     onClick={() => setDisplayedCount((prev) => prev + 8)}
                     className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
                   >
                     Mostra Altro
                   </button>
                 </div>
               )}
             </>
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
          photo={activities.find(a => a.id === selectedActivityId)?.photo ?? null}
        />
      )}
    </main>
  );
}
