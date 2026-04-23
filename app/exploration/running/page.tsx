"use client";

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  StatsCard,
} from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface GarminApiActivity {
  _id?: string;
  name: string;
  type: string;
  date: string | null;
  distance_m: number | null;
  duration_sec: number | null;
  calories_kcal?: number | null;
  pace_min_per_km?: number | null;
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
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [displayedCount, setDisplayedCount] = useState(4);
  const [filters, setFilters] = useState({
    dateFrom: undefined as Date | undefined,
    dateTo: undefined as Date | undefined,
    types: [] as string[],
    minDistance: undefined as number | undefined,
    maxDistance: undefined as number | undefined,
  });

  const formatPace = (pace: number | undefined): string => {
    if (!pace || pace <= 0) return 'N/A';
    const min = Math.floor(pace);
    const sec = Math.round((pace % 1) * 60);
    return `${min}:${String(sec).padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/api/activities/garmin');
        const data = await response.json();

        if (data.status === 'success') {
          const source: GarminApiActivity[] = data?.data?.recent_activities ?? [];

          const runningActivities = source
            .map((act) => {
              const resolvedType = inferRunningType(act.name, act.type);
              const distanceM = act.distance_m ?? 0;
              const durationSec = act.duration_sec ?? 0;
              const dateIso = act.date ?? new Date(0).toISOString();

              return {
                id: act._id ?? `${act.name}-${dateIso}-${distanceM}`,
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
              };
            })
            .filter((act) => act.type === 'running' || act.type === 'track_running')
            .sort((a, b) => safeTimestamp(b.originalDate) - safeTimestamp(a.originalDate));

          setActivities(runningActivities);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setLoading(false);
      }
    };

    void fetchActivities();
  }, []);

  const displayedActivities = activities.slice(0, displayedCount);
  const hasMore = activities.length > displayedCount;
  const bestActivities = useMemo(
    () => [...activities].sort((a, b) => parseFloat(b.distance_km) - parseFloat(a.distance_km)).slice(0, 4),
    [activities]
  );

  const loadMore = () => {
    setDisplayedCount((prev) => prev + 4);
  };

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
              href="/exploration/equipment/running"
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayedActivities.map((activity, index) => (
              <Card
                key={activity.id}
                className="p-6 hover:shadow-lg transition-shadow"
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
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {activity.distance_formatted}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Tempo</p>
                    <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {activity.duration_formatted}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Pace</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {formatPace(activity.pace_min_per_km)} min/km
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Kcal</p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-white">
                      {activity.calories_kcal || '—'}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          {hasMore && (
            <div className="mt-6 text-center">
              <button
                onClick={loadMore}
                className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Mostra Altro
              </button>
            </div>
          )}
        </div>
      </section>

      {/* My Best Section with Carousel */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 bg-slate-100 dark:bg-slate-700">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
            My Best
          </h2>
          <div className="space-y-4">
            <Carousel
              orientation="horizontal"
              opts={{ align: "start" }}
              className="mx-auto w-full max-w-4xl"
              data-name="carousel"
            >
              <CarouselContent>
                {bestActivities.map((activity, index) => (
                  <CarouselItem key={activity.id} className="md:basis-1/1">
                    <Card className="flex min-h-[320px] flex-col" dataName={`carousel card ${index + 1}`}>
                      <CardHeader>
                        <CardTitle>{activity.name}</CardTitle>
                        <CardDescription>{activity.date}</CardDescription>
                      </CardHeader>
                      <CardContent className="flex-1">
                        <p className="text-sm text-muted-foreground">
                          Distanza: {activity.distance_formatted}<br/>
                          Tempo: {activity.duration_formatted}<br/>
                          Pace: {formatPace(activity.pace_min_per_km)} min/km<br/>
                          Kcal: {activity.calories_kcal || '—'}
                        </p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Label htmlFor="dateFrom">Da data</Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom ? filters.dateFrom.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFilters((prev) => ({ ...prev, dateFrom: e.target.value ? new Date(e.target.value) : undefined }))}
                />
              </div>
              <div>
                <Label htmlFor="dateTo">A data</Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo ? filters.dateTo.toISOString().split('T')[0] : ''}
                  onChange={(e) => setFilters((prev) => ({ ...prev, dateTo: e.target.value ? new Date(e.target.value) : undefined }))}
                />
              </div>
              <div>
                <Label htmlFor="types">Tipo</Label>
                <Select value={filters.types.join(',')} onValueChange={(value) => setFilters((prev) => ({ ...prev, types: value ? value.split(',') : [] }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleziona tipi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="running">Running</SelectItem>
                    <SelectItem value="track_running">Track Running</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="minDistance">Distanza min (m)</Label>
                <Input
                  id="minDistance"
                  type="number"
                  value={filters.minDistance || ''}
                  onChange={(e) => setFilters((prev) => ({ ...prev, minDistance: e.target.value ? parseFloat(e.target.value) : undefined }))}
                />
              </div>
              <div>
                <Label htmlFor="maxDistance">Distanza max (m)</Label>
                <Input
                  id="maxDistance"
                  type="number"
                  value={filters.maxDistance || ''}
                  onChange={(e) => setFilters((prev) => ({ ...prev, maxDistance: e.target.value ? parseFloat(e.target.value) : undefined }))}
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() =>
                    setFilters({ dateFrom: undefined, dateTo: undefined, types: [], minDistance: undefined, maxDistance: undefined })
                  }
                >
                  Reset Filtri
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatsCard type="total_runs" activities={activities} filters={filters} dataName="stats-total-runs" />
            <StatsCard type="total_distance" activities={activities} filters={filters} dataName="stats-total-distance" />
            <StatsCard type="longest_run" activities={activities} filters={filters} dataName="stats-longest-run" />
            <StatsCard type="total_hours" activities={activities} filters={filters} dataName="stats-total-hours" />
          </div>
        </div>
      </section>
    </main>
  );
}