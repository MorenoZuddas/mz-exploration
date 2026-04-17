import { Activity } from '@/lib/db/models/Activity';
import { convertGarminRaw, GarminRawActivity } from '@/lib/garmin/converter';
import crypto from 'crypto';

interface ActivityDoc {
  _id: unknown;
  source?: string;
  source_id?: string;
  fingerprint?: string;
  activityId?: number;
  type?: string;
  date?: Date | string;
  distance?: number;
  duration?: number;
  calories?: number;
  avg_heart_rate?: number;
  created_at?: Date | string;
  updated_at?: Date | string;
  photos?: Array<{ public_id?: string }>;
  raw_payload?: Record<string, unknown>;
}

interface MaintenanceResult {
  scanned: number;
  removedDuplicates: number;
  droppedIndexes: string[];
  syncedIndexes: string[];
  normalizedGarminIds: number;
  cleanedPhotoAssociations: number;
}

const LEGACY_INDEX_NAMES = [
  'fingerprint_1',
  'source_1_source_id_1',
  'source_1_date_1_type_1_distance_1_duration_1',
  'activityId_1',
];

let maintenancePromise: Promise<MaintenanceResult> | null = null;

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function toDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return null;
}

function dedupKey(doc: ActivityDoc): string {
  const sourceId =
    typeof doc.source_id === 'string' && doc.source_id.length > 0 && !doc.source_id.startsWith('garmin_')
      ? doc.source_id
      : null;
  const activityId = isFiniteNumber(doc.activityId) ? String(doc.activityId) : null;
  const externalId = sourceId ?? activityId;
  if (externalId) return `sid:${externalId}`;

  if (typeof doc.fingerprint === 'string' && doc.fingerprint.length > 0) {
    return `fp:${doc.fingerprint}`;
  }

  // Fallback: se nessun ID esterno/fingerprint, usa il raw_payload se presente per calcolare.
  // Questo allinea maintenance al deduplicate endpoint.
  const raw = isObjectRecord(doc.raw_payload) ? (doc.raw_payload as GarminRawActivity) : doc;
  const converted = convertGarminRaw(raw);
  const fp = [
    converted.date?.toISOString() ?? '',
    converted.type,
    Math.round(converted.distance_m ?? 0),
    Math.round(converted.duration_sec ?? 0),
  ].join('_');
  return `fp:${crypto.createHash('sha256').update(fp).digest('hex')}`;
}

function sortTimestamp(doc: ActivityDoc): number {
  return (
    toDate(doc.updated_at)?.getTime() ??
    toDate(doc.created_at)?.getTime() ??
    toDate(doc.date)?.getTime() ??
    0
  );
}

/**
 * Punteggio di completezza del documento.
 * Un documento con i campi chiave valorizzati vale più di uno parziale,
 * a prescindere dal timestamp. Questo evita di scartare l'import corretto
 * in favore di un inserimento diretto nel DB che potrebbe essere incompleto.
 */
function completenessScore(doc: ActivityDoc): number {
  let score = 0;
  if (isFiniteNumber(doc.calories)) score += 1_000_000_000;
  if (isFiniteNumber(doc.distance)) score += 100_000_000;
  if (isFiniteNumber(doc.duration)) score += 100_000_000;
  if (isFiniteNumber(doc.avg_heart_rate)) score += 10_000_000;
  return score;
}

async function normalizeGarminIdentityFields(): Promise<number> {
  const docs = (await Activity.find(
    {
      source: 'garmin',
      activityId: { $exists: false },
      source_id: { $exists: true, $type: 'string', $regex: /^\d+$/ },
    },
    { _id: 1, source_id: 1 }
  ).lean()) as Array<{ _id: unknown; source_id?: string }>;

  if (docs.length === 0) {
    return 0;
  }

  const ops = docs
    .map((doc) => {
      const sourceId = typeof doc.source_id === 'string' ? Number(doc.source_id) : NaN;
      if (!Number.isFinite(sourceId)) return null;

      return {
        updateOne: {
          filter: { _id: doc._id },
          update: { $set: { activityId: sourceId } },
        },
      };
    })
    .filter((op): op is { updateOne: { filter: { _id: unknown }; update: { $set: { activityId: number } } } } => op !== null);

  if (ops.length === 0) {
    return 0;
  }

  const res = await Activity.bulkWrite(ops, { ordered: false });
  return res.modifiedCount ?? 0;
}

