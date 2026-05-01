'use client';

import { useEffect, useMemo, useState } from 'react';
import { Card } from '@/components/ui/card';

export type StatisticsMetricKey =
  | 'pb_100'
  | 'pb_200'
  | 'pb_400'
  | 'pb_800'
  | 'pb_1000'
  | 'pb_1500'
  | 'pb_2000'
  | 'pb_5000'
  | 'pb_10000'
  | 'pb_half'
  | 'pb_marathon'
  | 'total_activities'
  | 'total_runs'
  | 'total_trekkings'
  | 'total_distance'
  | 'total_distance_runs'
  | 'longest_run'
  | 'total_running_hours'
  | 'total_trekking_hours';

interface StatisticsFilters {
  dateFrom?: Date;
  dateTo?: Date;
  types?: string[];
  minDistance?: number;
  maxDistance?: number;
}

interface RawActivity {
  id?: string | number;
  type?: string;
  date?: string | null;
  originalDate?: string | null;
  distance_m?: number | null;
  distance_km?: string;
  duration_sec?: number | null;
  duration_min?: number;
}

interface StatisticsProps {
  metrics: StatisticsMetricKey[];
  activities?: RawActivity[];
  filters?: StatisticsFilters;
  syncChannel?: string;
  fetchIfMissing?: boolean;
  endpoint?: string;
  tone?: 'current' | 'blue' | 'purple' | 'black';
  backgroundColor?: 'white' | 'blue' | 'purple' | 'navy' | 'slate';
  columns?: 2 | 3 | 4;
  className?: string;
}

const METRIC_LABELS: Record<StatisticsMetricKey, string> = {
  pb_100: 'PB 100m',
  pb_200: 'PB 200m',
  pb_400: 'PB 400m',
  pb_800: 'PB 800m',
  pb_1000: 'PB 1000m',
  pb_1500: 'PB 1500m',
  pb_2000: 'PB 2000m',
  pb_5000: 'PB 5000m',
  pb_10000: 'PB 10000m',
  pb_half: 'PB Half',
  pb_marathon: 'PB Marathon',
  total_activities: 'Attivita Totali',
  total_runs: 'Corse Totali',
  total_trekkings: 'Trekking Totali',
  total_distance: 'Distanza Totale',
  total_distance_runs: 'Distanza Corsa',
  longest_run: 'Run Piu Lunga',
  total_running_hours: 'Ore di Corsa',
  total_trekking_hours: 'Ore di Trekking',
};

const PB_DISTANCES: Record<StatisticsMetricKey, number | null> = {
  pb_100: 100,
  pb_200: 200,
  pb_400: 400,
  pb_800: 800,
  pb_1000: 1000,
  pb_1500: 1500,
  pb_2000: 2000,
  pb_5000: 5000,
  pb_10000: 10000,
  pb_half: 21097,
  pb_marathon: 42195,
  total_activities: null,
  total_runs: null,
  total_trekkings: null,
  total_distance: null,
  total_distance_runs: null,
  longest_run: null,
  total_running_hours: null,
  total_trekking_hours: null,
};

function toDistanceMeters(activity: RawActivity): number {
  if (typeof activity.distance_m === 'number' && Number.isFinite(activity.distance_m)) return activity.distance_m;
  if (typeof activity.distance_km === 'string') {
    const km = Number.parseFloat(activity.distance_km);
    if (Number.isFinite(km)) return km * 1000;
  }
  return 0;
}

function toDurationSeconds(activity: RawActivity): number {
  if (typeof activity.duration_sec === 'number' && Number.isFinite(activity.duration_sec)) return activity.duration_sec;
  if (typeof activity.duration_min === 'number' && Number.isFinite(activity.duration_min)) return activity.duration_min * 60;
  return 0;
}

function toActivityDate(activity: RawActivity): Date {
  const source = activity.originalDate ?? activity.date ?? null;
  const date = source ? new Date(source) : new Date(0);
  return Number.isNaN(date.getTime()) ? new Date(0) : date;
}

