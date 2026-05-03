import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import { Activity } from '@/lib/db/models/Activity';
import { type GarminStoredDocument } from '@/lib/garmin/db';
import { migrateGarminWrapperDocuments } from '@/lib/garmin/migrate';

interface MigrateWrapperBody {
  apply?: boolean;
  limit?: number;
  deleteSourceDocuments?: boolean;
}

function isAuthorized(request: NextRequest): boolean {
  const configuredSecret = process.env.MIGRATION_API_SECRET?.trim();
  if (!configuredSecret) {
    return true;
  }

  const headerSecret = request.headers.get('x-migration-secret')?.trim();
  return headerSecret === configuredSecret;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        {
          status: 'error',
          message: 'Non autorizzato. Imposta l\'header x-migration-secret corretto.',
        },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const body = (await request.json().catch(() => ({}))) as MigrateWrapperBody;
    const docs = (await Activity.find().lean()) as GarminStoredDocument[];

    const result = await migrateGarminWrapperDocuments(docs, {
      apply: Boolean(body.apply),
      limit: body.limit,
      deleteSourceDocuments: body.deleteSourceDocuments,
    });

    return NextResponse.json({
      status: 'success',
      message:
        result.mode === 'apply'
          ? 'Migrazione wrapper Garmin completata.'
          : 'Dry-run completato. Usa {"apply": true} per creare i documenti canonici.',
      data: result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Errore durante la migrazione dei wrapper Garmin.',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

