import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { connectToDatabase } from '@/lib/db/connection';
import { Activity } from '@/lib/db/models/Activity';
import { convertGarminRaw, type GarminRawActivity } from '@/lib/garmin/converter';
import { getAssetsByActivityIds } from '@/lib/cloudinary/server';

interface RouteContext {
  params: Promise<{ id: string }>;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

interface NormalizedPhoto {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
}

function toNumber(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function getString(record: Record<string, unknown>, keys: string[]): string | undefined {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim();
    }
  }
  return undefined;
}

function normalizePhoto(value: unknown): NormalizedPhoto | null {
  if (!isObjectRecord(value)) {
    return null;
  }

  const secureUrl = getString(value, ['secure_url', 'secureUrl']);
  if (!secureUrl) {
    return null;
  }

  const publicId =
    getString(value, ['public_id', 'publicId']) ??
    secureUrl.split('/').pop()?.split('.')[0] ??
    'photo';

  return {
    public_id: publicId,
    secure_url: secureUrl,
    width: toNumber(value.width),
    height: toNumber(value.height),
  };
}

function normalizePhotosFromDb(rawActivity: GarminRawActivity): NormalizedPhoto[] {
  const bucket: NormalizedPhoto[] = [];

  const rawPhotos = isObjectRecord(rawActivity) ? rawActivity.photos : undefined;
  if (Array.isArray(rawPhotos)) {
    for (const entry of rawPhotos) {
      const normalized = normalizePhoto(entry);
      if (normalized) {
        bucket.push(normalized);
      }
    }
  }

  const singlePhoto = isObjectRecord(rawActivity) ? rawActivity.photo : undefined;
  const normalizedSingle = normalizePhoto(singlePhoto);
  if (normalizedSingle) {
    bucket.push(normalizedSingle);
  }

  const unique = new Map<string, NormalizedPhoto>();
  for (const photo of bucket) {
    unique.set(photo.public_id, photo);
  }

  return Array.from(unique.values());
}

function resolveNumericActivityId(rawActivity: GarminRawActivity, sourceId: string): number | null {
  if (typeof rawActivity.activityId === 'number' && Number.isFinite(rawActivity.activityId)) {
    return rawActivity.activityId;
  }

  if (/^\d+$/.test(sourceId)) {
    return Number(sourceId);
  }

  return null;
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

    const dbPhotos = normalizePhotosFromDb(rawActivity);
    const numericActivityId = resolveNumericActivityId(payloadSource, converted.source_id);

    let cloudPhotos: NormalizedPhoto[] = [];
    if (numericActivityId) {
      const cloudMap = await getAssetsByActivityIds([numericActivityId]);
      const cloudPhoto = cloudMap.get(numericActivityId);
      if (cloudPhoto) {
        cloudPhotos = [
          {
            public_id: cloudPhoto.publicId,
            secure_url: cloudPhoto.secureUrl,
            width: cloudPhoto.width,
            height: cloudPhoto.height,
          },
        ];
      }
    }

    const finalPhotos = dbPhotos.length > 0 ? dbPhotos : cloudPhotos;

    return NextResponse.json({
      status: 'success',
      data: {
        activity: {
          ...converted,
          _id: serializedId,
          activityId: numericActivityId,
          photos: finalPhotos,
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
