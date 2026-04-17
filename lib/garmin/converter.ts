/**
 * Converter Garmin raw → formato normalizzato per il frontend.
 *
 * Regole unità dal JSON export Garmin reale:
 * - distance:      centimetri → metri       (/100)
 * - duration:      millisecondi → secondi   (/1000)
 * - movingDuration: millisecondi → secondi  (/1000)
 * - elevationGain/Loss: centimetri → metri  (/100)
 * - avgSpeed/maxSpeed: m/s (già corretto, moltiplicare x10 se < 2)
 * - calories:      già in kcal              (nessuna conversione)
 * - startTimeLocal/startTimeGmt/beginTimestamp: epoch ms → Date
 */

export interface GarminRawActivity {
  activityId?: number;
  name?: string;
  activityType?: string;
  sportType?: string;
  startTimeLocal?: number;
  startTimeGmt?: number;
  beginTimestamp?: number;
  startTime?: string;
  // Campi schema normalizzato (quando il record e' gia' stato convertito/salvato)
  type?: string;
  date?: Date | string;
  duration?: number;
  totalTimeInSeconds?: number;
  elapsedDuration?: number;
  movingDuration?: number;
  moving_time?: number;
  elapsed_sec?: number;
  distance?: number;
  totalDistance?: number;
  avgSpeed?: number;
  averageSpeed?: number;
  maxSpeed?: number;
  avg_speed?: number;
  max_speed?: number;
  avgHr?: number;
  maxHr?: number;
  minHr?: number;
  avg_heart_rate?: number;
  max_heart_rate?: number;
  min_heart_rate?: number;
  calories?: number;
  bmrCalories?: number;
  elevationGain?: number;
  elevationLoss?: number;
  minElevation?: number;
  maxElevation?: number;
  elevation_gain?: number;
  elevation_loss?: number;
  steps?: number;
  avgRunCadence?: number;
  maxRunCadence?: number;
  avgDoubleCadence?: number;
  avg_cadence?: number;
  vO2MaxValue?: number;
  vo2max?: number;
  aerobicTrainingEffect?: number;
  anaerobicTrainingEffect?: number;
  trainingEffectLabel?: string;
  activityTrainingLoad?: number;
  training_effect?: number;
  normPower?: number;
  avgPower?: number;
  maxPower?: number;
  avgVerticalOscillation?: number;
  avgGroundContactTime?: number;
  avgStrideLength?: number;
  avgVerticalRatio?: number;
  startLongitude?: number;
  startLatitude?: number;
  endLongitude?: number;
  endLatitude?: number;
  locationName?: string;
  location?: string;
  manufacturer?: string;
  lapCount?: number;
  activeSets?: number;
  totalSets?: number;
  totalReps?: number;
  waterEstimated?: number;
  source_id?: string;
  [key: string]: unknown;
}

export interface NormalizedActivity {
  // Identità
  source: 'garmin';
  source_id: string;
  name: string;
  type: string;

  // Tempo
  date: Date | null;
  duration_sec: number | null;      // secondi
  elapsed_sec: number | null;       // secondi
  moving_sec: number | null;        // secondi

  // Distanza e velocità
  distance_m: number | null;        // metri
  avg_speed_mps: number | null;     // m/s
  max_speed_mps: number | null;     // m/s
  pace_min_per_km: number | null;   // min/km

  // Elevazione
  elevation_gain_m: number | null;  // metri
  elevation_loss_m: number | null;  // metri
  min_elevation_m: number | null;   // metri
  max_elevation_m: number | null;   // metri

  // Cardiaco
  avg_hr: number | null;
  max_hr: number | null;
  min_hr: number | null;

  // Metabolico
  calories_kcal: number | null;     // kcal

  // Corsa
  steps: number | null;
  avg_cadence: number | null;
  avg_stride_length_m: number | null;
  vo2max: number | null;
  aerobic_te: number | null;
  anaerobic_te: number | null;
  training_load: number | null;

  // Posizione
  start_lat: number | null;
  start_lon: number | null;
  end_lat: number | null;
  end_lon: number | null;
  location: string | null;

  // Palestra
  active_sets: number | null;
  total_sets: number | null;
  total_reps: number | null;
}

