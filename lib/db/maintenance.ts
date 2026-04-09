import { Activity } from '@/lib/db/models/Activity';

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
  created_at?: Date | string;
  updated_at?: Date | string;
}

interface MaintenanceResult {
  scanned: number;
  removedDuplicates: number;
  droppedIndexes: string[];
  syncedIndexes: string[];
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
  const source =
    typeof doc.source === 'string' && doc.source.length > 0
      ? doc.source
      : isFiniteNumber(doc.activityId) || (typeof doc.source_id === 'string' && /^\d+$/.test(doc.source_id))
      ? 'garmin'
      : 'unknown';

  const sourceId =
    typeof doc.source_id === 'string' && doc.source_id.length > 0 && !doc.source_id.startsWith('garmin_')
      ? doc.source_id
      : null;
  const activityId = isFiniteNumber(doc.activityId) ? String(doc.activityId) : null;
  const externalId = sourceId ?? activityId;
  if (externalId) return `sid:${source}:${externalId}`;

  if (typeof doc.fingerprint === 'string' && doc.fingerprint.length > 0) {
    return `fp:${doc.fingerprint}`;
  }

  const dateIso = toDate(doc.date)?.toISOString() ?? '';
  const type = typeof doc.type === 'string' ? doc.type : '';
  const distance = isFiniteNumber(doc.distance) ? Math.round(doc.distance) : null;
  const duration = isFiniteNumber(doc.duration) ? Math.round(doc.duration) : null;

  if (dateIso && type && distance !== null && duration !== null) {
    return `cmp:${source}:${dateIso}:${type}:${distance}:${duration}`;
  }

  return `id:${String(doc._id)}`;
}

function sortTimestamp(doc: ActivityDoc): number {
  return (
    toDate(doc.updated_at)?.getTime() ??
    toDate(doc.created_at)?.getTime() ??
    toDate(doc.date)?.getTime() ??
    0
  );
}

async function normalizeGarminIdentityFields(): Promise<number> {
  const res = await Activity.updateMany(
    {
      source: 'garmin',
      activityId: { $exists: false },
      source_id: { $exists: true, $type: 'string', $regex: /^\d+$/ },
    },
    [
      {
        $set: {
          activityId: { $toLong: '$source_id' },
        },
      },
    ]
  );

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
    const sorted = [...list].sort((a, b) => sortTimestamp(b) - sortTimestamp(a));
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
  const droppedIndexes = await dropLegacyIndexes();
  const syncedIndexes = await Activity.syncIndexes();

  if (normalizedIds > 0) {
    console.log(`🧩 Normalizzati activityId Garmin: ${normalizedIds}`);
  }

  return {
    scanned: dedup.scanned,
    removedDuplicates: dedup.removedDuplicates,
    droppedIndexes,
    syncedIndexes,
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
