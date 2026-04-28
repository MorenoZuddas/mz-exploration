export interface CloudinaryActivityPhoto {
  activityId: number;
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
}

interface CloudinarySearchResource {
  public_id?: string;
  secure_url?: string;
  width?: number;
  height?: number;
  metadata?: {
    activityId?: string | number;
    activityid?: string | number;
  };
}

interface CloudinarySearchResponse {
  resources?: CloudinarySearchResource[];
}

const SERVER_CACHE_TTL_MS = 2 * 60 * 1000;
let cachedKey: string | null = null;
let cachedAt = 0;
let cachedData = new Map<number, CloudinaryActivityPhoto>();

function getEnv(): {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
} | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return null;
  }

  return { cloudName, apiKey, apiSecret };
}

function toActivityId(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (/^\d+$/.test(trimmed)) {
      return Number(trimmed);
    }
  }

  return null;
}

function buildExpression(activityIds: number[]): string {
  // Alcuni account Cloudinary serializzano la key structured metadata in lowercase.
  return activityIds
    .map((id) => `(metadata.activityId=${id} OR metadata.activityid=${id})`)
    .join(' OR ');
}

function makeCacheKey(activityIds: number[]): string {
  return activityIds.slice().sort((a, b) => a - b).join(',');
}

function selectBestPhoto(existing: CloudinaryActivityPhoto | undefined, next: CloudinaryActivityPhoto): CloudinaryActivityPhoto {
  if (!existing) {
    return next;
  }

  const existingArea = (existing.width ?? 0) * (existing.height ?? 0);
  const nextArea = (next.width ?? 0) * (next.height ?? 0);
  return nextArea > existingArea ? next : existing;
}

function parseResources(resources: CloudinarySearchResource[]): Map<number, CloudinaryActivityPhoto> {
  const byActivityId = new Map<number, CloudinaryActivityPhoto>();

  for (const resource of resources) {
    const activityId = toActivityId(resource.metadata?.activityId ?? resource.metadata?.activityid);
    if (!activityId || !resource.public_id || !resource.secure_url) {
      continue;
    }

    const candidate: CloudinaryActivityPhoto = {
      activityId,
      publicId: resource.public_id,
      secureUrl: resource.secure_url,
      width: resource.width,
      height: resource.height,
    };

    const current = byActivityId.get(activityId);
    byActivityId.set(activityId, selectBestPhoto(current, candidate));
  }

  return byActivityId;
}

export async function getAssetsByActivityIds(activityIds: number[]): Promise<Map<number, CloudinaryActivityPhoto>> {
  const uniqueIds = Array.from(new Set(activityIds.filter((id) => Number.isFinite(id) && id > 0)));
  if (uniqueIds.length === 0) {
    return new Map<number, CloudinaryActivityPhoto>();
  }

  const env = getEnv();
  if (!env) {
    console.error('[cloudinary] Missing server env (CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET).');
    return new Map<number, CloudinaryActivityPhoto>();
  }

  const cacheKey = makeCacheKey(uniqueIds);
  const now = Date.now();
  if (cachedKey === cacheKey && now - cachedAt < SERVER_CACHE_TTL_MS) {
    return new Map<number, CloudinaryActivityPhoto>(cachedData);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${env.cloudName}/resources/search`;
  const auth = Buffer.from(`${env.apiKey}:${env.apiSecret}`).toString('base64');
  const expression = buildExpression(uniqueIds);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        expression,
        max_results: 500,
        with_field: ['metadata'],
        sort_by: [{ created_at: 'desc' }],
      }),
      cache: 'no-store',
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[cloudinary] Search request failed', {
        status: response.status,
        body: errorText.slice(0, 500),
      });
      return new Map<number, CloudinaryActivityPhoto>();
    }

    const payload = (await response.json()) as CloudinarySearchResponse;
    const resources = Array.isArray(payload.resources) ? payload.resources : [];
    const parsed = parseResources(resources);

    if (parsed.size > 0) {
      cachedKey = cacheKey;
      cachedAt = now;
      cachedData = new Map<number, CloudinaryActivityPhoto>(parsed);
    }

    return parsed;
  } catch (error) {
    console.error('[cloudinary] Search error', error instanceof Error ? error.message : error);
    return new Map<number, CloudinaryActivityPhoto>();
  }
}
