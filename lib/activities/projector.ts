import { convertGarminRaw, GarminRawActivity } from '@/lib/garmin/converter';
import type { ActivityPhoto } from '@/types/activity';

export interface ProjectedActivity {
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
  photos: ActivityPhoto[];
}

function formatDuration(secondsRaw: number | null): string {
  const totalSeconds = Math.max(0, Math.floor(secondsRaw ?? 0));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function projectActivity(raw: GarminRawActivity & { _id?: unknown; activityId?: number; photos?: unknown }): ProjectedActivity {
  const converted = convertGarminRaw(raw);
  const distanceM = converted.distance_m ?? null;
  const photos = Array.isArray(raw.photos) ? (raw.photos as ActivityPhoto[]) : [];

  return {
    id: raw._id ? String(raw._id) : undefined,
    source_id: converted.source_id,
    activityId: typeof raw.activityId === 'number' ? raw.activityId : null,
    name: converted.name,
    type: converted.type,
    date: converted.date ? converted.date.toISOString() : null,
    distance_m: distanceM,
    distance_km: ((distanceM ?? 0) / 1000).toFixed(2),
    distance_formatted: `${((distanceM ?? 0) / 1000).toFixed(2)} km`,
    duration_sec: converted.duration_sec,
    duration_formatted: formatDuration(converted.duration_sec),
    calories_kcal: converted.calories_kcal,
    pace_min_per_km: converted.pace_min_per_km,
    location: converted.location,
    photos,
  };
}

