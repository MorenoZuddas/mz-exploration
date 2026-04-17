import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/connection';
import { Activity } from '@/lib/db/models/Activity';
import { projectActivity } from '@/lib/activities/projector';
import type { GarminRawActivity } from '@/lib/garmin/converter';

interface RouteContext {
  params: Promise<{ id: string }>;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function materializeStoredRaw(
  activity: GarminRawActivity & { _id?: unknown; activityId?: number; photos?: unknown; source_id?: string; raw_payload?: unknown }
): GarminRawActivity & { _id?: unknown; activityId?: number; photos?: unknown } {
  const raw = isObjectRecord(activity.raw_payload) ? (activity.raw_payload as GarminRawActivity) : undefined;

  if (!raw) {
    return activity;
  }

  return {
    ...raw,
    _id: activity._id,
    activityId: activity.activityId ?? raw.activityId,
    source_id: activity.source_id ?? raw.source_id,
    photos: activity.photos,
  };
}

export async function GET(_req: NextRequest, context: RouteContext): Promise<NextResponse> {
  try {
    const { id } = await context.params;
    await connectToDatabase();

    const activity = (await Activity.findById(id).lean()) as (GarminRawActivity & {
      _id?: unknown;
      activityId?: number;
      photos?: unknown;
      source_id?: string;
      raw_payload?: unknown;
    }) | null;

    if (!activity) {
      return NextResponse.json({ status: 'error', message: 'Activity not found' }, { status: 404 });
    }

    const materialized = materializeStoredRaw(activity);

    return NextResponse.json({
      status: 'success',
      data: {
        activity: projectActivity(materialized),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { status: 'error', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}