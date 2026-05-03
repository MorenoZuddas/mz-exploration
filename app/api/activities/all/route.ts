import { connectToDatabase } from '@/lib/db/connection';
import { Activity } from '@/lib/db/models/Activity';
import { type GarminStoredDocument, expandGarminActivitiesFromDocuments, sortExpandedGarminActivities } from '@/lib/garmin/db';
import { NextResponse } from 'next/server';

function formatDuration(durationSec: number): string {
  const total = Math.max(0, Math.floor(durationSec));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  if (total >= 3600) {
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

function formatDistance(distanceM: number): string {
  const km = distanceM / 1000;
  if (km < 10) {
    return `${Math.round(distanceM).toLocaleString('it-IT')} m`;
  }
  return `${km.toFixed(2)} km`;
}

export async function GET(): Promise<NextResponse> {
  try {
    await connectToDatabase();

    const rawDocs = (await Activity.find().lean()) as GarminStoredDocument[];
    const expanded = sortExpandedGarminActivities(expandGarminActivitiesFromDocuments(rawDocs));

    const normalized = expanded.map((entry) => {
      const converted = entry.converted;
      const distanceM = converted.distance_m ?? 0;
      const durationSec = converted.duration_sec ?? 0;

      return {
        id: entry.entryId,
        name: converted.name,
        type: converted.type,
        date: converted.date,
        distance_km: (distanceM / 1000).toFixed(2),
        distance_formatted: formatDistance(distanceM),
        duration_min: Math.round(durationSec / 60),
        duration_formatted: formatDuration(durationSec),
        calories_kcal: converted.calories_kcal ?? 0,
        pace_min_per_km: converted.pace_min_per_km,
        source: converted.source,
        avg_speed_ms: converted.avg_speed_mps?.toFixed(2) ?? '0',
        created_at: entry.createdAt ?? undefined,
      };
    });

    const stats = {
      total_activities: normalized.length,
      by_type: {} as Record<string, number>,
      by_source: {} as Record<string, number>,
      total_distance: 0,
      total_duration: 0,
      total_calories: 0,
    };

    normalized.forEach((act) => {
      stats.by_type[act.type] = (stats.by_type[act.type] || 0) + 1;
      stats.by_source[act.source] = (stats.by_source[act.source] || 0) + 1;
      stats.total_distance += Number.parseFloat(act.distance_km) * 1000;
      stats.total_duration += act.duration_min * 60;
      stats.total_calories += act.calories_kcal;
    });

    return NextResponse.json({
      status: 'success',
      data: {
        activities: normalized,
        statistics: {
          total_activities: stats.total_activities,
          total_distance_km: (stats.total_distance / 1000).toFixed(2),
          total_duration_hours: (stats.total_duration / 3600).toFixed(2),
          total_calories: stats.total_calories,
          by_type: stats.by_type,
          by_source: stats.by_source,
        },
      },
    });
  } catch (error) {
    console.error('❌ Errore:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
