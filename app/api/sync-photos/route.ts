import { NextRequest, NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { connectToDatabase } from '@/lib/db/connection';
import { Activity } from '@/lib/db/models/Activity';
import type { ActivityPhoto } from '@/types/activity';

interface CloudinaryResource {
  public_id: string;
  secure_url: string;
  width?: number;
  height?: number;
  metadata?: {
    activityId?: string | number;
  };
}

interface CloudinarySearchResult {
  resources: CloudinaryResource[];
  next_cursor?: string;
}

function mapToPhoto(resource: CloudinaryResource): ActivityPhoto {
  return {
    public_id: resource.public_id,
    secure_url: resource.secure_url,
    width: resource.width,
    height: resource.height,
  };
}

interface ActivityOwnerDoc {
  _id: unknown;
  activityId?: number;
  source_id?: string;
}

function ownerIdFromDoc(doc: ActivityOwnerDoc): string | null {
  if (typeof doc.activityId === 'number' && Number.isFinite(doc.activityId)) {
    return String(doc.activityId);
  }
  if (typeof doc.source_id === 'string') {
    const trimmed = doc.source_id.trim();
    if (trimmed && /^\d+$/.test(trimmed)) return trimmed;
  }
  return null;
}

function metadataActivityExpression(activityId: string): string {
  // Supporta varianti comuni del field id structured metadata.
  return `metadata.activityId=${activityId} OR metadata.activity_id=${activityId} OR metadata.activityid=${activityId}`;
}

async function searchPhotosByActivityId(activityId: string): Promise<CloudinaryResource[]> {
  const allResources: CloudinaryResource[] = [];
  let nextCursor: string | undefined;

  do {
    let query = cloudinary.search
      .expression(metadataActivityExpression(activityId))
      .with_field('metadata')
      .max_results(100);

    if (nextCursor) {
      query = query.next_cursor(nextCursor);
    }

    const result = (await query.execute()) as CloudinarySearchResult;
    allResources.push(...(result.resources ?? []));
    nextCursor = result.next_cursor;
  } while (nextCursor);

  return allResources;
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

export async function GET(req: NextRequest): Promise<NextResponse> {
  const secret = req.nextUrl.searchParams.get('secret');
  if (!process.env.SYNC_SECRET || secret !== process.env.SYNC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const owners = (await Activity.find(
      { source: 'garmin' },
      { _id: 1, activityId: 1, source_id: 1 }
    ).lean()) as ActivityOwnerDoc[];

    const ownerByActivityId = new Map<string, unknown>();
    for (const owner of owners) {
      const ownerId = ownerIdFromDoc(owner);
      if (!ownerId) continue;
      ownerByActivityId.set(ownerId, owner._id);
    }

    const grouped: Record<string, ActivityPhoto[]> = {};
    let scannedOwners = 0;

    for (const activityId of ownerByActivityId.keys()) {
      scannedOwners += 1;
      const resources = await searchPhotosByActivityId(activityId);
      if (!resources.length) continue;

      const uniqueByPublicId = new Map<string, ActivityPhoto>();
      for (const resource of resources) {
        uniqueByPublicId.set(resource.public_id, mapToPhoto(resource));
      }
      grouped[activityId] = [...uniqueByPublicId.values()];
    }

    let updated = 0;
    let notFound = 0;
    let cleanedAssociations = 0;
    const ownerDocByPublicId = new Map<string, unknown>();

    for (const [activityId, photos] of Object.entries(grouped)) {
      const result = await Activity.findOneAndUpdate(
        buildActivityMatchFilter(activityId),
        { $set: { photos } },
        { returnDocument: 'after' }
      );

      if (result) {
        updated += 1;
        for (const photo of photos) {
          ownerDocByPublicId.set(photo.public_id, result._id);
        }
      } else {
        notFound += 1;
      }
    }

    for (const [publicId, ownerDocId] of ownerDocByPublicId.entries()) {
      const cleanupRes = await Activity.updateMany(
        {
          _id: { $ne: ownerDocId },
          'photos.public_id': publicId,
        },
        {
          $pull: { photos: { public_id: publicId } },
        }
      );
      cleanedAssociations += cleanupRes.modifiedCount ?? 0;
    }

    return NextResponse.json({
      ok: true,
      scannedOwners,
      ownersWithPhotos: Object.keys(grouped).length,
      updated,
      notFound,
      cleanedAssociations,
    });
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : JSON.stringify(error);
    console.error('[sync-photos] error:', errMsg);
    return NextResponse.json(
      { error: 'Internal server error', detail: errMsg },
      { status: 500 }
    );
  }
}
