import { connectToDatabase } from '@/lib/db/connection';
import { Activity } from '@/lib/db/models/Activity';
import { SyncLog } from '@/lib/db/models/SyncLog';
import { convertGarminRaw, GarminRawActivity } from '@/lib/garmin/converter';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { removeDuplicateActivitiesNow } from '@/lib/db/maintenance';
import { getAssetsByActivityIds } from '@/lib/cloudinary/server';
import {
  expandGarminActivitiesFromDocuments,
  resolveNumericGarminActivityId,
  sortExpandedGarminActivities,
  type GarminStoredDocument,
} from '@/lib/garmin/db';

export const dynamic = 'force-dynamic';

const NO_STORE_HEADERS = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  Pragma: 'no-cache',
  Expires: '0',
};

type ActivityGroup = 'all' | 'running' | 'trekking';

function isActivityInGroup(type: string, group: ActivityGroup): boolean {
  if (group === 'all') return true;
  if (group === 'running') {
    return type === 'running' || type === 'track_running';
  }
  return type === 'hiking' || type === 'trekking' || type === 'walking';
}

// Estrae le attività dal wrapper Garmin (summarizedActivitiesExport) o da array flat
function extractActivities(payload: unknown): GarminRawActivity[] {
  if (Array.isArray(payload)) {
    return payload.flatMap((item) => {
      if (item && typeof item === 'object') {
        const w = item as { summarizedActivitiesExport?: GarminRawActivity[] };
        if (Array.isArray(w.summarizedActivitiesExport)) {
          return w.summarizedActivitiesExport;
        }
      }
      return typeof item === 'object' && item !== null ? [item as GarminRawActivity] : [];
    });
  }

  if (payload && typeof payload === 'object') {
    const w = payload as { summarizedActivitiesExport?: GarminRawActivity[] };
    if (Array.isArray(w.summarizedActivitiesExport)) {
      return w.summarizedActivitiesExport;
    }
    return [payload as GarminRawActivity];
  }

  return [];
}

