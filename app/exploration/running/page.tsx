"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Filter, type FilterConfig, type FilterState } from '@/components/Filter';
import { Modal } from '@/components/Modal';
import { Statistics, type StatisticsMetricKey } from '@/components/Statistics';
import { thumbnailUrl } from '@/lib/cloudinary';
import { getCachedActivities, setCachedActivities } from '@/lib/cache/activities';
import { CardGrid, type CardGridItem } from '@/components/generic/CardGrid';

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
  pace_min_per_km?: number | null;
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
  pace_min_per_km?: number;
  photo?: ApiPhoto | null;
}

function safeTimestamp(value: string | null | undefined): number {
  if (!value) return 0;
  const ts = new Date(value).getTime();
  return Number.isNaN(ts) ? 0 : ts;
}

function inferRunningType(name: string, rawType: string): string {
  const normalizedRawType = rawType.trim().toLowerCase();
  const typeAlias: Record<string, string> = {
    running: 'running',
    trail_running: 'running',
    road_running: 'running',
    virtual_running: 'running',
    track_running: 'track_running',
  };
  if (normalizedRawType && normalizedRawType !== 'unknown' && typeAlias[normalizedRawType]) {
    return typeAlias[normalizedRawType];
  }

  const normalized = name.toLowerCase().trim();
  if (normalized.includes('pista') || normalized.includes('track')) return 'track_running';
  if (normalized.includes('corsa') || normalized.includes('run') || normalized.includes('jog')) return 'running';
  if (normalized.includes('ripetute') || normalized.includes('interval') || /\d+x\d+/.test(normalized)) return 'running';
  if (normalized.includes('marathon') || normalized.includes('half marathon') || /\b\d{1,2}k\b/.test(normalized)) return 'running';
  return normalizedRawType || 'unknown';
}

