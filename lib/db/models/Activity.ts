import mongoose, { Schema, Document } from 'mongoose';
import type { ActivityPhoto } from '@/types/activity';

export interface IActivity extends Document {
  // Informazioni generali
  name?: string;
  type?: string; // 'running', 'cycling', 'hiking', etc.
  date?: Date;
  description?: string;

  // Dati distanza e tempo
  distance?: number; // in metri (o valore raw se import diretto)
  duration?: number; // in secondi (o valore raw se import diretto)
  moving_time?: number; // in secondi

  // Dati di performance
  avg_speed?: number; // m/s
  max_speed?: number; // m/s
  avg_pace?: number; // minuti al km
  elevation_gain?: number; // metri
  elevation_loss?: number; // metri

  // Metriche cardiache
  avg_heart_rate?: number;
  max_heart_rate?: number;

  // Metriche respiratorie e metaboliche
  avg_cadence?: number;
  calories?: number;
  vo2max?: number;
  training_effect?: number;

  // Dati GPS
  gps_data?: {
    polyline?: string;
    points?: Array<{
      lat: number;
      lon: number;
      elevation?: number;
      timestamp?: Date;
    }>;
  };

  // Metadati
  source: 'garmin' | 'strava' | 'manual'; // da dove proviene
  source_id?: string; // ID esterno (es. garmin_id, strava_id)
  fingerprint?: string; // SHA256 per deduplicazione
  activityId?: number; // raw Garmin ID (se inserito direttamente nel DB)
  device_info?: {
    name?: string;
    model?: string;
  };
  weather?: {
    condition?: string;
    temperature?: number;
    humidity?: number;
  };

  // Raw Garmin originale (payload non convertito)
  raw_payload?: Record<string, unknown>;

  photos: ActivityPhoto[];

  // Timestamp
  created_at: Date;
  updated_at: Date;
  synced_at?: Date;
}

const photoSchema = new Schema<ActivityPhoto>(
  {
    public_id: { type: String, required: true },
    secure_url: { type: String, required: true },
    width: { type: Number },
    height: { type: Number },
  },
  { _id: false }
);

const activitySchema = new Schema<IActivity>(
  {
    name: { type: String },
    type: { type: String },
    date: { type: Date },
    description: { type: String },

    distance: { type: Number },
    duration: { type: Number },
    moving_time: { type: Number },

    avg_speed: { type: Number },
    max_speed: { type: Number },
    avg_pace: { type: Number },
    elevation_gain: { type: Number },
    elevation_loss: { type: Number },

    avg_heart_rate: { type: Number },
    max_heart_rate: { type: Number },

    avg_cadence: { type: Number },
    calories: { type: Number },
    vo2max: { type: Number },
    training_effect: { type: Number },

    gps_data: {
      polyline: { type: String },
      points: [
        {
          lat: { type: Number },
          lon: { type: Number },
          elevation: { type: Number },
          timestamp: { type: Date },
        },
      ],
    },

    source: {
      type: String,
      enum: ['garmin', 'strava', 'manual'],
      required: true,
    },
    source_id: { type: String },
    fingerprint: { type: String },
    activityId: { type: Number },

    device_info: {
      name: { type: String },
      model: { type: String },
    },
    weather: {
      condition: { type: String },
      temperature: { type: Number },
      humidity: { type: Number },
    },

    raw_payload: { type: Schema.Types.Mixed },

    photos: { type: [photoSchema], default: [] },

    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    synced_at: { type: Date },
  },
  { timestamps: false }
);

// Indici per performance
activitySchema.index({ date: -1 });
activitySchema.index({ type: 1 });

// Unicita' forte: blocca duplicati anche se qualcuno inserisce direttamente dal DB client.
activitySchema.index(
  { source: 1, source_id: 1 },
  {
    unique: true,
    name: 'uniq_source_source_id',
    partialFilterExpression: {
      source: { $exists: true },
      source_id: { $exists: true, $type: 'string' },
    },
  }
);

activitySchema.index(
  { fingerprint: 1 },
  {
    unique: true,
    name: 'uniq_fingerprint',
    partialFilterExpression: {
      fingerprint: { $exists: true, $type: 'string' },
    },
  }
);

activitySchema.index(
  { activityId: 1 },
  {
    unique: true,
    name: 'uniq_activityId_raw',
    partialFilterExpression: {
      activityId: { $exists: true, $type: 'number' },
    },
  }
);

// Fallback per record senza source_id/fingerprint ma uguali nei campi base.
activitySchema.index(
  { source: 1, date: 1, type: 1, distance: 1, duration: 1 },
  {
    unique: true,
    name: 'uniq_source_date_type_distance_duration',
    partialFilterExpression: {
      source: { $exists: true, $type: 'string' },
      date: { $exists: true, $type: 'date' },
      type: { $exists: true, $type: 'string' },
      distance: { $exists: true, $type: 'number' },
      duration: { $exists: true, $type: 'number' },
    },
  }
);

export const Activity =
  mongoose.models.Activity ||
  mongoose.model<IActivity>('Activity', activitySchema, 'activities');