async function removeDuplicatePhotoAssociationsNow(): Promise<number> {
  const docs = (await Activity.find(
    { 'photos.0': { $exists: true } },
    {
      _id: 1,
      photos: 1,
      updated_at: 1,
      created_at: 1,
      date: 1,
      calories: 1,
      distance: 1,
      duration: 1,
      avg_heart_rate: 1,
    }
  ).lean()) as ActivityDoc[];

  const owners = new Map<string, Array<{ _id: unknown; ts: number; score: number }>>();

  for (const doc of docs) {
    const ts = sortTimestamp(doc);
    const score = completenessScore(doc);
    const uniquePhotoIds = new Set<string>();

    for (const photo of doc.photos ?? []) {
      if (!photo?.public_id) continue;
      if (uniquePhotoIds.has(photo.public_id)) continue;
      uniquePhotoIds.add(photo.public_id);

      const list = owners.get(photo.public_id) ?? [];
      list.push({ _id: doc._id, ts, score });
      owners.set(photo.public_id, list);
    }
  }

  type ActivityBulkWriteOps = Parameters<typeof Activity.bulkWrite>[0];
  const ops: ActivityBulkWriteOps = [];

  for (const [publicId, list] of owners.entries()) {
    if (list.length <= 1) continue;

    const sorted = [...list].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.ts - a.ts;
    });
    const toRemove = sorted.slice(1);

    for (const item of toRemove) {
      ops.push({
        updateOne: {
          filter: { _id: item._id },
          update: { $pull: { photos: { public_id: publicId } } },
        },
      });
    }
  }

  if (ops.length === 0) {
    return 0;
  }

  const res = await Activity.bulkWrite(ops, { ordered: false });
  return res.modifiedCount ?? 0;
}

export async function removeDuplicateActivitiesNow(): Promise<{ scanned: number; removedDuplicates: number }> {
  const docs = (await Activity.find().lean()) as ActivityDoc[];
  const groups = new Map<string, ActivityDoc[]>();

  for (const doc of docs) {
    const key = dedupKey(doc);
    const list = groups.get(key) ?? [];
    list.push(doc);
    groups.set(key, list);
  }

  const idsToDelete: string[] = [];

  for (const list of groups.values()) {
    if (list.length <= 1) continue;
    // Ordina: prima per completezza (docs con calories, distance, duration), poi per timestamp recente.
    // Così non si butta mai via un import completo in favore di un inserimento diretto incompleto.
    const sorted = [...list].sort((a, b) => {
      const scoreDiff = completenessScore(b) - completenessScore(a);
      if (scoreDiff !== 0) return scoreDiff;
      return sortTimestamp(b) - sortTimestamp(a);
    });
    idsToDelete.push(...sorted.slice(1).map((item) => String(item._id)));
  }

  if (idsToDelete.length > 0) {
    await Activity.deleteMany({ _id: { $in: idsToDelete } });
  }

  return {
    scanned: docs.length,
    removedDuplicates: idsToDelete.length,
  };
}

async function dropLegacyIndexes(): Promise<string[]> {
  const dropped: string[] = [];
  const indexes = await Activity.collection.indexes();

  for (const index of indexes) {
    if (!index.name || !LEGACY_INDEX_NAMES.includes(index.name)) continue;
    if (index.name === '_id_') continue;
    await Activity.collection.dropIndex(index.name);
    dropped.push(index.name);
  }

  return dropped;
}

async function runMaintenance(): Promise<MaintenanceResult> {
  const normalizedIds = await normalizeGarminIdentityFields();
  const dedup = await removeDuplicateActivitiesNow();
  const cleanedPhotoAssociations = await removeDuplicatePhotoAssociationsNow();
  const droppedIndexes = await dropLegacyIndexes();
  const syncedIndexes = await Activity.syncIndexes();

  if (normalizedIds > 0) {
    console.log(`🧩 Normalizzati activityId Garmin: ${normalizedIds}`);
  }

  if (cleanedPhotoAssociations > 0) {
    console.log(`🖼️ Rimosse associazioni foto duplicate: ${cleanedPhotoAssociations}`);
  }

  return {
    scanned: dedup.scanned,
    removedDuplicates: dedup.removedDuplicates,
    droppedIndexes,
    syncedIndexes,
    normalizedGarminIds: normalizedIds,
    cleanedPhotoAssociations,
  };
}

export async function runDatabaseMaintenanceOnce(): Promise<MaintenanceResult> {
  if (!maintenancePromise) {
    maintenancePromise = runMaintenance()
      .then((result) => {
        console.log('🧹 Mongo maintenance completata', result);
        return result;
      })
      .catch((error) => {
        console.error('⚠️ Mongo maintenance fallita:', error);
        throw error;
      });
  }

  return maintenancePromise;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
