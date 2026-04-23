import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { connectToDatabase } from '@/lib/db/connection';
import { Activity } from '@/lib/db/models/Activity';
import { convertGarminRaw, type GarminRawActivity } from '@/lib/garmin/converter';

interface RouteContext {
  params: Promise<{ id: string }>;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export async function GET(request: NextRequest, context: RouteContext): Promise<NextResponse> {
  try {
    const { id: idFromParams } = await context.params;
    const idFromPath = request.nextUrl.pathname.split('/').pop();
    const id = idFromParams || idFromPath;

    if (!id) {
      return NextResponse.json(
        { status: 'error', message: 'ID attività mancante' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    let rawActivity: GarminRawActivity | null = null;

    if (Types.ObjectId.isValid(id)) {
      rawActivity = (await Activity.findById(id).lean()) as GarminRawActivity | null;
    }

    if (!rawActivity) {
      rawActivity = (await Activity.findOne({ source_id: id }).lean()) as GarminRawActivity | null;
    }

    if (!rawActivity) {
      const numericId = Number(id);
      if (Number.isFinite(numericId)) {
        rawActivity = (await Activity.findOne({ activityId: numericId }).lean()) as GarminRawActivity | null;
      }
    }

    if (!rawActivity) {
      return NextResponse.json(
        { status: 'error', message: 'Attività non trovata' },
        { status: 404 }
      );
    }

    const payloadSource = isObjectRecord(rawActivity.raw_payload)
      ? ({
          ...(rawActivity as Record<string, unknown>),
          ...(rawActivity.raw_payload as Record<string, unknown>),
        } as GarminRawActivity)
      : rawActivity;

    const converted = convertGarminRaw(payloadSource);
    const rawId = (rawActivity as { _id?: unknown })._id;
    const serializedId = rawId !== undefined && rawId !== null ? String(rawId) : undefined;

    return NextResponse.json({
      status: 'success',
      data: {
        activity: {
          ...converted,
          _id: serializedId,
          photos: (rawActivity as { photos?: unknown[] }).photos ?? [],
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Errore durante la lettura attività',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
