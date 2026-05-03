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
  duration_sec: number;
  duration_min: number;
  duration_formatted: string;
  calories_kcal: number;
  pace_min_per_km?: number;
  photo?: ApiPhoto | null;
}

type CachedActivity = Omit<Activity, 'duration_sec'> & { duration_sec?: number };

const ENABLE_ACTIVITY_CACHE = process.env.NODE_ENV === 'production';

function normalizeRunningActivity(activity: CachedActivity): Activity {
  const durationSec =
    typeof activity.duration_sec === 'number' && activity.duration_sec > 0
      ? activity.duration_sec
      : Math.max(0, Math.round((activity.duration_min ?? 0) * 60));

  return {
    ...activity,
    duration_sec: durationSec,
    duration_min: Math.round(durationSec / 60),
    duration_formatted: formatDurationFromSeconds(durationSec),
  };
}

const runningSortOptions = [
  { value: 'date_desc', label: 'Più recente' },
  { value: 'date_asc', label: 'Meno recente' },
  { value: 'distance_desc', label: 'Più lunga' },
  { value: 'distance_asc', label: 'Meno lunga' },
] as const;

type RunningSortValue = (typeof runningSortOptions)[number]['value'];

const relatedExplorationCards: CardGridItem[] = [
  {
    id: 'exp-overview',
    title: 'Exploration',
    description: 'Panoramica generale',
    href: '/exploration',
    image: 'https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777450410/running_Large_zorzw2.jpg',
  },
  {
    id: 'exp-trekking-mini',
    title: 'Trekking',
    description: 'Natura e dislivello',
    href: '/exploration/trekking',
    image: 'https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777450410/trekking_h2lev5.jpg',
  },
  {
    id: 'exp-trips-mini',
    title: 'Trips',
    description: 'Viaggi ed esperienze',
    href: '/exploration/trips',
    image: 'https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777450410/trips_exvdmu.avif',
  },
];

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
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(min-width: 1024px)').matches : false
  );
  const [filters, setFilters] = useState({
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
    types: [] as string[],
    minDistance: undefined as number | undefined,
    maxDistance: undefined as number | undefined,
  });
  const [sortBy, setSortBy] = useState<RunningSortValue>('date_desc');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');

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
      shortLabel: 'Data inizio',
    },
    {
      type: 'dateEnd',
      label: 'Data fine',
      shortLabel: 'Data fine',
    },
    {
      type: 'activityType',
      label: 'Tipo attività',
      shortLabel: 'Tipo attività',
      options: [
        { value: 'running', label: 'Corsa su strada' },
        { value: 'track_running', label: 'Corsa su pista' },
      ],
    },
    {
      type: 'distanceMin',
      label: 'Distanza min (km)',
      shortLabel: 'Dist. min (km)',
      placeholder: 'Distanza min (km)',
    },
    {
      type: 'distanceMax',
      label: 'Distanza max (km)',
      shortLabel: 'Dist. max (km)',
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
    const abortController = new AbortController();
    let isActive = true;

    const fetchActivities = async () => {
      const cached = ENABLE_ACTIVITY_CACHE ? getCachedActivities<CachedActivity[]>('running') : null;

      if (cached && cached.length > 0) {
        const normalizedCached = cached.map(normalizeRunningActivity);
        if (isActive) {
          setActivities(normalizedCached);
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
                duration_sec: durationSec,
                duration_min: Math.round(durationSec / 60),
                duration_formatted: formatDurationFromSeconds(durationSec),
                calories_kcal: act.calories_kcal ?? 0,
                pace_min_per_km: act.pace_min_per_km ?? undefined,
                photo: act.photo ?? null,
              };
            })
            .filter((act) => act.type === 'running' || act.type === 'track_running')
            .sort((a, b) => safeTimestamp(b.originalDate) - safeTimestamp(a.originalDate));

          if (!isActive) {
            return;
          }

          setActivities(runningActivities);
          if (ENABLE_ACTIVITY_CACHE) {
            setCachedActivities(runningActivities, 'running');
          }
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
          const normalizedCached = cached.map(normalizeRunningActivity);
          setActivities(normalizedCached);
          setError('Connessione instabile: sto mostrando dati recenti dalla cache.');
        } else {
          setError('Impossibile caricare le attività. Controlla la connessione al database.');
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

  const filteredActivities = useMemo(() => {
    const filtered = activities.filter((activity) => {
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

    switch (sortBy) {
      case 'date_asc':
        return [...filtered].sort((a, b) => safeTimestamp(a.originalDate) - safeTimestamp(b.originalDate));
      case 'date_desc':
        return [...filtered].sort((a, b) => safeTimestamp(b.originalDate) - safeTimestamp(a.originalDate));
      case 'distance_asc':
        return [...filtered].sort((a, b) => parseFloat(a.distance_km) - parseFloat(b.distance_km));
      case 'distance_desc':
        return [...filtered].sort((a, b) => parseFloat(b.distance_km) - parseFloat(a.distance_km));
      default:
        return filtered;
    }
   }, [activities, filters, sortBy]);

   const activityGridItems = useMemo<CardGridItem[]>(
     () =>
       filteredActivities.map((activity) => ({
         id: activity.id,
         title: activity.name,
         href: `/exploration/running/${activity.id}`,
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

   // Statistiche calcolate per l'hero (su tutte le attività, non filtrate)
   const heroStats = useMemo(() => {
     const totalKm = activities.reduce((sum, a) => sum + parseFloat(a.distance_km), 0);
     const longestKm = activities.length > 0
       ? Math.max(...activities.map(a => parseFloat(a.distance_km)))
       : 0;
     // Record mezza maratona: miglior tempo su attività ~21.1 km (tolleranza +/- 0.5 km)
     const halfMarathonCandidates = activities.filter((a) => {
       const km = parseFloat(a.distance_km);
       const durationSec = typeof a.duration_sec === 'number' && a.duration_sec > 0
         ? a.duration_sec
         : Math.max(0, Math.round(a.duration_min * 60));
       return Number.isFinite(km) && km >= 20.6 && km <= 21.6 && durationSec > 0;
     });
     const bestHalf = halfMarathonCandidates.length > 0
       ? [...halfMarathonCandidates].sort((a, b) => {
           const aSec = typeof a.duration_sec === 'number' && a.duration_sec > 0 ? a.duration_sec : Math.round(a.duration_min * 60);
           const bSec = typeof b.duration_sec === 'number' && b.duration_sec > 0 ? b.duration_sec : Math.round(b.duration_min * 60);
           return aSec - bSec;
         })[0]
       : null;

     return {
       count: activities.length,
       totalKm: totalKm >= 1000
         ? `${(totalKm / 1000).toFixed(1)}k km`
         : `${Math.round(totalKm)} km`,
       longestKm: `${longestKm.toFixed(1)} km`,
       halfMarathonRecord: bestHalf
         ? formatDurationFromSeconds(
             typeof bestHalf.duration_sec === 'number' && bestHalf.duration_sec > 0
               ? bestHalf.duration_sec
               : Math.round(bestHalf.duration_min * 60)
           )
         : 'N/D',
     };
   }, [activities]);

   const bestActivities = useMemo(
     () => [...activities].sort((a, b) => parseFloat(b.distance_km) - parseFloat(a.distance_km)).slice(0, 4),
     [activities]
   );

   const selectedActivity = selectedActivityId ? activities.find((a) => a.id === selectedActivityId) : null;

  if (loading) {
    return (
      <main className="min-h-screen bg-sky-50 dark:bg-slate-900 flex items-center justify-center">
        <p className="text-lg">Caricamento...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-sky-50 dark:bg-slate-900">
      {/* ─── Hero con statistiche integrate ─── */}
      <section className="relative w-full h-[50vh] sm:h-[56vh] overflow-hidden">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{
            backgroundImage:
              'url(https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777450410/running_Large_zorzw2.jpg)',
          }}
        />
        {/* Gradient: forte in basso per leggere sia testo che stats */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/15" />

        {/* Back link */}
        <Link
          href="/exploration"
          className="absolute top-6 left-6 sm:left-10 inline-flex items-center gap-1.5 text-white/75 hover:text-white text-sm font-medium transition z-10"
        >
          ← Exploration
        </Link>

        <Link
          href="/exploration/running/equipment"
          className="absolute top-6 right-6 sm:right-10 inline-flex items-center gap-1.5 text-white/75 hover:text-white text-sm font-medium transition z-10"
        >
          🎽 Attrezzatura
        </Link>

        {/* Content in basso */}
        <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-7 sm:px-10 sm:pb-8">

          {/* Testo principale */}
          <div className="w-full max-w-2xl space-y-2 mb-5 text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Running
            </h1>
            <p className="text-sm sm:text-base text-white/80 max-w-lg mx-auto">
              Corse su strada, pista e allenamenti — progressi, numeri ed emozioni.
            </p>
          </div>

          {/* Barra statistiche — frosted glass */}
          <div className="flex flex-wrap gap-px overflow-hidden rounded-xl border border-white/15 bg-white/10 backdrop-blur-md w-full max-w-3xl mx-auto">
            {[
              { label: 'Attività', value: loading ? '…' : String(heroStats.count) },
              { label: 'Tot. distanza', value: loading ? '…' : heroStats.totalKm },
              { label: 'Longest run', value: loading ? '…' : heroStats.longestKm },
                { label: 'PB mezza maratona', value: loading ? '…' : heroStats.halfMarathonRecord },
            ].map((stat) => (
              <div
                key={stat.label}
                className="flex-1 min-w-[4.5rem] px-4 py-3 flex flex-col gap-0.5"
              >
                <span className="text-[10px] uppercase tracking-widest text-white/55 font-semibold">
                  {stat.label}
                </span>
                <span className="text-xl font-bold text-white leading-none">
                  {stat.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Filtri ─── */}
      <section className="sticky top-[50px] md:top-[50px] z-40 px-4 py-[2px] sm:px-6 lg:px-8 bg-sky-50/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-sky-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto">
          <Filter
            filters={runningFilterConfig}
            tone="current"
            density="compact"
            variant="minimal"
            className="bg-transparent py-0.5"
            onFilterChange={handleFilterChange}
            onReset={resetRunningFilters}
            resetLabel="CLEAR"
            applyLabel="MOSTRA RISULTATI"
          />
        </div>
      </section>

      {/* ─── Griglia attività ─── */}
      <section className="px-4 pt-6 pb-10 sm:px-6 lg:px-8 bg-sky-50 dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          {error && (
            <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200">
              {error}
            </div>
          )}
          <CardGrid
            variant="activity"
            title="Attività recenti"
            subtitle={`${filteredActivities.length} attività`}
            items={activityGridItems}
            columnsClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            sectionClassName="px-0 py-0 bg-transparent"
            cardClassName="border border-slate-300/80 dark:border-slate-700 bg-white dark:bg-slate-900"
            useMotion={false}
            showDate
            showTypeBadge={false}
            sortOptions={[...runningSortOptions]}
            sortValue={sortBy}
            onSortChange={(value) => setSortBy(value as RunningSortValue)}
            sortLabel="Ordina"
            visibleItems={6}
            showVisibilityToggle
            showMoreLabel="Mostra altre attività"
            showLessLabel="Mostra meno"
            showMoreTone="navy"
            showLessTone="navy"
            activityPhotoBadgePosition="border"
            activityPhotoBadgeSize="medium"
            activityPhotoBadgeRounded={false}
            activityTextColor="black"
            onItemClick={(item) => handleActivityClick(item.id)}
          />
          {filteredActivities.length === 0 && (
            <div className="mt-6 rounded-xl border border-slate-300/80 dark:border-slate-700 bg-sky-100/70 dark:bg-slate-900/80 p-8 text-center">
              <p className="text-2xl mb-2">🔍</p>
              <p className="font-semibold text-slate-700 dark:text-slate-200">Nessuna attività trovata</p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Prova a modificare i filtri.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── Riferimenti finali stile pagina Exploration (compact) ─── */}
      <CardGrid
        title="Categorie"
        subtitle="Continua l'esplorazione"
        items={relatedExplorationCards}
        showTypeBadge={false}
        showDate={false}
        showDescription={true}
        columnsClassName="grid grid-cols-1 sm:grid-cols-3 gap-4"
        sectionClassName="px-4 pt-2 pb-8 sm:px-6 lg:px-8 bg-sky-50 dark:bg-slate-900"
        containerClassName="max-w-6xl"
        titleColor="black"
        subtitleColor="black"
        cardClassName="border border-slate-300/80 dark:border-slate-700 bg-white"
        useMotion={false}
        showVisibilityToggle={false}
      />

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