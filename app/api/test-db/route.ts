import { connectToDatabase } from '@/lib/db/connection';
import { Activity } from '@/lib/db/models/Activity';
import { SyncLog } from '@/lib/db/models/SyncLog';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  try {
    console.log('🧪 Test connessione database...');

    // 1. Connetti a MongoDB
    await connectToDatabase();
    console.log('✅ MongoDB connesso');

    // 2. Verifica le collections
    const activityCount = await Activity.countDocuments();
    const syncLogCount = await SyncLog.countDocuments();

    console.log(`📊 Activities: ${activityCount}`);
    console.log(`📋 Sync Logs: ${syncLogCount}`);

    return NextResponse.json({
      status: 'success',
      message: '✅ Database connesso e operativo',
      data: {
        mongodb_connected: true,
        collections: {
          activities: activityCount,
          sync_logs: syncLogCount,
        },
      },
    });
  } catch (error) {
    console.error('❌ Errore test database:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: '❌ Errore connessione database',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

