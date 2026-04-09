import { connectToDatabase } from '@/lib/db/connection';
import { Activity } from '@/lib/db/models/Activity';
import { SyncLog } from '@/lib/db/models/SyncLog';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  try {
    console.log('📊 Status check...');

    await connectToDatabase();

    // Conta documenti
    const activitiesCount = await Activity.countDocuments();
    const syncLogsCount = await SyncLog.countDocuments();

    // Ultimi inserimenti
    const recentActivities = await Activity.find()
      .sort({ created_at: -1 })
      .limit(3)
      .lean();

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
        activities: recentActivities.map((a) => ({
          name: a.name,
          type: a.type,
          date: a.date,
          distance: a.distance,
          source: a.source,
          created_at: a.created_at,
        })),
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

