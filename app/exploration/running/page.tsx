"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shirt, SlidersHorizontal } from 'lucide-react';
import { Filter, type FilterConfig, type FilterState } from '@/components/Filter';
import { Modal } from '@/components/Modal';
import { Divider, PageShell, CardGrid, type CardGridItem } from '@/components/generic';
import { getCachedActivities, setCachedActivities } from '@/lib/cache/activities';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';

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
    image: 'https://res.cloudinary.com/derbnvxif/image/upload/v1777886949/MZEXPLORATION_1_vm9xop.png',
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
  const [sortBy, setSortBy] = useState<RunningSortValue>('date_desc');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const frame = window.requestAnimationFrame(() => setIsDesktop(mediaQuery.matches));

    const onChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    mediaQuery.addEventListener('change', onChange);
    return () => {
      window.cancelAnimationFrame(frame);
      mediaQuery.removeEventListener('change', onChange);
    };
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
        const response = await fetch('/api/activities/garmin?group=running', {
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
              const distanceM = act.distance_m ?? 0;
              const durationSec = act.duration_sec ?? 0;
              const dateIso = act.date ?? new Date(0).toISOString();

              return {
                id: act._id ?? `${act.name}-${dateIso}-${distanceM}-${index}`,
                name: act.name,
                type: act.type,
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


   const selectedActivity = selectedActivityId ? activities.find((a) => a.id === selectedActivityId) : null;

  if (loading) {
    return (
      <PageShell background="sky" className="flex items-center justify-center">
        <p className="text-lg">Caricamento...</p>
      </PageShell>
    );
  }

    return (
      <PageShell background="sky" className="run-main-1" data-testid="run-main-1">
        {/* ─── Hero con statistiche integrate ─── */}
        <section className="relative w-full h-[34vh] sm:h-[38vh] overflow-hidden run-hero-2" data-testid="run-hero-2">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 run-hero-background-2"
            style={{
              backgroundImage:
                'url(https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777450410/running_Large_zorzw2.jpg)',
            }}
          />
          {/* Gradient: forte in basso per leggere sia testo che stats */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/15 run-hero-overlay-2" />

          {/* Back link */}
          <Link
            href="/exploration"
            className="absolute top-6 left-6 sm:left-10 hidden sm:inline-flex items-center gap-1.5 text-white hover:text-white text-sm font-medium transition z-10 run-back-link-2"
            data-testid="run-back-link-2"
          >
            ← Exploration
          </Link>

          <Link
            href="/exploration/running/equipment"
            className="absolute top-6 right-6 sm:right-10 hidden sm:inline-flex items-center gap-1.5 text-white/75 hover:text-white text-sm font-medium transition z-10 run-equipment-link-2"
            data-testid="run-equipment-link-2"
          >
            Attrezzatura <Shirt className="h-4 w-4" />
          </Link>

          {/* Content in basso */}
          <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-7 sm:px-10 sm:pb-8 run-hero-content-2">

            {/* Testo principale */}
            <div className="w-full max-w-2xl space-y-2 mb-5 text-center run-hero-text-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight run-title-2" data-testid="run-title-2">
                Running
              </h1>
              <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto run-subtitle-2" data-testid="run-subtitle-2">
                Corse su strada, pista e allenamenti — progressi, numeri ed emozioni.
              </p>
            </div>

            {/* Barra statistiche — frosted glass */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-xl border border-white/15 bg-white/10 backdrop-blur-md w-full max-w-sm sm:max-w-3xl mx-auto run-stats-bar-2" data-testid="run-stats-bar-2">
              {[
                { label: 'Attività', mobileLabel: 'Attività', value: loading ? '…' : String(heroStats.count), testId: 'stats-count', hideOnMobile: true },
                { label: 'Tot. distanza', mobileLabel: 'Tot km percorsi', value: loading ? '…' : heroStats.totalKm, testId: 'stats-total-distance', hideOnMobile: false },
                { label: 'Longest run', mobileLabel: 'Longest', value: loading ? '…' : heroStats.longestKm, testId: 'stats-longest', hideOnMobile: true },
                { label: 'PB mezza maratona', mobileLabel: 'PB half', value: loading ? '…' : heroStats.halfMarathonRecord, testId: 'stats-pb-half', hideOnMobile: false },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className={`px-3 py-2.5 sm:px-4 sm:py-3 flex flex-col gap-0.5 run-stat-item-2 ${stat.hideOnMobile ? 'hidden sm:flex' : 'flex'}`}
                  data-testid={`run-stat-${stat.testId}-2`}
                >
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.08em] sm:tracking-widest text-white/55 font-semibold run-stat-label-2">
                    <span className="sm:hidden">{stat.mobileLabel}</span>
                    <span className="hidden sm:inline">{stat.label}</span>
                  </span>
                  <span className="text-lg sm:text-xl font-bold text-white leading-none run-stat-value-2">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Filtri ─── */}
        <section className="sticky top-12 md:top-12 z-40 relative px-4 py-[2px] sm:px-6 lg:px-8 bg-sky-50/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-sky-200/80 dark:border-slate-800 shadow-[0_16px_32px_-16px_rgba(15,23,42,0.5)] after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-3 after:h-3 after:bg-gradient-to-b after:from-black/30 after:to-transparent dark:after:from-black/45 run-filters-3" data-testid="run-filters-3">
          <div className="max-w-6xl mx-auto">
            <Filter
              filters={runningFilterConfig}
              tone="current"
              density="compact"
              variant="minimal"
              className="bg-transparent py-0.5 [&_input]:text-slate-800 dark:[&_input]:text-slate-200 [&_input]:placeholder:text-slate-800/80 dark:[&_input]:placeholder:text-slate-200/80"
              onFilterChange={handleFilterChange}
              onReset={resetRunningFilters}
              resetLabel="CLEAR"
              applyLabel="MOSTRA RISULTATI"
              data-testid="run-filter-component-3"
            />
          </div>
        </section>

        {/* ─── Griglia attività ─── */}
        <section className="px-4 pt-6 pb-10 sm:px-6 lg:px-8 run-activities-4" data-testid="run-activities-4">
          <div className="max-w-6xl mx-auto">
            {error && (
              <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-200 run-error-4" data-testid="run-error-4">
                {error}
              </div>
            )}

            {!isDesktop && (
              <div className="mb-4 flex items-start justify-between gap-4" data-testid="run-mobile-header-sort-4">
                <div>
                  <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white leading-none">Attività recenti</h2>
                  <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{filteredActivities.length} attività</p>
                </div>
                <Select value={sortBy} onValueChange={(value) => setSortBy(value as RunningSortValue)}>
                  <SelectTrigger
                    className="h-10 w-10 shrink-0 justify-center rounded-lg border border-slate-300 bg-white p-0 text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 [&_svg.size-4]:hidden"
                    aria-label="Ordina attività"
                  >
                    <span className="sr-only">Ordina attività</span>
                    <SlidersHorizontal className="h-4 w-4" />
                  </SelectTrigger>
                  <SelectContent>
                    {runningSortOptions.map((option) => (
                      <SelectItem key={`run-mobile-sort-${option.value}`} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <CardGrid
              variant="activity"
              title={isDesktop ? 'Attività recenti' : ''}
              subtitle={isDesktop ? `${filteredActivities.length} attività` : ''}
              items={activityGridItems}
              columnsClassName="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
              sectionClassName="px-0 py-0 bg-transparent"
              cardClassName="border-slate-300/80 bg-white dark:border-slate-500/90 dark:border-2 dark:bg-slate-950/40"
              useMotion={false}
              showDate
              showTypeBadge={false}
              sortOptions={isDesktop ? [...runningSortOptions] : undefined}
              sortValue={sortBy}
              onSortChange={isDesktop ? (value) => setSortBy(value as RunningSortValue) : undefined}
              sortLabel="Ordina"
              visibleItems={6}
              showVisibilityToggle
              showMoreLabel="Mostra altre attività"
              showLessLabel="Mostra meno"
              showMoreTone="current"
              showLessTone="current"
              visibilityToggleClassName="[&_button.cardgrid-show-less]:border [&_button.cardgrid-show-less]:border-slate-900 [&_button.cardgrid-show-less]:bg-white [&_button.cardgrid-show-less]:text-slate-900 [&_button.cardgrid-show-less]:hover:bg-slate-100 [&_button.cardgrid-show-less]:dark:border-slate-900 [&_button.cardgrid-show-less]:dark:bg-white [&_button.cardgrid-show-less]:dark:text-slate-900 [&_button.cardgrid-show-less]:dark:hover:bg-slate-100"
              activityPhotoBadgePosition="border"
              activityPhotoBadgeSize="medium"
              activityPhotoBadgeRounded={false}
              activityTextColor="black"
              onItemClick={(item) => handleActivityClick(item.id)}
              data-testid="run-activities-grid-4"
            />
            {filteredActivities.length === 0 && (
              <div className="mt-6 rounded-xl border border-slate-300/80 dark:border-slate-700 bg-sky-100/70 dark:bg-slate-900/80 p-8 text-center run-no-activities-4" data-testid="run-no-activities-4">
                <p className="text-2xl mb-2">🔍</p>
                <p className="font-semibold text-slate-700 dark:text-slate-200">Nessuna attività trovata</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Prova a modificare i filtri.</p>
              </div>
            )}
          </div>
        </section>

        {/* ─── Sezione Attrezzatura ─── */}
        <section className="px-4 pb-6 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between rounded-xl border border-slate-300/80 dark:border-slate-700 bg-white dark:bg-slate-800 px-5 py-4">
              <div>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">La mia attrezzatura</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Scarpe, abbigliamento e accessori</p>
              </div>
              <Link
                href="/exploration/running/equipment"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 dark:bg-slate-700 text-white text-sm font-medium hover:bg-black dark:hover:bg-slate-600 transition-colors"
              >
                Attrezzatura
                <Shirt className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <Divider tone="blue" size="sm" data-testid="run-divider-5" />

        {/* ─── Riferimenti finali stile pagina Exploration (compact) ─── */}
        <CardGrid
          title="Categorie"
          subtitle="Continua l'esplorazione"
          items={relatedExplorationCards}
          showTypeBadge={false}
          showDate={false}
          showDescription={true}
          columnsClassName="grid grid-cols-1 sm:grid-cols-3 gap-4"
          sectionClassName="px-4 pt-2 pb-8 sm:px-6 lg:px-8"
          containerClassName="max-w-6xl"
          titleColor="current"
          subtitleColor="current"
          cardClassName="border-slate-300/80 bg-white dark:border-slate-500/90 dark:border-2 dark:bg-slate-950/40"
          useMotion={false}
          showVisibilityToggle={false}
          data-testid="run-related-categories-5"
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
            data-testid="run-activity-modal-5"
          />
        )}
      </PageShell>
    );
}