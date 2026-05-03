import { Activity } from '@/lib/db/models/Activity';
import { convertGarminRaw, type GarminRawActivity } from '@/lib/garmin/converter';
import {
  expandGarminActivitiesFromDocument,
  isGarminWrapperDocument,
  type GarminStoredDocument,
} from '@/lib/garmin/db';
import crypto from 'crypto';

export interface GarminWrapperMigrationOptions {
  apply?: boolean;
  limit?: number;
  deleteSourceDocuments?: boolean;
}

export interface GarminWrapperMigrationResult {
  mode: 'dry-run' | 'apply';
  scanned_documents: number;
  wrapper_documents: number;
  activities_found: number;
  upserted_activities: number;
  already_existing_activities: number;
  deleted_wrapper_documents: number;
  failed_wrapper_documents: number;
  errors: Array<{ documentId: string; activityId?: string; error: string }>;
  preview: Array<{
    documentId: string;
    activities: number;
    sampleActivityIds: string[];
    sampleNames: string[];
  }>;
}

function fingerprint(raw: GarminRawActivity): string {
  const converted = convertGarminRaw(raw);
  const data = [
    converted.date?.toISOString() ?? '',
    converted.type,
    Math.round(converted.distance_m ?? 0),
    Math.round(converted.duration_sec ?? 0),
  ].join('_');
  return crypto.createHash('sha256').update(data).digest('hex');
}

function buildDedupFilter(raw: GarminRawActivity, fp: string) {
  const converted = convertGarminRaw(raw);
  if (converted.source_id && !converted.source_id.startsWith('garmin_')) {
    return {
      $or: [
        { source: 'garmin', source_id: converted.source_id },
        { fingerprint: fp },
      ],
    };
  }

  return { fingerprint: fp };
}

function buildCanonicalUpdate(raw: GarminRawActivity) {
  const fp = fingerprint(raw);
  const converted = convertGarminRaw(raw);

  return {
    filter: buildDedupFilter(raw, fp),
    update: {
      $set: {
        name: converted.name,
        type: converted.type,
        date: converted.date ?? new Date(),
        distance: converted.distance_m ?? 0,
        duration: converted.duration_sec ?? 0,
        moving_time: converted.moving_sec ?? undefined,
        avg_speed: converted.avg_speed_mps ?? undefined,
        max_speed: converted.max_speed_mps ?? undefined,
        avg_pace: converted.pace_min_per_km ?? undefined,
        elevation_gain: converted.elevation_gain_m ?? undefined,
        elevation_loss: converted.elevation_loss_m ?? undefined,
        avg_heart_rate: converted.avg_hr ?? undefined,
        max_heart_rate: converted.max_hr ?? undefined,
        avg_cadence: converted.avg_cadence ?? undefined,
        calories: converted.calories_kcal ?? undefined,
        vo2max: converted.vo2max ?? undefined,
        training_effect: converted.aerobic_te ?? undefined,
        source: 'garmin' as const,
        source_id: converted.source_id,
        activityId: typeof raw.activityId === 'number' ? raw.activityId : undefined,
        fingerprint: fp,
        updated_at: new Date(),
        description: converted.location ?? undefined,
        raw_payload: raw,
      },
      $setOnInsert: {
        created_at: new Date(),
      },
    },
  };
}

export async function migrateGarminWrapperDocuments(
  docs: GarminStoredDocument[],
  options: GarminWrapperMigrationOptions = {}
): Promise<GarminWrapperMigrationResult> {
  const apply = Boolean(options.apply);
  const deleteSourceDocuments = options.deleteSourceDocuments !== false;
  const limit = Math.min(Math.max(options.limit ?? 25, 1), 500);

  const wrapperDocs = docs.filter(isGarminWrapperDocument).slice(0, limit);
  const preview = wrapperDocs.map((doc) => {
    const expanded = expandGarminActivitiesFromDocument(doc);
    return {
      documentId: doc._id != null ? String(doc._id) : 'unknown',
      activities: expanded.length,
      sampleActivityIds: expanded.slice(0, 5).map((entry) => entry.entryId),
      sampleNames: expanded.slice(0, 5).map((entry) => entry.converted.name),
    };
  });

  const baseResult: GarminWrapperMigrationResult = {
    mode: apply ? 'apply' : 'dry-run',
    scanned_documents: Math.min(docs.length, limit),
    wrapper_documents: wrapperDocs.length,
    activities_found: preview.reduce((sum, item) => sum + item.activities, 0),
    upserted_activities: 0,
    already_existing_activities: 0,
    deleted_wrapper_documents: 0,
    failed_wrapper_documents: 0,
    errors: [],
    preview,
  };

  if (!apply) {
    return baseResult;
  }

  for (const doc of wrapperDocs) {
    const documentId = doc._id != null ? String(doc._id) : 'unknown';
    const expanded = expandGarminActivitiesFromDocument(doc);
    let documentHasErrors = false;

    for (const entry of expanded) {
      try {
        const { filter, update } = buildCanonicalUpdate(entry.raw);
        const existsBefore = (await Activity.countDocuments(filter).limit(1)) > 0;
        await Activity.findOneAndUpdate(filter, update, { upsert: true, returnDocument: 'after' });

        if (existsBefore) {
          baseResult.already_existing_activities += 1;
        } else {
          baseResult.upserted_activities += 1;
        }
      } catch (error) {
        documentHasErrors = true;
        baseResult.errors.push({
          documentId,
          activityId: entry.entryId,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    if (documentHasErrors) {
      baseResult.failed_wrapper_documents += 1;
      continue;
    }

    if (deleteSourceDocuments && doc._id != null) {
      const deletion = await Activity.deleteOne({ _id: doc._id });
      baseResult.deleted_wrapper_documents += deletion.deletedCount ?? 0;
    }
  }

  return baseResult;
}