function normalizeType(type: string | undefined): string {
  return (type || '').trim().toLowerCase();
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

function formatDistance(distanceM: number): string {
  const km = distanceM / 1000;
  if (km < 10) return `${Math.round(distanceM).toLocaleString('it-IT')} m`;
  return `${km.toFixed(2)} km`;
}

export default function RunningPage() {
  const router = useRouter();
   const [activities, setActivities] = useState<Activity[]>([]);
   const [loading, setLoading] = useState(true);
   const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
    types: [] as string[],
    minDistance: undefined as number | undefined,
    maxDistance: undefined as number | undefined,
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    setIsDesktop(mediaQuery.matches);

    const onChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    mediaQuery.addEventListener('change', onChange);
    return () => mediaQuery.removeEventListener('change', onChange);
  }, []);

  const handleActivityClick = (activityId: string): void => {
    if (isDesktop) {
      setSelectedActivityId(activityId);
      return;
    }

    router.push(`/exploration/running/${activityId}`);
  };

  const formatPace = (pace: number | undefined): string => {
    if (!pace || pace <= 0) return 'N/A';
    const min = Math.floor(pace);
    const sec = Math.round((pace % 1) * 60);
    return `${min}:${String(sec).padStart(2, '0')}`;
  };

  const runningFilterConfig: FilterConfig[] = [
    {
      type: 'dateStart',
      label: 'Data inizio',
    },
    {
      type: 'dateEnd',
      label: 'Data fine',
    },
    {
      type: 'activityType',
      label: 'Tipo attività',
      options: [
        { value: 'running', label: 'Running' },
        { value: 'track_running', label: 'Track Running' },
      ],
    },
    {
      type: 'distanceMin',
      label: 'Distanza min (km)',
      placeholder: 'Distanza min (km)',
    },
    {
      type: 'distanceMax',
      label: 'Distanza max (km)',
      placeholder: 'Distanza max (km)',
    },
  ];

  const handleFilterChange = (state: FilterState) => {
    setFilters({
      dateFrom: state.dateStart ? new Date(state.dateStart) : undefined,
      dateTo: state.dateEnd ? new Date(state.dateEnd) : undefined,
      types: state.activityType ? [state.activityType] : [],
      minDistance: state.distanceMin ? Number.parseFloat(state.distanceMin) * 1000 : undefined,
      maxDistance: state.distanceMax ? Number.parseFloat(state.distanceMax) * 1000 : undefined,
    });
  };

  const resetRunningFilters = () => {
    setFilters({ dateFrom: undefined, dateTo: undefined, types: [], minDistance: undefined, maxDistance: undefined });
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const cached = getCachedActivities<Activity[]>('running');
        if (cached && cached.length > 0) {
          setActivities(cached);
          setLoading(false);
          return;
        }

        const response = await fetch('/api/activities/garmin');
        if (!response.ok) {
          const raw = await response.text();
          console.error('GET /api/activities/garmin failed', response.status, raw);
          throw new Error('Impossibile caricare le attività in questo momento.');
        }

        const data: { status?: string; data?: { recent_activities?: GarminApiActivity[] } } = await response.json();

        if (data.status === 'success') {
          const source: GarminApiActivity[] = data?.data?.recent_activities ?? [];

          const runningActivities = source
            .map((act, index) => {
              const resolvedType = inferRunningType(act.name, act.type);
              const distanceM = act.distance_m ?? 0;
              const durationSec = act.duration_sec ?? 0;
              const dateIso = act.date ?? new Date(0).toISOString();

              return {
                id: act._id ?? `${act.name}-${dateIso}-${distanceM}-${index}`,
                name: act.name,
                type: resolvedType,
                date: new Date(dateIso).toLocaleDateString('it-IT'),
                originalDate: dateIso,
                distance_km: (distanceM / 1000).toFixed(2),
                distance_formatted: formatDistance(distanceM),
                duration_min: Math.round(durationSec / 60),
                duration_formatted: formatDurationFromSeconds(durationSec),
                calories_kcal: act.calories_kcal ?? 0,
                pace_min_per_km: act.pace_min_per_km ?? undefined,
                photo: act.photo ?? null,
              };
            })
            .filter((act) => act.type === 'running' || act.type === 'track_running')
            .sort((a, b) => safeTimestamp(b.originalDate) - safeTimestamp(a.originalDate));

          setActivities(runningActivities);
          setCachedActivities(runningActivities, 'running');
          setError(null);
          return;
        }

        throw new Error('Formato risposta API non valido.');
      } catch (fetchError) {
        console.error('Error fetching activities:', fetchError);

        const cached = getCachedActivities<Activity[]>('running');
        if (cached && cached.length > 0) {
          setActivities(cached);
          setError('Connessione instabile: sto mostrando dati recenti dalla cache.');
        } else {
          setError('Impossibile caricare le attività. Controlla la connessione al database.');
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchActivities();
  }, []);

  const filteredActivities = useMemo(() => {
    return activities.filter((activity) => {
      const dateTs = safeTimestamp(activity.originalDate);
      const distanceMeters = Number.parseFloat(activity.distance_km) * 1000;
      const type = normalizeType(activity.type);

      if (filters.dateFrom) {
        const from = filters.dateFrom.getTime();
        if (dateTs < from) return false;
      }

      if (filters.dateTo) {
        const to = filters.dateTo.getTime();
        if (dateTs > to) return false;
      }

      if (typeof filters.minDistance === 'number' && distanceMeters < filters.minDistance) return false;
      if (typeof filters.maxDistance === 'number' && distanceMeters > filters.maxDistance) return false;

      if (filters.types.length > 0) {
        const allowed = filters.types.map((t) => normalizeType(t));
        if (!allowed.includes(type)) return false;
      }

      return true;
    });
   }, [activities, filters]);

   const activityGridItems = useMemo<CardGridItem[]>(
     () =>
       filteredActivities.map((activity) => ({
         id: activity.id,
         title: activity.name,
         href: `/exploration/running/${activity.id}`,
         // Nota: Non passiamo 'image' per evitare doppia visualizzazione nella modale.
         // La foto sarà mostrata solo nella modale dal suo fetch separato.
         // Usiamo 'hasPhoto' per mostrare il badge "Foto" sulla card.
         hasPhoto: Boolean(activity.photo),
         type: activity.type === 'track_running' ? 'track_running' : 'running',
         date: activity.date,
         distance: activity.distance_formatted,
         duration: activity.duration_formatted,
         pace: `${formatPace(activity.pace_min_per_km)} min/km`,
         kcal: `${activity.calories_kcal || '—'}`,
       })),
     [filteredActivities]
   );
   const bestActivities = useMemo(
     () => [...activities].sort((a, b) => parseFloat(b.distance_km) - parseFloat(a.distance_km)).slice(0, 4),
     [activities]
   );

   const selectedActivity = selectedActivityId ? activities.find((a) => a.id === selectedActivityId) : null;

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
            🏃 Running
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            Le mie corse e i percorsi preferiti. Scopri le statistiche e i dettagli di ogni attività.
          </p>
          <div className="mt-6 flex gap-4">
            <Link
              href="/exploration/running/equipment"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              🎽 Attrezzatura
            </Link>
          </div>
        </div>
      </section>

      {/* Running Activities Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
              {error}
            </div>
          )}
            <CardGrid
              variant="activity"
              title=""
              subtitle=""
              items={activityGridItems}
              columnsClassName="grid grid-cols-1 md:grid-cols-4 gap-6"
              sectionClassName="px-0 py-0 bg-transparent"
              useMotion={false}
              showDate
              showTypeBadge={false}
              visibleItems={4}
              showVisibilityToggle
              showMoreLabel="Mostra altre attività"
              showLessLabel="Mostra meno"
              onItemClick={(item) => handleActivityClick(item.id)}
            />
           {filteredActivities.length === 0 && (
             <div className="mt-6 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/70 dark:bg-slate-800/50 p-6 text-center text-slate-600 dark:text-slate-300">
               Nessuna attività trovata con i filtri selezionati.
             </div>
           )}
         </div>
      </section>

      {/* Stats Summary */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-slate-100 dark:bg-slate-700">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            Statistiche Running
          </h2>

           {/* Filters */}
           <div className="bg-white dark:bg-slate-800 rounded-lg p-6 mb-6">
             <h3 className="text-lg font-semibold mb-4">Filtri</h3>
             <Filter
               filters={runningFilterConfig}
               tone="blue"
               onFilterChange={handleFilterChange}
               onReset={resetRunningFilters}
               resetLabel="Reset Filtri"
               applyLabel="Applica Filtri"
             />
           </div>

           {/* Statistics Component */}
           <div className="bg-white dark:bg-slate-800 rounded-lg p-6">
             <Statistics
               metrics={['total_runs', 'total_distance_runs', 'longest_run', 'total_running_hours'] as StatisticsMetricKey[]}
               activities={activities.map(a => ({
                 id: a.id,
                 type: a.type,
                 date: a.date,
                 originalDate: a.originalDate,
                 distance_m: Number.parseFloat(a.distance_km) * 1000,
                 distance_km: a.distance_km,
                 duration_sec: a.duration_min * 60,
                 duration_min: a.duration_min,
               }))}
               filters={{
                 dateFrom: filters.dateFrom,
                 dateTo: filters.dateTo,
                 types: filters.types,
                 minDistance: filters.minDistance,
                 maxDistance: filters.maxDistance,
               }}
               tone="blue"
               backgroundColor="white"
               columns={4}
             />
           </div>
        </div>
      </section>

      {/* Activity Detail Modal (Desktop only) */}
      {selectedActivityId && (
        <Modal
          activityId={selectedActivityId}
          isOpen={true}
          onClose={() => setSelectedActivityId(null)}
          detailsPageUrl={`/exploration/running/${selectedActivityId}`}
          photo={selectedActivity?.photo ?? null}
          tone="blue"
        />
      )}
    </main>
  );
}