function normalizeType(type?: string): string {
  return (type || '').trim().toLowerCase();
}

function isRunning(type?: string): boolean {
  const t = normalizeType(type);
  return t === 'running' || t === 'track_running' || t === 'trail_running' || t === 'road_running';
}

function isTrekking(type?: string): boolean {
  const t = normalizeType(type);
  return t === 'trekking' || t === 'hiking';
}

function formatSeconds(totalSeconds: number): string {
  const safe = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function useAnimatedNumber(target: number): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const duration = Math.min(5000, Math.max(800, Math.abs(target) * 8));
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  return value;
}

function applyFilters(activities: RawActivity[], filters?: StatisticsFilters): RawActivity[] {
  if (!filters) return activities;

  return activities.filter((activity) => {
    const date = toActivityDate(activity);
    if (filters.dateFrom && date < filters.dateFrom) return false;
    if (filters.dateTo && date > filters.dateTo) return false;

    const distance = toDistanceMeters(activity);
    if (typeof filters.minDistance === 'number' && distance < filters.minDistance) return false;
    if (typeof filters.maxDistance === 'number' && distance > filters.maxDistance) return false;

    if (filters.types && filters.types.length > 0) {
      const type = normalizeType(activity.type);
      if (!filters.types.map(normalizeType).includes(type)) return false;
    }

    return true;
  });
}

function computePbSeconds(activities: RawActivity[], targetDistance: number): number | null {
  const candidates = activities
    .filter((a) => isRunning(a.type))
    .map((a) => {
      const distance = toDistanceMeters(a);
      const duration = toDurationSeconds(a);
      if (distance <= 0 || duration <= 0 || distance < targetDistance) return null;
      return (duration * targetDistance) / distance;
    })
    .filter((v): v is number => typeof v === 'number' && Number.isFinite(v));

  if (candidates.length === 0) return null;
  return Math.min(...candidates);
}

function findPbActivity(activities: RawActivity[], targetDistance: number): RawActivity | null {
  let bestActivity: RawActivity | null = null;
  let bestTime = Infinity;

  for (const a of activities.filter((a) => isRunning(a.type))) {
    const distance = toDistanceMeters(a);
    const duration = toDurationSeconds(a);
    if (distance <= 0 || duration <= 0 || distance < targetDistance) continue;
    const projectedTime = (duration * targetDistance) / distance;
    if (projectedTime < bestTime) {
      bestTime = projectedTime;
      bestActivity = a;
    }
  }

  return bestActivity;
}

function findLongestRunActivity(activities: RawActivity[]): RawActivity | null {
  const runs = activities.filter((a) => isRunning(a.type));
  if (runs.length === 0) return null;
  return runs.reduce((max, a) => (toDistanceMeters(a) > toDistanceMeters(max) ? a : max));
}

interface CalculatedMetric {
  value: number | null;
  activityId?: string | number;
  activityDate?: Date;
}

function parseFilterState(state: Record<string, string>): StatisticsFilters {
  return {
    dateFrom: state.dateStart ? new Date(state.dateStart) : undefined,
    dateTo: state.dateEnd ? new Date(state.dateEnd) : undefined,
    types: state.activityType ? [state.activityType] : [],
    minDistance: state.distanceMin ? Number.parseFloat(state.distanceMin) : undefined,
    maxDistance: state.distanceMax ? Number.parseFloat(state.distanceMax) : undefined,
  };
}

