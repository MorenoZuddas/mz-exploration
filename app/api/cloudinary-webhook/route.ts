import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { connectToDatabase } from '@/lib/db/connection';
import { Activity } from '@/lib/db/models/Activity';
import type { ActivityPhoto } from '@/types/activity';

interface CloudinaryWebhookPayload {
  notification_type?: string;
  metadata?: {
    activityId?: string | number;
  };
  info?: {
    metadata?: {
      activityId?: string | number;
    };
  };
}

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
}

interface CloudinarySearchResult {
  resources: CloudinaryResource[];
}

function mapToPhoto(resource: CloudinaryResource): ActivityPhoto {
  return {
    public_id: resource.public_id,
    secure_url: resource.secure_url,
    width: resource.width,
    height: resource.height,
  };
}

function normalizeActivityId(value: string | number | undefined): string | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return String(value);
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (!trimmed) return null;
    return Number.isNaN(Number(trimmed)) ? null : trimmed;
  }

  return null;
}

function buildActivityMatchFilter(activityId: string): {
  $or: Array<
    { activityId: number } |
    { source: 'garmin'; source_id: string } |
    { source: 'garmin'; source_id: number }
  >;
} {
  return {
    $or: [
      { activityId: Number(activityId) },
      { source: 'garmin', source_id: activityId },
      { source: 'garmin', source_id: Number(activityId) },
    ],
  };
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const rawBody = await req.text();
    const body = JSON.parse(rawBody) as CloudinaryWebhookPayload;

    const signature = req.headers.get('x-cld-signature') ?? '';
    const timestampRaw = req.headers.get('x-cld-timestamp') ?? '';
    const timestamp = Number(timestampRaw);

    if (!Number.isFinite(timestamp) || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 401 });
    }

    const isValid = cloudinary.utils.verifyNotificationSignature(
      rawBody,
      timestamp,
      signature
    );

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const notificationType = body.notification_type;
    const relevantTypes = ['upload', 'resource_update'];
    if (!notificationType || !relevantTypes.includes(notificationType)) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const metadataActivityId =
      body.metadata?.activityId ?? body.info?.metadata?.activityId;
    const activityId = normalizeActivityId(metadataActivityId);

    if (!activityId) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    await connectToDatabase();

    const result = (await cloudinary.search
      .expression(`metadata.activityId=${activityId}`)
      .with_field('metadata')
      .max_results(50)
      .execute()) as CloudinarySearchResult;

    const photos = (result.resources ?? []).map(mapToPhoto);

    const updatedActivity = await Activity.findOneAndUpdate(
      buildActivityMatchFilter(activityId),
      { $set: { photos } },
      { returnDocument: 'after' }
    );

    // Se una foto è stata spostata verso questa activityId, la rimuove dalle altre attività
    const uniquePublicIds = [...new Set(photos.map((p) => p.public_id))];
    let cleanedAssociations = 0;

    if (updatedActivity) {
      for (const publicId of uniquePublicIds) {
        const cleanupRes = await Activity.updateMany(
          {
            _id: { $ne: updatedActivity._id },
            'photos.public_id': publicId,
          },
          {
            $pull: { photos: { public_id: publicId } },
          }
        );
        cleanedAssociations += cleanupRes.modifiedCount ?? 0;
      }
    }

    return NextResponse.json({
      ok: true,
      activityId,
      photosCount: photos.length,
      cleanedAssociations,
      updated: Boolean(updatedActivity),
    });
  } catch (error) {
    console.error('[cloudinary-webhook]', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