function n(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null;
}

function toDate(ms: number | null): Date | null {
  if (ms === null) return null;
  const d = new Date(ms);
  return Number.isNaN(d.getTime()) ? null : d;
}

function toDateLike(value: unknown): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }
  if (typeof value === 'string' || typeof value === 'number') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  return null;
}

function firstNumber(...values: unknown[]): number | null {
  for (const value of values) {
    const parsed = n(value);
    if (parsed !== null) return parsed;
  }
  return null;
}

function hasGarminRawSignals(raw: GarminRawActivity): boolean {
  // Consideriamo "raw" solo quando sono presenti campi tipici dell'export Garmin,
  // NON solo activityId/source_id che esistono anche sui record canonical nel DB.
  return (
    n(raw.startTimeLocal) !== null ||
    n(raw.startTimeGmt) !== null ||
    n(raw.beginTimestamp) !== null ||
    typeof raw.activityType === 'string' ||
    typeof raw.sportType === 'string' ||
    raw.totalDistance !== undefined ||
    raw.movingDuration !== undefined ||
    raw.elapsedDuration !== undefined ||
    raw.avgSpeed !== undefined ||
    raw.maxSpeed !== undefined ||
    raw.elevationGain !== undefined ||
    raw.elevationLoss !== undefined
  );
}

function normalizeType(activityType?: string, sportType?: string, canonicalType?: string): string {
  const candidate = (activityType ?? sportType ?? canonicalType ?? '').trim();
  const raw = candidate.toUpperCase();
  const map: Record<string, string> = {
    RUNNING: 'running',
    TRAIL_RUNNING: 'running',
    CYCLING: 'cycling',
    WALKING: 'walking',
    HIKING: 'hiking',
    SWIMMING: 'swimming',
    STRENGTH_TRAINING: 'strength',
    FITNESS_EQUIPMENT: 'strength',
    YOGA: 'yoga',
    ELLIPTICAL: 'elliptical',
    STAIR_CLIMBING: 'stairs',
  };
  return map[raw] ?? (candidate || 'unknown').toLowerCase();
}

function normalizeSpeed(rawSpeed: number | null): number | null {
  if (rawSpeed === null) return null;
  // Nel JSON Garmin la velocità è in m/s ma i valori sembrano cm/ms
  // 0.294 cm/ms = 2.94 m/s (pace ~5:41/km) → corretto per una corsa
  if (rawSpeed > 0 && rawSpeed < 2) {
    return Math.round(rawSpeed * 10 * 1000) / 1000;
  }
  return rawSpeed;
}

function calcPace(speedMps: number | null): number | null {
  if (!speedMps || speedMps <= 0) return null;
  return Math.round((1000 / speedMps / 60) * 100) / 100;
}

function isLikelySeconds(value: number): boolean {
  // Oltre ~100k e' quasi sempre millisecondi (27+ ore in secondi e raro in attivita standard).
  return value <= 100_000;
}

function toSeconds(value: number | null): number | null {
  if (value === null) return null;
  return Math.round(isLikelySeconds(value) ? value : value / 1000);
}

function pickDistanceMeters(
  rawDistance: number,
  durationSec: number | null,
  avgSpeedMps: number | null
): number {
  const asMeters = rawDistance;
  const asCentimeters = rawDistance / 100;

  if (!durationSec || durationSec <= 0) {
    // Fallback prudente: valori enormi dal raw Garmin sono spesso in cm.
    return rawDistance > 100_000 ? asCentimeters : asMeters;
  }

  const speedMeters = asMeters / durationSec;
  const speedCm = asCentimeters / durationSec;
  const plausibleMeters = speedMeters >= 0.2 && speedMeters <= 25;
  const plausibleCm = speedCm >= 0.2 && speedCm <= 25;

  if (plausibleMeters && !plausibleCm) return asMeters;
  if (plausibleCm && !plausibleMeters) return asCentimeters;

  if (avgSpeedMps !== null && avgSpeedMps > 0) {
    const errMeters = Math.abs(speedMeters - avgSpeedMps);
    const errCm = Math.abs(speedCm - avgSpeedMps);
    return errCm < errMeters ? asCentimeters : asMeters;
  }

  // Se entrambe plausibili, preferiamo metri per non comprimere attivita gia canoniche.
  return asMeters;
}

