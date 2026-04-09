import { connectToDatabase } from '@/lib/db/connection';
import { Activity } from '@/lib/db/models/Activity';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  try {
    await connectToDatabase();

    // Recupera tutte le attività ordinate per data
    const activities = await Activity.find()
      .sort({ date: -1 })
      .lean();

    // Calcola statistiche
    const stats = {
      total_activities: activities.length,
      by_type: {} as Record<string, number>,
      by_source: {} as Record<string, number>,
      total_distance: 0,
      total_duration: 0,
      total_calories: 0,
    };

    activities.forEach((act) => {
      // Per tipo
      stats.by_type[act.type] = (stats.by_type[act.type] || 0) + 1;

      // Per sorgente
      stats.by_source[act.source] = (stats.by_source[act.source] || 0) + 1;

      // Totali
      stats.total_distance += act.distance || 0;
      stats.total_duration += act.duration || 0;
      stats.total_calories += act.calories || 0;
    });

    return NextResponse.json({
      status: 'success',
      data: {
        activities: activities.map((a) => ({
          id: a._id,
          name: a.name,
          type: a.type,
          date: a.date,
          distance_km: (a.distance / 1000).toFixed(2),
          duration_min: Math.round(a.duration / 60),
          elevation_m: a.elevation_gain || 0,
          calories: a.calories || 0,
          source: a.source,
          avg_speed_ms: a.avg_speed?.toFixed(2) || 0,
          created_at: a.created_at,
        })),
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

