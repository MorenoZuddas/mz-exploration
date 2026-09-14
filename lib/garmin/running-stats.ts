const RUN_TYPES = new Set([
  'running',
  'track_running',
  'trail_running',
  'road_running',
  'virtual_running',
  'indoor_running',
  'treadmill_running',
  'run',
]);

export type RunningActivityLike = {
  type?: string | null;
  distance_m?: number | null;
  duration_sec?: number | null;
  raw?: Record<string, unknown> | null;
};

export type RunningStats = {
  totalActivities: number;
  totalRuns: number;
  totalDistanceRunsKm: number;
  totalRunningHours: number;
  longestRunKm: number | null;
  pb1000Sec: number | null;
  pbMileSec: number | null;
  pb5000Sec: number | null;
  pb10000Sec: number | null;
  pbHalfSec: number | null;
};

const DISTANCE_TOLERANCE_M = 150;
const MILE_M = 1609.34;
const MONGO_DISTANCE_IS_CM_THRESHOLD = 100_000;
const SPLIT_TYPES = new Set([17]);

function isRunningType(type?: string | null): boolean {
  return RUN_TYPES.has((type ?? '').toLowerCase());
}

function computeExactDistancePb(activities: RunningActivityLike[], targetDistanceM: number): number | null {
  const minDistance = targetDistanceM - DISTANCE_TOLERANCE_M;
  const maxDistance = targetDistanceM + DISTANCE_TOLERANCE_M;

  const candidates = activities
    .filter((activity) => isRunningType(activity.type))
    .map((activity) => {
      const distance = activity.distance_m ?? 0;
      const duration = activity.duration_sec ?? 0;
      if (!distance || !duration) return null;
      if (distance < minDistance || distance > maxDistance) return null;
      return {
        duration,
        distanceDelta: Math.abs(distance - targetDistanceM),
      };
    })
    .filter((value): value is { duration: number; distanceDelta: number } => value !== null);

  if (candidates.length === 0) return null;

  candidates.sort((left, right) => {
    if (left.distanceDelta !== right.distanceDelta) {
      return left.distanceDelta - right.distanceDelta;
    }
    return left.duration - right.duration;
  });

  return candidates[0]?.duration ?? null;
}

function normalizeDistanceMeters(distance?: number | null): number {
  if (!distance || !Number.isFinite(distance)) return 0;
  return distance > MONGO_DISTANCE_IS_CM_THRESHOLD ? distance / 100 : distance;
}

function normalizeDurationSeconds(duration?: number | null): number {
  if (!duration || !Number.isFinite(duration)) return 0;
  return duration > 100_000 ? duration / 1000 : duration;
}

function readSplitMetric(measurements: unknown, field: string): number | null {
  if (!Array.isArray(measurements)) return null;
  for (const entry of measurements) {
    if (!entry || typeof entry !== 'object') continue;
    const record = entry as { fieldEnum?: unknown; value?: unknown; valid?: unknown };
    if (record.fieldEnum !== field) continue;
    if (record.valid === false) continue;
    if (typeof record.value === 'number' && Number.isFinite(record.value)) return record.value;
  }
  return null;
}

function computeSplitPb(activities: RunningActivityLike[], targetDistanceM: number): number | null {
  let best: number | null = null;

  for (const activity of activities) {
    const raw = activity.raw;
    if (!raw || typeof raw !== 'object') continue;
    const splits = (raw as { splits?: unknown }).splits;
    if (!Array.isArray(splits)) continue;

    for (const split of splits) {
      if (!split || typeof split !== 'object') continue;
      const record = split as { type?: unknown; measurements?: unknown };
      if (typeof record.type !== 'number' || !SPLIT_TYPES.has(record.type)) continue;

      const distanceCm = readSplitMetric(record.measurements, 'SUM_DISTANCE');
      const durationMs =
        readSplitMetric(record.measurements, 'SUM_MOVINGDURATION') ??
        readSplitMetric(record.measurements, 'SUM_DURATION') ??
        readSplitMetric(record.measurements, 'SUM_ELAPSEDDURATION');

      if (distanceCm === null || durationMs === null) continue;

      const distanceM = distanceCm / 100;
      const durationSec = durationMs / 1000;
      if (Math.abs(distanceM - targetDistanceM) > DISTANCE_TOLERANCE_M) continue;
      if (durationSec <= 0) continue;

      if (best === null || durationSec < best) {
        best = durationSec;
      }
    }
  }

  return best;
}

export function buildRunningStats(activities: RunningActivityLike[]): RunningStats {
  const normalizedActivities = activities.map((activity) => ({
    ...activity,
    distance_m: normalizeDistanceMeters(activity.distance_m),
    duration_sec: normalizeDurationSeconds(activity.duration_sec),
  }));
  const running = normalizedActivities.filter((activity) => isRunningType(activity.type));
  const totalDistanceRunsKm = running.reduce((sum, activity) => sum + ((activity.distance_m ?? 0) / 1000), 0);
  const totalRunningHours = running.reduce((sum, activity) => sum + ((activity.duration_sec ?? 0) / 3600), 0);
  const longestRunKm = running.length > 0
    ? Math.max(...running.map((activity) => (activity.distance_m ?? 0) / 1000))
    : null;

  return {
    totalActivities: activities.length,
    totalRuns: running.length,
    totalDistanceRunsKm,
    totalRunningHours,
    longestRunKm,
    pb1000Sec: computeSplitPb(normalizedActivities, 1000) ?? computeExactDistancePb(running, 1000),
    pbMileSec: computeSplitPb(normalizedActivities, MILE_M) ?? computeExactDistancePb(running, MILE_M),
    pb5000Sec: computeExactDistancePb(running, 5000),
    pb10000Sec: computeExactDistancePb(running, 10000),
    pbHalfSec: computeExactDistancePb(running, 21097),
  };
}