export function Statistics({
  metrics,
  activities,
  filters,
  syncChannel,
  fetchIfMissing = true,
  endpoint = '/api/activities/all',
  tone = 'current',
  backgroundColor = 'white',
  columns = 4,
  className = '',
}: StatisticsProps) {
  const [internalActivities, setInternalActivities] = useState<RawActivity[]>(activities ?? []);
  const [loading, setLoading] = useState(false);
  const [sharedFilters, setSharedFilters] = useState<StatisticsFilters | undefined>(undefined);

  useEffect(() => {
    if (activities && activities.length > 0) {
      setInternalActivities(activities);
    }
  }, [activities]);

  useEffect(() => {
    if (!syncChannel) return;

    const eventName = `mz-filter:${syncChannel}`;
    const handler = (event: Event) => {
      const custom = event as CustomEvent<Record<string, string>>;
      setSharedFilters(parseFilterState(custom.detail || {}));
    };

    window.addEventListener(eventName, handler as EventListener);
    return () => window.removeEventListener(eventName, handler as EventListener);
  }, [syncChannel]);

  useEffect(() => {
    if (!fetchIfMissing || internalActivities.length > 0) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(endpoint);
        if (!response.ok) return;
        const data = await response.json();
        const fromApi = data?.data?.activities;
        if (Array.isArray(fromApi)) {
          setInternalActivities(fromApi as RawActivity[]);
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [endpoint, fetchIfMissing, internalActivities.length]);

  const activeFilters = filters ?? sharedFilters;
  const filteredActivities = useMemo(() => applyFilters(internalActivities, activeFilters), [internalActivities, activeFilters]);

  const calculated = useMemo(() => {
    const all = filteredActivities;
    const running = all.filter((a) => isRunning(a.type));
    const trekking = all.filter((a) => isTrekking(a.type));

    const result: Record<StatisticsMetricKey, CalculatedMetric> = {
      pb_100: (() => {
        const activity = findPbActivity(all, 100);
        return { value: computePbSeconds(all, 100), activityId: activity?.id, activityDate: activity ? toActivityDate(activity) : undefined };
      })(),
      pb_200: (() => {
        const activity = findPbActivity(all, 200);
        return { value: computePbSeconds(all, 200), activityId: activity?.id, activityDate: activity ? toActivityDate(activity) : undefined };
      })(),
      pb_400: (() => {
        const activity = findPbActivity(all, 400);
        return { value: computePbSeconds(all, 400), activityId: activity?.id, activityDate: activity ? toActivityDate(activity) : undefined };
      })(),
      pb_800: (() => {
        const activity = findPbActivity(all, 800);
        return { value: computePbSeconds(all, 800), activityId: activity?.id, activityDate: activity ? toActivityDate(activity) : undefined };
      })(),
      pb_1000: (() => {
        const activity = findPbActivity(all, 1000);
        return { value: computePbSeconds(all, 1000), activityId: activity?.id, activityDate: activity ? toActivityDate(activity) : undefined };
      })(),
      pb_1500: (() => {
        const activity = findPbActivity(all, 1500);
        return { value: computePbSeconds(all, 1500), activityId: activity?.id, activityDate: activity ? toActivityDate(activity) : undefined };
      })(),
      pb_2000: (() => {
        const activity = findPbActivity(all, 2000);
        return { value: computePbSeconds(all, 2000), activityId: activity?.id, activityDate: activity ? toActivityDate(activity) : undefined };
      })(),
      pb_5000: (() => {
        const activity = findPbActivity(all, 5000);
        return { value: computePbSeconds(all, 5000), activityId: activity?.id, activityDate: activity ? toActivityDate(activity) : undefined };
      })(),
      pb_10000: (() => {
        const activity = findPbActivity(all, 10000);
        return { value: computePbSeconds(all, 10000), activityId: activity?.id, activityDate: activity ? toActivityDate(activity) : undefined };
      })(),
      pb_half: (() => {
        const activity = findPbActivity(all, 21097);
        return { value: computePbSeconds(all, 21097), activityId: activity?.id, activityDate: activity ? toActivityDate(activity) : undefined };
      })(),
      pb_marathon: (() => {
        const activity = findPbActivity(all, 42195);
        return { value: computePbSeconds(all, 42195), activityId: activity?.id, activityDate: activity ? toActivityDate(activity) : undefined };
      })(),
      total_activities: { value: all.length },
      total_runs: { value: running.length },
      total_trekkings: { value: trekking.length },
      total_distance: { value: all.reduce((sum, a) => sum + toDistanceMeters(a), 0) / 1000 },
      total_distance_runs: { value: running.reduce((sum, a) => sum + toDistanceMeters(a), 0) / 1000 },
      longest_run: (() => {
        const activity = findLongestRunActivity(running);
        return { value: running.reduce((max, a) => Math.max(max, toDistanceMeters(a)), 0) / 1000, activityId: activity?.id, activityDate: activity ? toActivityDate(activity) : undefined };
      })(),
      total_running_hours: { value: running.reduce((sum, a) => sum + toDurationSeconds(a), 0) / 3600 },
      total_trekking_hours: { value: trekking.reduce((sum, a) => sum + toDurationSeconds(a), 0) / 3600 },
    };

    return result;
  }, [filteredActivities]);

  const gridClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns];

  const bgClass = {
    white: 'bg-white',
    blue: 'bg-blue-50 dark:bg-blue-950',
    purple: 'bg-purple-50 dark:bg-purple-950',
    navy: 'bg-slate-900 dark:bg-slate-950',
    slate: 'bg-slate-50 dark:bg-slate-900',
  }[backgroundColor];

  const toneClass = backgroundColor === 'navy'
    ? 'text-white'
    : {
      current: 'text-blue-600 dark:text-blue-400',
      blue: 'text-blue-600 dark:text-blue-300',
      purple: 'text-violet-700 dark:text-violet-300',
      black: 'text-slate-900 dark:text-slate-100',
    }[tone];

  if (loading) {
    return <p className="text-sm text-slate-500">Caricamento statistiche...</p>;
  }

  return (
    <div className={`${bgClass} p-6 rounded-lg`}>
      <div className={`grid ${gridClass} gap-4 ${className}`}>
        {metrics.map((metric) => (
          <StatisticsTile
            key={metric}
            metric={metric}
            label={METRIC_LABELS[metric]}
            data={calculated[metric]}
            toneClass={toneClass}
            isPb={PB_DISTANCES[metric] !== null}
          />
        ))}
      </div>
    </div>
  );
}

function StatisticsTile({
  metric,
  label,
  data,
  toneClass,
  isPb,
}: {
  metric: StatisticsMetricKey;
  label: string;
  data: CalculatedMetric;
  toneClass: string;
  isPb: boolean;
}) {
  const { value, activityId, activityDate } = data;
  const target = value ?? 0;
  const animated = useAnimatedNumber(target);
  const isClickable = isPb || metric === 'longest_run';

  let display = 'N/A';
  if (value !== null) {
    if (isPb) {
      display = formatSeconds(animated);
    } else if (label.includes('Distanza') || label.includes('Run Piu')) {
      display = `${animated.toFixed(2)} km`;
    } else if (label.includes('Ore')) {
      display = `${animated.toFixed(1)} h`;
    } else {
      display = `${Math.round(animated)}`;
    }
  }

  const formatDate = (date?: Date): string => {
    if (!date || date.getTime() === 0) return '';
    return date.toLocaleDateString('it-IT', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const handleClick = () => {
    if (isClickable && activityId) {
      window.location.href = `/exploration/${label.includes('Distanza') && !label.includes('Run Piu') ? 'trekking' : 'running'}/${activityId}`;
    }
  };

  return (
    <Card
      className={`p-4 ${isClickable && activityId ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
      onClick={handleClick}
    >
      <p className={`text-xs ${toneClass} opacity-70 mb-1`}>{label}</p>
      <p className={`text-xl font-bold ${toneClass}`}>{display}</p>
      {isClickable && activityDate && (
        <p className={`text-xs ${toneClass} opacity-60 mt-2`}>{formatDate(activityDate)}</p>
      )}
    </Card>
  );
}

