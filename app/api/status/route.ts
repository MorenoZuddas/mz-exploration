import { connectToDatabase } from '@/lib/db/connection';
import { Activity } from '@/lib/db/models/Activity';
import { SyncLog } from '@/lib/db/models/SyncLog';
import { convertGarminRaw, GarminRawActivity } from '@/lib/garmin/converter';
import { NextResponse } from 'next/server';

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function GET(): Promise<NextResponse> {
  try {
    console.log('📊 Status check...');

    await connectToDatabase();

    // Conta documenti
    const activitiesCount = await Activity.countDocuments();
    const syncLogsCount = await SyncLog.countDocuments();

    // Ultimi inserimenti
    const recentActivities = (await Activity.find()
      .sort({ created_at: -1 })
      .limit(3)
      .lean()) as GarminRawActivity[];

    const recentLogs = await SyncLog.find()
      .sort({ created_at: -1 })
      .limit(3)
      .lean();

    return NextResponse.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      database: {
        total_activities: activitiesCount,
        total_sync_logs: syncLogsCount,
      },
      recent: {
        activities: recentActivities.map((a) => {
          const payloadSource = isObjectRecord(a.raw_payload)
            ? ({ ...(a as Record<string, unknown>), ...(a.raw_payload as Record<string, unknown>) } as GarminRawActivity)
            : a;
          const converted = convertGarminRaw(payloadSource);
          return {
            name: converted.name,
            type: converted.type,
            date: converted.date,
            distance_m: converted.distance_m,
            calories_kcal: converted.calories_kcal,
            source: converted.source,
            created_at: (a as { created_at?: Date }).created_at,
          };
        }),
        logs: recentLogs.map((l) => ({
          source: l.source,
          status: l.status,
          activities_saved: l.activities_saved,
          created_at: l.created_at,
        })),
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
