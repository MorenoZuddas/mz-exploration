import { connectToDatabase } from '@/lib/db/connection';
import { Activity } from '@/lib/db/models/Activity';
import { SyncLog } from '@/lib/db/models/SyncLog';
import { convertGarminRaw, GarminRawActivity } from '@/lib/garmin/converter';
import { projectActivity } from '@/lib/activities/projector';
import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

function hasExternalSourceId(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0 && !value.startsWith('garmin_');
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
  if (hasExternalSourceId(converted.source_id)) {
    return { key: `sid:${converted.source_id}`, sourceId: converted.source_id, fp };
  }

  return { key: `fp:${fp}`, fp };
}

function buildReadDedupKey(activity: GarminRawActivity): string {
  const converted = convertGarminRaw(activity);
  if (hasExternalSourceId(converted.source_id)) {
    return `sid:${converted.source_id}`;
  }

  return `fp:${[
    converted.date?.toISOString() ?? '',
    converted.type,
    Math.round(converted.distance_m ?? 0),
    Math.round(converted.duration_sec ?? 0),
  ].join('_')}`;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toNumberOrUndefined(value: unknown): number | undefined {
  return typeof value === 'number' && Number.isFinite(value) ? value : undefined;
}

function toDateOrUndefined(value: unknown): Date | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return undefined;
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

// POST: salva il payload Garmin raw in DB (nessuna conversione distruttiva in scrittura).
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    console.log('📥 Upload attività Garmin JSON...');
    await connectToDatabase();

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
          hasExternalSourceId(converted.source_id)
            ? {
                $or: [
                  { source: 'garmin', source_id: converted.source_id },
                  { fingerprint: fp },
                ],
              }
            : { fingerprint: fp };

        const alreadyExists = (await Activity.countDocuments(dedupFilter).limit(1)) > 0;

        const sourceId = converted.source_id;
        const fallbackDate = toDateOrUndefined(raw.date) ?? toDateOrUndefined(raw.startTime) ?? toDateOrUndefined(raw.startTimeLocal) ?? toDateOrUndefined(raw.startTimeGmt) ?? toDateOrUndefined(raw.beginTimestamp);

        // Persistenza raw: il JSON originale viene salvato in raw_payload.
        const setPayload: Record<string, unknown> = {
          raw_payload: raw,
          source: 'garmin',
          source_id: sourceId,
          fingerprint: fp,
          updated_at: new Date(),
        };

        const activityId = toNumberOrUndefined(raw.activityId);
        if (activityId !== undefined) {
          setPayload.activityId = activityId;
        }

        if (typeof raw.name === 'string' && raw.name.trim().length > 0) {
          setPayload.name = raw.name.trim();
        }

        if (typeof raw.type === 'string' && raw.type.trim().length > 0) {
          setPayload.type = raw.type.trim().toLowerCase();
        }

        if (fallbackDate) {
          setPayload.date = fallbackDate;
        }

        const distanceRaw = toNumberOrUndefined(raw.distance) ?? toNumberOrUndefined(raw.totalDistance);
        if (distanceRaw !== undefined) {
          setPayload.distance = distanceRaw;
        }

        const durationRaw = toNumberOrUndefined(raw.duration) ?? toNumberOrUndefined(raw.totalTimeInSeconds);
        if (durationRaw !== undefined) {
          setPayload.duration = durationRaw;
        }

        await Activity.findOneAndUpdate(
          dedupFilter,
          {
            $set: setPayload,
            $setOnInsert: { created_at: new Date() },
          },
          { upsert: true, returnDocument: 'after' }
        );

        if (alreadyExists) {
          duplicatesFoundInDb++;
        } else {
          saved++;
        }
        console.log(`✅ Salvata raw: ${raw.name ?? sourceId}`);
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

    return NextResponse.json({
      status: 'success',
      message: `✅ Import completato: ${saved} salvate, ${skipped} saltate`,
      data: {
        total_processed: extracted.length,
        unique_processed: activities.length,
        saved,
        duplicates_found_in_db: duplicatesFoundInDb,
        skipped,
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

function classifyReadError(error: unknown): {
  message: string;
  code: 'ATLAS_IP_NOT_WHITELISTED' | 'DB_CONNECTION_TIMEOUT' | 'GENERIC_READ_ERROR';
  hint?: string;
  canRetry: boolean;
} {
  const raw = error instanceof Error ? error.message : String(error ?? 'Unknown error');
  const lower = raw.toLowerCase();

  if (
    lower.includes("could not connect to any servers in your mongodb atlas cluster") ||
    lower.includes('ip that isn\'t whitelisted') ||
    lower.includes('security-whitelist')
  ) {
    return {
      code: 'ATLAS_IP_NOT_WHITELISTED',
      message:
        '❌ Connessione MongoDB Atlas rifiutata: IP non autorizzato. Se stai usando VPN/proxy, prova a disattivarla oppure aggiungi l\'IP corrente in Atlas Network Access.',
      hint:
        'Controlla Atlas > Network Access. Con VPN attiva l\'IP pubblico cambia e puo\' non essere in whitelist.',
      canRetry: true,
    };
  }

  if (lower.includes('buffering timed out') || lower.includes('server selection timed out')) {
    return {
      code: 'DB_CONNECTION_TIMEOUT',
      message:
        '❌ Timeout connessione database. Verifica rete, URI MongoDB e stato del cluster Atlas.',
      hint: 'Riprova tra pochi secondi. Se usi VPN, verifica che l\'IP sia autorizzato su Atlas.',
      canRetry: true,
    };
  }

  return {
    code: 'GENERIC_READ_ERROR',
    message: '❌ Errore durante la lettura delle attività.',
    canRetry: false,
  };
}

// GET: legge dal DB, materializza il payload raw se presente e converte solo in uscita verso FE.
export async function GET(): Promise<NextResponse> {
  try {
    await connectToDatabase();

    const rawActivities = (await Activity.find()
      .sort({ date: -1, startTimeLocal: -1, startTimeGmt: -1, beginTimestamp: -1 })
      .limit(200)
      .lean()) as Array<GarminRawActivity & {
        _id?: unknown;
        activityId?: number;
        photos?: unknown;
        source_id?: string;
        raw_payload?: unknown;
      }>;

    const totalCount = await Activity.countDocuments();

    const materialized = rawActivities.map(materializeStoredRaw);

    // Protezione FE: evita di mostrare doppioni residui inseriti manualmente nel DB.
    const seen = new Set<string>();
    const uniqueRaw = materialized.filter((activity) => {
      const key = buildReadDedupKey(activity);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const normalized = uniqueRaw
      .map((activity) => {
        try {
          return projectActivity(activity as GarminRawActivity & { _id?: unknown; activityId?: number; photos?: unknown });
        } catch (error) {
          console.error('⚠️ Record activity non proiettabile, skip:', error);
          return null;
        }
      })
      .filter((item): item is ReturnType<typeof projectActivity> => item !== null);

    return NextResponse.json({
      status: 'success',
      data: {
        total_activities: totalCount,
        total_unique_activities: normalized.length,
        recent_activities: normalized,
      },
    });
  } catch (error) {
    const mapped = classifyReadError(error);
    console.error('❌ Errore lettura:', error);
    return NextResponse.json(
      {
        status: 'error',
        message: mapped.message,
        error: error instanceof Error ? error.message : 'Unknown error',
        code: mapped.code,
        hint: mapped.hint,
        can_retry: mapped.canRetry,
      },
      { status: 500 }
    );
  }
}