function isValidRaw(raw: GarminRawActivity): boolean {
  const hasIdentity =
    typeof raw.activityId === 'number' ||
    typeof raw.startTimeLocal === 'number' ||
    typeof raw.startTimeGmt === 'number' ||
    typeof raw.beginTimestamp === 'number' ||
    typeof raw.startTime === 'string' ||
    typeof raw.date === 'string' ||
    raw.date instanceof Date;

  const hasMetrics =
    typeof raw.distance === 'number' ||
    typeof raw.totalDistance === 'number' ||
    typeof raw.duration === 'number' ||
    typeof raw.totalTimeInSeconds === 'number';

  return hasIdentity || hasMetrics;
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

function buildDedupKey(raw: GarminRawActivity): { key: string; sourceId?: string; fp: string } {
  const converted = convertGarminRaw(raw);
  const fp = fingerprint(raw);

  // activityId/source_id Garmin e' la chiave piu' affidabile tra import multipli.
  if (converted.source_id && !converted.source_id.startsWith('garmin_')) {
    return { key: `sid:${converted.source_id}`, sourceId: converted.source_id, fp };
  }

  return { key: `fp:${fp}`, fp };
}

function buildReadDedupKey(activity: GarminRawActivity): string {
  const converted = convertGarminRaw(activity);
  if (converted.source_id && !converted.source_id.startsWith('garmin_')) {
    return `sid:${converted.source_id}`;
  }

  return `fp:${[
    converted.date?.toISOString() ?? '',
    converted.type,
    Math.round(converted.distance_m ?? 0),
    Math.round(converted.duration_sec ?? 0),
  ].join('_')}`;
}

// POST: salva i documenti raw nel DB così come arrivano (dal JSON o direttamente)
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('📥 Upload attività Garmin JSON...');
    await connectToDatabase();
    const preCleanup = await removeDuplicateActivitiesNow();

    const body: unknown = await request.json();
    const extracted = extractActivities(body).filter(isValidRaw);

    // Deduplica interna al file caricato (stesso record ripetuto nel payload).
    const seen = new Set<string>();
    const activities: GarminRawActivity[] = [];
    let skippedInPayload = 0;
    for (const raw of extracted) {
      const { key } = buildDedupKey(raw);
      if (seen.has(key)) {
        skippedInPayload++;
        continue;
      }
      seen.add(key);
      activities.push(raw);
    }

    if (activities.length === 0) {
      return NextResponse.json(
        { status: 'error', message: '❌ Nessuna attività valida trovata nel JSON' },
        { status: 400 }
      );
    }

    console.log(`📦 ${activities.length} attività da importare (${skippedInPayload} duplicati nel file ignorati)`);

    const syncLog = await SyncLog.create({
      source: 'garmin',
      status: 'started',
      activities_fetched: activities.length,
    });

    let saved = 0;
    let skipped = skippedInPayload;
    let duplicatesFoundInDb = 0;
    const errors: string[] = [];

    for (const raw of activities) {
      try {
        const fp = fingerprint(raw);
        const converted = convertGarminRaw(raw);
        const dedupFilter =
          converted.source_id && !converted.source_id.startsWith('garmin_')
            ? {
                $or: [
                  { source: 'garmin', source_id: converted.source_id },
                  { fingerprint: fp },
                ],
              }
            : { fingerprint: fp };

        const alreadyExists = (await Activity.countDocuments(dedupFilter).limit(1)) > 0;

        // Lo schema Activity e' strict: salviamo in forma canonica per evitare campi persi.
        await Activity.findOneAndUpdate(
          dedupFilter,
          {
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
              source: 'garmin',
              source_id: converted.source_id,
              activityId: typeof raw.activityId === 'number' ? raw.activityId : undefined,
              fingerprint: fp,
              updated_at: new Date(),
              // Dato utile per debug geografico nel FE
              description: converted.location ?? undefined,
              // Fonte raw mantenuta per riconversioni consistenti lato API.
              raw_payload: raw,
            },
            $setOnInsert: { created_at: new Date() },
          },
          { upsert: true, returnDocument: 'after' }
        );
        if (alreadyExists) {
          duplicatesFoundInDb++;
        } else {
          saved++;
        }
        console.log(`✅ Salvata: ${converted.name}`);
      } catch (err) {
        skipped++;
        const msg = err instanceof Error ? err.message : 'Unknown error';
        errors.push(`${raw.name ?? '?'}: ${msg}`);
        console.error(`❌ Errore: ${msg}`);
      }
    }

    await SyncLog.findByIdAndUpdate(syncLog._id, {
      status: 'completed',
      activities_saved: saved,
      activities_skipped: skipped,
      details: errors.length > 0 ? { errors } : undefined,
    });

    const postCleanup = await removeDuplicateActivitiesNow();
    const totalRemovedByMaintenance = preCleanup.removedDuplicates + postCleanup.removedDuplicates;

    return NextResponse.json({
      status: 'success',
      message: `✅ Import completato: ${saved} salvate, ${skipped} saltate`,
      data: {
        total_processed: extracted.length,
        unique_processed: activities.length,
        saved,
        duplicates_found_in_db: duplicatesFoundInDb,
        skipped,
        maintenance: {
          duplicates_removed_before_import: preCleanup.removedDuplicates,
          duplicates_removed_after_import: postCleanup.removedDuplicates,
          total_duplicates_removed: totalRemovedByMaintenance,
        },
        errors: errors.length > 0 ? errors : undefined,
      },
    });
  } catch (error) {
    console.error('❌ Errore import:', error);
    return NextResponse.json(
      { status: 'error', message: '❌ Errore durante l\'import', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function inferTypeFromName(name: string): string | null {
  const normalized = name.toLowerCase().trim();
  if (normalized.includes('pista') || normalized.includes('track')) return 'track_running';
  if (normalized.includes('corsa') || normalized.includes('run') || normalized.includes('jog')) return 'running';
  if (normalized.includes('ripetute') || normalized.includes('interval') || /\d+x\d+/.test(normalized)) return 'running';
  if (normalized.includes('marathon') || normalized.includes('half marathon') || /\b\d{1,2}k\b/.test(normalized)) return 'running';
  if (normalized.includes('cicl') || normalized.includes('bike')) return 'cycling';
  if (normalized.includes('trek') || normalized.includes('hike')) return 'hiking';
  if (normalized.includes('walk') || normalized.includes('cammin')) return 'walking';
  if (normalized.includes('palestra') || normalized.includes('strength') || normalized.includes('gym')) return 'strength';
  return null;
}

function resolveActivityType(raw: GarminRawActivity, convertedType: string): string {
  const normalizedConverted = convertedType.trim().toLowerCase();
  if (normalizedConverted && normalizedConverted !== 'unknown') {
    return normalizedConverted;
  }

  const aliasMap: Record<string, string> = {
    running: 'running',
    trail_running: 'running',
    road_running: 'running',
    virtual_running: 'running',
    track_running: 'track_running',
    cycling: 'cycling',
    hiking: 'hiking',
    walking: 'walking',
    strength: 'strength',
    strength_training: 'strength',
  };

  const aliases = [raw.type, raw.activityType, raw.sportType]
    .filter((v): v is string => typeof v === 'string' && v.trim().length > 0)
    .map((v) => v.trim().toLowerCase());

  for (const alias of aliases) {
    const mapped = aliasMap[alias];
    if (mapped) return mapped;
    const inferred = inferTypeFromName(alias);
    if (inferred) return inferred;
  }

  const inferredByName = inferTypeFromName(raw.name ?? '');
  return inferredByName ?? 'unknown';
}

// GET: legge i raw dal DB e li converte con convertGarminRaw prima di mandarli al FE
export async function GET(request: NextRequest): Promise<NextResponse> {
  const traceId = crypto.randomUUID();
  const requestedGroup = (request.nextUrl.searchParams.get('group') ?? 'all').toLowerCase() as ActivityGroup;
  const group: ActivityGroup = ['all', 'running', 'trekking'].includes(requestedGroup)
    ? requestedGroup
    : 'all';

  try {
    console.log(`[garmin:get:${traceId}] start`);
    await connectToDatabase();

    try {
      await removeDuplicateActivitiesNow();
      console.log(`[garmin:get:${traceId}] maintenance ok`);
    } catch (maintenanceError) {
      console.error(`[garmin:get:${traceId}] maintenance failed`, maintenanceError);
    }

    const rawDocuments = (await Activity.find().lean()) as GarminStoredDocument[];
    const expandedActivities = sortExpandedGarminActivities(expandGarminActivitiesFromDocuments(rawDocuments));
    const totalCount = expandedActivities.length;
    console.log(`[garmin:get:${traceId}] db read ok`, {
      fetchedDocuments: rawDocuments.length,
      expandedActivities: totalCount,
    });

    const seen = new Set<string>();
    const uniqueRaw = expandedActivities.filter((entry) => {
      const key = buildReadDedupKey(entry.raw);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 200);

    const convertedRows = uniqueRaw.map((entry) => {
      const payloadSource = entry.raw;
      const converted = entry.converted;
      const resolvedType = resolveActivityType(payloadSource, converted.type);
      const numericActivityId = resolveNumericGarminActivityId(payloadSource, converted.source_id);

      return {
        ...converted,
        type: resolvedType,
        _id: entry.entryId,
        container_id: entry.containerId,
        location: entry.location,
        activityId: numericActivityId,
      };
    });

    const activityIds = Array.from(
      new Set(
        convertedRows
          .map((row) => row.activityId)
          .filter((id): id is number => typeof id === 'number' && Number.isFinite(id))
      )
    );

    console.log(`[garmin:get:${traceId}] cloudinary fetch start`, { ids: activityIds.length });
    const cloudinaryMap = await getAssetsByActivityIds(activityIds);
    console.log(`[garmin:get:${traceId}] cloudinary fetch done`, { matched: cloudinaryMap.size });

    const groupedRows = convertedRows.filter((row) => isActivityInGroup(row.type, group));

    const normalized = groupedRows.map((row) => {
      const photo = row.activityId ? cloudinaryMap.get(row.activityId) ?? null : null;
      return {
        ...row,
        photo,
      };
    });

    console.log(`[garmin:get:${traceId}] merge complete`, { items: normalized.length });

    return NextResponse.json({
      status: 'success',
      data: {
        total_activities: totalCount,
        total_unique_activities: normalized.length,
        recent_activities: normalized,
      },
    }, {
      headers: NO_STORE_HEADERS,
    });
  } catch (error) {
    const details = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[garmin:get:${traceId}] failed`, details);

    return NextResponse.json(
      {
        status: 'error',
        message: '❌ Errore durante la lettura',
        details,
        traceId,
      },
      {
        status: 500,
        headers: NO_STORE_HEADERS,
      }
    );
  }
}
