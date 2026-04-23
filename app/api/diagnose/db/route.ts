import { connectToDatabase } from '@/lib/db/connection';
import { Activity } from '@/lib/db/models/Activity';
import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  try {
    console.log('🔍 Diagnosi database in corso...');

    const conn = await connectToDatabase();
    const db = conn.db;

    if (!db) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Database connection object is null',
        },
        { status: 500 }
      );
    }

    const dbName = conn.name;
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map(c => c.name);

    // Conta attività nel database corrente
    const activitiesCount = await Activity.countDocuments();

    // Mostra info specifiche
    const adminDb = db.admin();
    let serverInfo = null;
    try {
      serverInfo = await adminDb.serverInfo();
    } catch {
      // Se non riusciamo a prendere serverInfo, continuiamo
    }

    return NextResponse.json({
      status: 'success',
      database: {
        name: dbName,
        collections: collectionNames,
        activitiesCount,
      },
      environment: {
        MONGODB_URI: process.env.MONGODB_URI ? '***SET***' : 'NOT_SET',
        MONGODB_DB_NAME: process.env.MONGODB_DB_NAME || 'NOT_SET',
      },
      serverInfo: serverInfo ? {
        version: (serverInfo as any)?.version,
        ok: (serverInfo as any)?.ok,
      } : null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: error instanceof Error ? error.message : String(error),
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack?.split('\n').slice(0, 5),
        } : null,
      },
      { status: 500 }
    );
  }
}