/**
 * Converte un documento Garmin raw (dal DB o dal JSON) in formato normalizzato per il FE.
 * Tutte le conversioni di unita sono qui - una sola responsabilita.
 */
export function convertGarminRaw(raw: GarminRawActivity): NormalizedActivity {
  const fromRaw = hasGarminRawSignals(raw);

  // Data: raw Garmin (epoch ms) oppure campo date gia' normalizzato
  const dateMs = firstNumber(raw.startTimeLocal, raw.startTimeGmt, raw.beginTimestamp);
  const date = toDate(dateMs) ?? toDateLike(raw.startTime) ?? toDateLike(raw.date);

  // Durata: supporta secondi o millisecondi senza fidarsi solo del "tipo record".
  const rawDuration = firstNumber(raw.totalTimeInSeconds, raw.duration);
  const duration_sec =
    rawDuration !== null
      ? raw.totalTimeInSeconds !== undefined
        ? Math.round(rawDuration)
        : toSeconds(rawDuration)
      : null;

  const rawElapsed = firstNumber(raw.elapsedDuration, raw.elapsed_sec);
  const elapsed_sec =
    rawElapsed !== null
      ? raw.elapsed_sec !== undefined
        ? Math.round(rawElapsed)
        : toSeconds(rawElapsed)
      : null;

  const rawMoving = firstNumber(raw.moving_time, raw.movingDuration);
  const moving_sec =
    rawMoving !== null
      ? raw.moving_time !== undefined
        ? Math.round(rawMoving)
        : toSeconds(rawMoving)
      : null;

  // Velocita'
  const avgSpeedRaw = firstNumber(raw.avgSpeed, raw.averageSpeed, raw.avg_speed);
  const maxSpeedRaw = firstNumber(raw.maxSpeed, raw.max_speed);
  const avg_speed_mps = avgSpeedRaw !== null ? (fromRaw ? normalizeSpeed(avgSpeedRaw) : avgSpeedRaw) : null;
  const max_speed_mps = maxSpeedRaw !== null ? (fromRaw ? normalizeSpeed(maxSpeedRaw) : maxSpeedRaw) : null;

  // Distanza: raw Garmin puo' arrivare in cm; record gia' canonici in metri.
  const candidateDistance = firstNumber(raw.totalDistance, raw.distance);
  let distance_m: number | null = null;
  if (candidateDistance !== null) {
    if (raw.totalDistance !== undefined) {
      distance_m = Math.round(candidateDistance * 100) / 100;
    } else {
      const meters = pickDistanceMeters(candidateDistance, duration_sec, avg_speed_mps);
      distance_m = Math.round(meters * 100) / 100;
    }
  }

  const pace_min_per_km = calcPace(avg_speed_mps);

  // Elevazione: raw Garmin in cm, schema normalizzato in metri
  const gainRaw = firstNumber(raw.elevationGain, raw.elevation_gain);
  const lossRaw = firstNumber(raw.elevationLoss, raw.elevation_loss);
  const minElevRaw = firstNumber(raw.minElevation);
  const maxElevRaw = firstNumber(raw.maxElevation);

  const elevation_gain_m = gainRaw !== null ? Math.round((fromRaw && raw.elevation_gain === undefined ? gainRaw / 100 : gainRaw) * 10) / 10 : null;
  const elevation_loss_m = lossRaw !== null ? Math.round((fromRaw && raw.elevation_loss === undefined ? lossRaw / 100 : lossRaw) * 10) / 10 : null;
  const min_elevation_m = minElevRaw !== null ? Math.round((fromRaw ? minElevRaw / 100 : minElevRaw) * 10) / 10 : null;
  const max_elevation_m = maxElevRaw !== null ? Math.round((fromRaw ? maxElevRaw / 100 : maxElevRaw) * 10) / 10 : null;

  function normalizeCaloriesKcal(
    caloriesRaw: number | null,
    distanceM: number | null,
    durationSec: number | null
  ): number | null {
    if (caloriesRaw === null) return null;

    const raw = Math.round(caloriesRaw);
    const converted = Math.round(raw / 4.184);

    // Heuristic 1: plausibilità kcal/km quando c'è distanza.
    if (distanceM !== null && distanceM > 0) {
      const km = distanceM / 1000;
      const rawPerKm = raw / km;
      const convPerKm = converted / km;

      // Se il valore raw è palesemente troppo alto ma quello convertito è plausibile,
      // il dato originale è in pratica energia non espressa in kcal.
      if (rawPerKm > 160 && convPerKm >= 20 && convPerKm <= 130) {
        return converted;
      }
    }

    // Heuristic 2: fallback su kcal/ora quando non c'è distanza affidabile.
    if (durationSec !== null && durationSec > 0) {
      const hours = durationSec / 3600;
      const rawPerHour = raw / hours;
      const convPerHour = converted / hours;

      if (rawPerHour > 1400 && convPerHour >= 150 && convPerHour <= 1200) {
        return converted;
      }
    }

    // Guard rail: valori enormi raramente sono kcal reali in questo dominio.
    if (raw > 3000 && converted > 0 && converted < raw) {
      return converted;
    }

    return raw;
  }

  // Calorie Garmin:
  // normalizziamo in kcal con regole di plausibilità,
  // evitando di rovinare i record già corretti.
  const caloriesRaw = firstNumber(raw.calories);
  const calories_kcal = normalizeCaloriesKcal(caloriesRaw, distance_m, duration_sec);

  // Cadenza: Garmin usa avgRunCadence (per gamba)
  const avg_cadence =
    n(raw.avg_cadence) ??
    (n(raw.avgRunCadence) !== null
      ? Math.round(n(raw.avgRunCadence)! * 2)
      : n(raw.avgDoubleCadence) !== null
        ? Math.round(n(raw.avgDoubleCadence)!)
        : null);

  // Falcata: cm -> metri
  const avg_stride_length_m = n(raw.avgStrideLength) !== null ? Math.round((fromRaw ? n(raw.avgStrideLength)! / 100 : n(raw.avgStrideLength)!) * 100) / 100 : null;

  function normalizeSourceId(raw: GarminRawActivity, date: Date | null): string {
    if (typeof raw.source_id === 'string' && raw.source_id.trim().length > 0) {
      return raw.source_id.trim();
    }

    if (typeof raw.activityId === 'number' && Number.isFinite(raw.activityId)) {
      return String(raw.activityId);
    }

    return `garmin_${date?.getTime() ?? Date.now()}`;
  }

  return {
    source: 'garmin',
    source_id: normalizeSourceId(raw, date),
    name: (raw.name ?? '').trim() || 'Attivita Garmin',
    type: normalizeType(raw.activityType, raw.sportType, raw.type),

    date,
    duration_sec,
    elapsed_sec,
    moving_sec,

    distance_m,
    avg_speed_mps,
    max_speed_mps,
    pace_min_per_km,

    elevation_gain_m,
    elevation_loss_m,
    min_elevation_m,
    max_elevation_m,

    avg_hr: firstNumber(raw.avgHr, raw.avg_heart_rate),
    max_hr: firstNumber(raw.maxHr, raw.max_heart_rate),
    min_hr: firstNumber(raw.minHr, raw.min_heart_rate),

    calories_kcal,

    steps: n(raw.steps),
    avg_cadence,
    avg_stride_length_m,
    vo2max: firstNumber(raw.vO2MaxValue, raw.vo2max),
    aerobic_te: n(raw.aerobicTrainingEffect),
    anaerobic_te: n(raw.anaerobicTrainingEffect),
    training_load: firstNumber(raw.activityTrainingLoad, raw.training_effect),

    start_lat: n(raw.startLatitude),
    start_lon: n(raw.startLongitude),
    end_lat: n(raw.endLatitude),
    end_lon: n(raw.endLongitude),
    location: typeof raw.locationName === 'string' ? raw.locationName : typeof raw.location === 'string' ? raw.location : null,

    active_sets: n(raw.activeSets),
    total_sets: n(raw.totalSets),
    total_reps: n(raw.totalReps),
  };
}
