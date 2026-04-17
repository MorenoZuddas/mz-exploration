import { connectToDatabase } from '@/lib/db/connection';
import { Activity } from '@/lib/db/models/Activity';
import { convertGarminRaw, GarminRawActivity } from '@/lib/garmin/converter';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';

interface DeduplicateBody {
  apply?: boolean;
}

interface ActivityDocWithRaw {
  _id: unknown;
  source?: string;
  source_id?: string;
  fingerprint?: string;
  activityId?: number;
  name?: string;
  type?: string;
  date?: Date;
  distance?: number;
  duration?: number;
  raw_payload?: Record<string, unknown>;
  created_at?: Date;
  updated_at?: Date;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function safeDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return null;
}

/**
 * Unified dedup key: materializza raw_payload se presente,
 * poi calcola fingerprint come in POST import.
 * Così tutti i flussi (POST, deduplicate, maintenance) vedono lo stesso comparatore.
 */
function unifiedDedupKey(doc: ActivityDocWithRaw): string {
  const sourceId =
    typeof doc.source_id === 'string' && doc.source_id.length > 0 && !doc.source_id.startsWith('garmin_')
      ? doc.source_id
      : null;
  const activityId = isFiniteNumber(doc.activityId) ? String(doc.activityId) : null;
  const stableExternalId = sourceId ?? activityId;

  // Priority 1: source_id or activityId (esterno, non derivato)
  if (stableExternalId) {
    return `sid:${stableExternalId}`;
  }

  // Priority 2: fingerprint pre-calcolato
  if (typeof doc.fingerprint === 'string' && doc.fingerprint.length > 0) {
    return `fp:${doc.fingerprint}`;
  }

  // Priority 3: ricalcola fingerprint dal raw_payload o dai campi direct
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

function getSortTs(doc: ActivityDocWithRaw): number {
  return (
    safeDate(doc.updated_at)?.getTime() ??
    safeDate(doc.created_at)?.getTime() ??
    safeDate(doc.date)?.getTime() ??
    0
  );
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    await connectToDatabase();

    const body = (await request.json().catch(() => ({}))) as DeduplicateBody;
    const apply = Boolean(body.apply);

    const docs = (await Activity.find({
      source: 'garmin',
    }).lean()) as ActivityDocWithRaw[];

    const groups = new Map<string, ActivityDocWithRaw[]>();

    for (const doc of docs) {
      const key = unifiedDedupKey(doc);
      const list = groups.get(key) ?? [];
      list.push(doc);
      groups.set(key, list);
    }

    const duplicates: Array<{
      key: string;
      keep: string;
      remove: string[];
      count: number;
      sample_name?: string;
    }> = [];

    const idsToDelete: string[] = [];

    for (const [key, list] of groups.entries()) {
      if (list.length <= 1) continue;

      const sorted = [...list].sort((a, b) => getSortTs(b) - getSortTs(a));
      const keep = String(sorted[0]._id);
      const remove = sorted.slice(1).map((doc) => String(doc._id));

      idsToDelete.push(...remove);
      duplicates.push({
        key,
        keep,
        remove,
        count: list.length,
        sample_name: typeof sorted[0].name === 'string' ? sorted[0].name : undefined,
      });
    }

    let deletedCount = 0;
    if (apply && idsToDelete.length > 0) {
      const result = await Activity.deleteMany({ _id: { $in: idsToDelete } });
      deletedCount = result.deletedCount ?? 0;
    }

    return NextResponse.json({
      status: 'success',
      mode: apply ? 'apply' : 'dry-run',
      scanned: docs.length,
      duplicate_groups: duplicates.length,
      duplicates_to_remove: idsToDelete.length,
      deleted: deletedCount,
      preview: duplicates.slice(0, 20),
      hint: apply
        ? 'Deduplicazione applicata. Ricarica la pagina demo.'
        : 'Dry-run completato. Esegui POST con {"apply": true} per eliminare i duplicati.',
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'error',
        message: 'Errore durante deduplicazione',
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
