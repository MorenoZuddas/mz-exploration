import mongoose, { Schema, Document } from 'mongoose';

export interface ISyncLog extends Document {
  source: 'garmin' | 'strava';
  status: 'started' | 'completed' | 'failed';
  activities_fetched: number;
  activities_saved: number;
  activities_skipped: number;
  error?: string;
  details?: Record<string, unknown>;
  last_sync_timestamp?: Date;
  created_at: Date;
}

const syncLogSchema = new Schema<ISyncLog>(
  {
    source: {
      type: String,
      enum: ['garmin', 'strava'],
      required: true,
    },
    status: {
      type: String,
      enum: ['started', 'completed', 'failed'],
      required: true,
    },
    activities_fetched: { type: Number, default: 0 },
    activities_saved: { type: Number, default: 0 },
    activities_skipped: { type: Number, default: 0 },
    error: { type: String },
    details: { type: Schema.Types.Mixed },
    last_sync_timestamp: { type: Date },
    created_at: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

// Indici
syncLogSchema.index({ source: 1, created_at: -1 });
syncLogSchema.index({ created_at: -1 });

export const SyncLog =
  mongoose.models.SyncLog ||
  mongoose.model<ISyncLog>('SyncLog', syncLogSchema, 'sync_logs');

