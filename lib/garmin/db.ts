import { convertGarminRaw, type GarminRawActivity, type NormalizedActivity } from '@/lib/garmin/converter';

export interface GarminStoredDocument extends Record<string, unknown> {
  _id?: unknown;
  raw_payload?: unknown;
  summarizedActivitiesExport?: unknown;
  description?: string;
  created_at?: unknown;
  updated_at?: unknown;
}

export interface ExpandedGarminActivity {
  containerId?: string;
  entryId: string;
  raw: GarminRawActivity;
  converted: NormalizedActivity;
  numericActivityId: number | null;
  location: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function toDate(value: unknown): Date | null {
  if (value instanceof Date && !Number.isNaN(value.getTime())) {
    return value;
  }

  if (typeof value === 'string' || typeof value === 'number') {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed;
    }
  }

  return null;
}

function toFiniteNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function hasActivitySignals(raw: GarminRawActivity): boolean {
  return Boolean(
    toFiniteNumber(raw.activityId) !== null ||
      toFiniteNumber(raw.startTimeLocal) !== null ||
      toFiniteNumber(raw.startTimeGmt) !== null ||
      toFiniteNumber(raw.beginTimestamp) !== null ||
      typeof raw.startTime === 'string' ||
      raw.date instanceof Date ||
      typeof raw.date === 'string' ||
      toFiniteNumber(raw.totalDistance) !== null ||
      toFiniteNumber(raw.distance_m) !== null ||
      toFiniteNumber(raw.distance) !== null ||
      toFiniteNumber(raw.totalTimeInSeconds) !== null ||
      toFiniteNumber(raw.duration_sec) !== null ||
      toFiniteNumber(raw.duration) !== null ||
      typeof raw.activityType === 'string' ||
      typeof raw.sportType === 'string' ||
      typeof raw.type === 'string' ||
      typeof raw.name === 'string'
  );
}

function extractActivitiesPayload(payload: unknown): GarminRawActivity[] {
  if (Array.isArray(payload)) {
    return payload.flatMap((item) => extractActivitiesPayload(item));
  }

  if (!isObjectRecord(payload)) {
    return [];
  }

  if (Array.isArray(payload.summarizedActivitiesExport)) {
    return payload.summarizedActivitiesExport.filter(
      (item): item is GarminRawActivity => isObjectRecord(item)
    );
  }

  return [payload as GarminRawActivity];
}

function materializeDocument(doc: GarminStoredDocument): Record<string, unknown> {
  if (isObjectRecord(doc.raw_payload)) {
    return {
      ...doc,
      ...doc.raw_payload,
    };
  }

  return doc;
}

export function isGarminWrapperDocument(doc: GarminStoredDocument): boolean {
  const materialized = materializeDocument(doc);
  return isObjectRecord(materialized) && Array.isArray(materialized.summarizedActivitiesExport);
}

function stripWrapperFields(record: Record<string, unknown>): Record<string, unknown> {
  const { summarizedActivitiesExport: _summarizedActivitiesExport, raw_payload: _raw_payload, ...rest } = record;
  return rest;
}

export function resolveNumericGarminActivityId(activity: GarminRawActivity, sourceId: string): number | null {
  if (typeof activity.activityId === 'number' && Number.isFinite(activity.activityId)) {
    return activity.activityId;
  }

  if (/^\d+$/.test(sourceId)) {
    return Number(sourceId);
  }

  return null;
}

function buildExpandedActivity(
  raw: GarminRawActivity,
  doc: GarminStoredDocument,
  index: number,
  containerId?: string
): ExpandedGarminActivity {
  const converted = convertGarminRaw(raw);
  const sourceId =
    typeof raw.source_id === 'string' && raw.source_id.trim().length > 0
      ? raw.source_id.trim()
      : converted.source_id;

  const entryId =
    sourceId ||
    (typeof raw.activityId === 'number' && Number.isFinite(raw.activityId)
      ? String(raw.activityId)
      : `${containerId ?? 'activity'}:${index}`);

  const normalizedRaw: GarminRawActivity = {
    ...raw,
    source_id: entryId,
  };

  const numericActivityId = resolveNumericGarminActivityId(normalizedRaw, entryId);
  const location =
    converted.location ??
    (typeof doc.description === 'string' && doc.description.trim().length > 0 ? doc.description.trim() : null);

  return {
    containerId,
    entryId,
    raw: normalizedRaw,
    converted: { ...converted, source_id: entryId },
    numericActivityId,
    location,
    createdAt: toDate(doc.created_at),
    updatedAt: toDate(doc.updated_at),
  };
}

export function expandGarminActivitiesFromDocument(doc: GarminStoredDocument): ExpandedGarminActivity[] {
  const materialized = materializeDocument(doc);
  const containerId = doc._id != null ? String(doc._id) : undefined;

  if (!isObjectRecord(materialized)) {
    return [];
  }

  const hasWrapper = Array.isArray(materialized.summarizedActivitiesExport);
  const baseRecord = stripWrapperFields(materialized);
  const extracted = extractActivitiesPayload(materialized);

  if (hasWrapper) {
    return extracted
      .filter(hasActivitySignals)
      .map((activity, index) =>
        buildExpandedActivity({ ...(baseRecord as GarminRawActivity), ...activity }, doc, index, containerId)
      );
  }

  const canonical = baseRecord as GarminRawActivity;
  if (!hasActivitySignals(canonical)) {
    return [];
  }

  return [buildExpandedActivity(canonical, doc, 0, containerId)];
}

export function expandGarminActivitiesFromDocuments(docs: GarminStoredDocument[]): ExpandedGarminActivity[] {
  return docs.flatMap((doc) => expandGarminActivitiesFromDocument(doc));
}

export function sortExpandedGarminActivities(entries: ExpandedGarminActivity[]): ExpandedGarminActivity[] {
  return [...entries].sort((a, b) => {
    const left =
      a.converted.date?.getTime() ??
      a.updatedAt?.getTime() ??
      a.createdAt?.getTime() ??
      0;
    const right =
      b.converted.date?.getTime() ??
      b.updatedAt?.getTime() ??
      b.createdAt?.getTime() ??
      0;
    return right - left;
  });
}


