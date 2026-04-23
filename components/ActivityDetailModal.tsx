'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ActivityPhotos } from '@/components/ActivityPhotos';

export interface ActivityDetail {
  _id?: string;
  source_id?: string;
  name: string;
  type: string;
  date: string | null;
  distance_m: number | null;
  duration_sec: number | null;
  calories_kcal?: number | null;
  pace_min_per_km?: number | null;
  elevation_gain_m?: number | null;
  elevation_loss_m?: number | null;
  avg_hr?: number | null;
  max_hr?: number | null;
  avg_cadence?: number | null;
  location?: string | null;
  photos?: Array<{ public_id: string; secure_url: string; width?: number; height?: number }>;
}

interface Props {
  activityId: string;
  isOpen: boolean;
  onClose: () => void;
  detailsPageUrl: string;
}

function formatDuration(durationSec: number | null): string {
  if (!durationSec || durationSec <= 0) return '—';
  const total = Math.floor(durationSec);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  if (total >= 3600) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

function formatDistance(distanceM: number | null): string {
  if (!distanceM) return '—';
  const km = distanceM / 1000;
  return km < 10 ? `${Math.round(distanceM).toLocaleString('it-IT')} m` : `${km.toFixed(2)} km`;
}

function formatPace(pace: number | undefined): string {
  if (!pace || pace <= 0) return 'N/A';
  const min = Math.floor(pace);
  const sec = Math.round((pace % 1) * 60);
  return `${min}:${String(sec).padStart(2, '0')}`;
}

export function ActivityDetailModal({ activityId, isOpen, onClose, detailsPageUrl }: Props) {
  const [activity, setActivity] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !activityId) return;

    const fetchActivity = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/activities/${activityId}`);
        if (!response.ok) {
          throw new Error('Attività non trovata');
        }
        const data = await response.json();
        if (data.status === 'success' && data.data?.activity) {
          setActivity(data.data.activity);
        } else {
          setError('Errore nel caricamento');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Errore sconosciuto');
      } finally {
        setLoading(false);
      }
    };

    void fetchActivity();
  }, [isOpen, activityId]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Modale */}
      <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[90vw] md:max-w-2xl md:max-h-[90vh] bg-white dark:bg-slate-800 rounded-lg shadow-2xl z-50 overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {activity?.name || 'Caricamento...'}
            </h2>
            {activity?.date && (
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                {new Date(activity.date).toLocaleDateString('it-IT')} · {activity.location || '—'}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-2xl font-light"
          >
            ✕
          </button>
        </div>

        {/* Contenuto */}
        <div className="p-6 space-y-6">
          {loading && (
            <div className="text-center py-8">
              <p className="text-slate-600 dark:text-slate-400">Caricamento...</p>
            </div>
          )}

          {error && (
            <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg">
              <p className="font-semibold">{error}</p>
            </div>
          )}

          {activity && !loading && (
            <>
              {/* Metriche principali */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Card className="p-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Distanza</p>
                  <p className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatDistance(activity.distance_m)}
                  </p>
                </Card>

                <Card className="p-4">
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Tempo</p>
                  <p className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatDuration(activity.duration_sec)}
                  </p>
                </Card>

                {activity.pace_min_per_km && (
                  <Card className="p-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Pace</p>
                    <p className="text-lg md:text-xl font-bold text-green-600 dark:text-green-400">
                      {formatPace(activity.pace_min_per_km)}
                    </p>
                  </Card>
                )}

                {activity.calories_kcal && (
                  <Card className="p-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Kcal</p>
                    <p className="text-lg md:text-xl font-bold text-orange-600 dark:text-orange-400">
                      {activity.calories_kcal}
                    </p>
                  </Card>
                )}
              </div>

              {/* Foto */}
              {activity.photos && activity.photos.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">📸 Foto</h3>
                  <ActivityPhotos photos={activity.photos} />
                </div>
              )}

              {/* Metriche aggiuntive */}
              {(activity.elevation_gain_m || activity.avg_hr || activity.max_hr || activity.avg_cadence) && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Dettagli</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    {activity.elevation_gain_m && (
                      <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded">
                        <p className="text-slate-600 dark:text-slate-400">Dislivello +</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{activity.elevation_gain_m.toFixed(0)}m</p>
                      </div>
                    )}
                    {activity.avg_hr && (
                      <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded">
                        <p className="text-slate-600 dark:text-slate-400">FC Media</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{activity.avg_hr} bpm</p>
                      </div>
                    )}
                    {activity.max_hr && (
                      <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded">
                        <p className="text-slate-600 dark:text-slate-400">FC Max</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{activity.max_hr} bpm</p>
                      </div>
                    )}
                    {activity.avg_cadence && (
                      <div className="bg-slate-100 dark:bg-slate-700 p-3 rounded">
                        <p className="text-slate-600 dark:text-slate-400">Cadenza</p>
                        <p className="font-semibold text-slate-900 dark:text-white">{activity.avg_cadence}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Azioni */}
              <div className="flex gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition"
                >
                  Chiudi
                </button>
                <Link
                  href={detailsPageUrl}
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-center font-semibold"
                >
                  Vedi Più Dettagli →
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

