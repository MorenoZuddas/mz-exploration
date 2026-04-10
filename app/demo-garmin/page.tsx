'use client';

import { useState, useRef } from 'react';

interface Activity {
  _id?: string;
  source_id?: string;
  name: string;
  type: string;
  date: string | null;
  duration_sec: number | null;
  elapsed_sec?: number | null;
  moving_sec?: number | null;
  distance_m: number | null;
  avg_speed_mps?: number | null;
  pace_min_per_km?: number | null;
  elevation_gain_m?: number | null;
  elevation_loss_m?: number | null;
  avg_hr?: number | null;
  max_hr?: number | null;
  calories_kcal?: number | null;
  steps?: number | null;
  avg_cadence?: number | null;
  vo2max?: number | null;
  aerobic_te?: number | null;
  location?: string | null;
  source: string;
}

interface UploadResult {
  total_processed: number;
  saved: number;
  duplicates_found_in_db?: number;
  skipped: number;
  maintenance?: {
    total_duplicates_removed?: number;
  };
  errors?: string[];
}

interface FloatingNotice {
  text: string;
  tone: 'success';
}

interface ApiErrorPayload {
  message?: string;
  error?: string;
}

function extractApiError(payload: ApiErrorPayload, fallback: string): string {
  const message = payload?.message?.trim();
  const error = payload?.error?.trim();

  if (message && error && error !== message) return `${message} - ${error}`;
  if (error) return error;
  if (message) return message;
  return fallback;
}

export default function DemoGarminPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingDB, setLoadingDB] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [loadingManual, setLoadingManual] = useState(false);
  const [dbStatus, setDbStatus] = useState<{ total_activities: number; total_sync_logs: number } | null>(null);
  const [dbMessage, setDbMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [manualMessage, setManualMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [floatingNotice, setFloatingNotice] = useState<FloatingNotice | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'running',
    date: new Date().toISOString().split('T')[0],
    distance: 0,
    duration: 0,
  });

  const getActivityKey = (activity: Activity, idx: number): string => {
    if (activity._id) return `db-${activity._id}`;

    const composite = [
      activity.source || 'garmin',
      activity.source_id || '',
      activity.date || '',
      activity.name || '',
      activity.duration_sec ?? '',
      activity.distance_m ?? '',
    ].join('|');

    // Ultimo fallback per evitare collisioni in casi estremi di dati identici
    return composite !== 'garmin|||||' ? composite : `row-${idx}`;
  };

  // Test connessione database
  const handleTestConnection = async () => {
    setLoadingDB(true);
    setDbMessage(null);
    try {
      const res = await fetch('/api/test-db');
      const data = await res.json();
      if (!res.ok) throw new Error(extractApiError(data as ApiErrorPayload, 'Errore sconosciuto'));
      setDbMessage({ text: `✅ Connesso — Attività: ${data.data.collections.activities}`, ok: true });
    } catch (error) {
      setDbMessage({ text: `❌ ${error instanceof Error ? error.message : 'Errore connessione'}`, ok: false });
    } finally {
      setLoadingDB(false);
    }
  };

  // Verifica lo status del DB
  const handleCheckStatus = async () => {
    setLoadingDB(true);
    setDbMessage(null);
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      if (!res.ok) throw new Error(extractApiError(data as ApiErrorPayload, 'Errore sconosciuto'));
      setDbStatus({
        total_activities: data.database.total_activities,
        total_sync_logs: data.database.total_sync_logs,
      });
      setDbMessage({ text: '✅ Status aggiornato', ok: true });
    } catch (error) {
      setDbMessage({ text: `❌ ${error instanceof Error ? error.message : 'Errore status'}`, ok: false });
    } finally {
      setLoadingDB(false);
    }
  };

  // Carica le attività esistenti (silenzioso, nessun alert)
  const handleLoadActivities = async () => {
    setLoadingDB(true);
    setDbMessage(null);
    try {
      const res = await fetch('/api/activities/garmin');
      const data = await res.json();
      if (!res.ok) throw new Error(extractApiError(data as ApiErrorPayload, 'Errore caricamento'));
      const list: Activity[] = data.data.recent_activities || [];
      setActivities(list);
      setDbMessage({ text: `✅ ${data.data.total_activities} attività caricate`, ok: true });
    } catch (error) {
      setDbMessage({ text: `❌ ${error instanceof Error ? error.message : 'Errore caricamento'}`, ok: false });
    } finally {
      setLoadingDB(false);
    }
  };

  // Upload JSON Garmin
  const handleJSONUpload = async (file: File) => {
    if (!file.name.endsWith('.json')) {
      setUploadError('❌ Seleziona un file .json valido');
      return;
    }
    setLoadingUpload(true);
    setUploadResult(null);
    setUploadError(null);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = await fetch('/api/activities/garmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
      });
      const data = await res.json();
      if (!res.ok || data.status !== 'success') {
        throw new Error(extractApiError(data as ApiErrorPayload, 'Errore import'));
      }
      setUploadResult(data.data as UploadResult);
      const removed = data.data?.maintenance?.total_duplicates_removed;
      const duplicatesInDb = (data.data as UploadResult)?.duplicates_found_in_db ?? 0;
      const skipped = (data.data as UploadResult)?.skipped ?? 0;
      if ((typeof removed === 'number' && removed > 0) || skipped > 0 || duplicatesInDb > 0) {
        const totalDuplicates = (typeof removed === 'number' ? removed : 0) + skipped + duplicatesInDb;
        showFloatingNotice(`✅ Upload JSON: trovati/rimossi ${totalDuplicates} duplicati`);
      }
      // Aggiorna la lista silenziosamente
      const listRes = await fetch('/api/activities/garmin');
      const listData = await listRes.json();
      if (listRes.ok) setActivities(listData.data.recent_activities || []);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : '❌ File JSON non valido o errore server');
    } finally {
      setLoadingUpload(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleJSONUpload(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleJSONUpload(file);
  };

  // Aggiungi manualmente
  const handleAddManually = async () => {
    if (!formData.name || formData.distance <= 0 || formData.duration <= 0) {
      setManualMessage({ text: '❌ Compila tutti i campi obbligatori', ok: false });
      return;
    }
    setLoadingManual(true);
    setManualMessage(null);
    try {
      const fingerprintRaw = `${formData.date}_${formData.type}_${formData.distance}_${formData.duration}`;
      const fingerprint = Array.from(
        new TextEncoder().encode(fingerprintRaw)
      ).map(b => b.toString(16).padStart(2, '0')).join('');

      const activity = {
        activityName: formData.name,
        activityType: formData.type.toUpperCase(),
        startTime: new Date(formData.date).toISOString(),
        totalDistance: formData.distance,
        totalTimeInSeconds: formData.duration,
        source: 'manual',
        fingerprint,
      };

      const res = await fetch('/api/activities/garmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([activity]),
      });
      const result = await res.json();
      if (!res.ok || result.status !== 'success') {
        throw new Error(extractApiError(result as ApiErrorPayload, 'Errore salvataggio'));
      }
      setManualMessage({ text: `✅ Attività aggiunta (${result.data.saved} salvata)`, ok: true });
      setFormData({ name: '', type: 'running', date: new Date().toISOString().split('T')[0], distance: 0, duration: 0 });
      // Aggiorna lista silenziosamente
      const listRes = await fetch('/api/activities/garmin');
      const listData = await listRes.json();
      if (listRes.ok) setActivities(listData.data.recent_activities || []);
    } catch (error) {
      setManualMessage({ text: `❌ ${error instanceof Error ? error.message : 'Errore'}`, ok: false });
    } finally {
      setLoadingManual(false);
    }
  };

  const showFloatingNotice = (text: string) => {
    setFloatingNotice({ text, tone: 'success' });
    window.setTimeout(() => {
      setFloatingNotice((current) => (current?.text === text ? null : current));
    }, 5000);
  };

  const formatDuration = (durationSec: number | null): string => {
    if (durationSec == null || durationSec < 0) return '—';

    const total = Math.floor(durationSec);
    const hours = Math.floor(total / 3600);
    const minutes = Math.floor((total % 3600) / 60);
    const seconds = total % 60;

    if (total >= 3600) {
      return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    return `${Math.floor(total / 60)}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      {floatingNotice && (
        <div className="fixed top-4 right-4 z-50 max-w-md rounded-lg border border-green-500/40 bg-green-900/80 px-4 py-3 text-green-100 shadow-xl backdrop-blur">
          <div className="flex items-start gap-3">
            <p className="text-sm font-medium">{floatingNotice.text}</p>
            <button
              onClick={() => setFloatingNotice(null)}
              className="ml-auto rounded px-2 py-0.5 text-xs text-white/80 hover:bg-white/10"
            >
              Chiudi
            </button>
          </div>
        </div>
      )}
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">🏃 Activities Manager</h1>
        <p className="text-gray-300 mb-8">Gestisci le tue attività di allenamento</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pannello Database Status */}
          <div className="bg-slate-700 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">🔗 Database Status</h2>
            <button
              onClick={handleTestConnection}
              disabled={loadingDB}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded transition"
            >
              {loadingDB ? '⏳ ...' : '🔌 Test Connection'}
            </button>
            <button
              onClick={handleCheckStatus}
              disabled={loadingDB}
              className="w-full mt-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded transition"
            >
              {loadingDB ? '⏳ ...' : '📊 Check Status'}
            </button>
            <button
              onClick={handleLoadActivities}
              disabled={loadingDB}
              className="w-full mt-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded transition"
            >
              {loadingDB ? '⏳ ...' : '📋 Carica Attività'}
            </button>

            {/* Messaggio feedback DB */}
            {dbMessage && (
              <div className={`mt-3 p-3 rounded text-sm font-medium ${dbMessage.ok ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'}`}>
                {dbMessage.text}
              </div>
            )}

            {/* Status dettagli */}
            {dbStatus && (
              <div className="mt-3 p-3 bg-slate-800 rounded text-sm text-white">
                <p className="font-semibold text-cyan-400 mb-1">📊 DB Status:</p>
                <p>Attività: <span className="text-green-400 font-bold">{dbStatus.total_activities}</span></p>
                <p>Sync logs: <span className="text-green-400 font-bold">{dbStatus.total_sync_logs}</span></p>
              </div>
            )}
          </div>

          {/* Pannello Upload JSON Garmin */}
          <div className="bg-slate-700 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-1">📂 Importa JSON Garmin</h2>
            <p className="text-gray-400 text-sm mb-4">
              Esporta da Garmin Connect → <strong>Formato JSON</strong> e carica qui
            </p>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                dragOver ? 'border-blue-400 bg-blue-900/30' : 'border-slate-500 hover:border-blue-500 hover:bg-slate-600'
              }`}
            >
              <div className="text-4xl mb-2">📁</div>
              <p className="text-white font-semibold mb-1">Trascina il file JSON qui</p>
              <p className="text-gray-400 text-sm">oppure clicca per selezionare</p>
              <input ref={fileInputRef} type="file" accept=".json" onChange={handleFileChange} className="hidden" />
            </div>

            {loadingUpload && (
              <div className="mt-4 p-3 bg-slate-800 rounded text-center text-yellow-300 text-sm animate-pulse">
                ⏳ Importazione in corso...
              </div>
            )}
            {uploadResult && !loadingUpload && (
              <div className="mt-4 p-4 bg-green-900/50 border border-green-600 rounded text-sm text-white">
                <p className="font-bold text-green-400 mb-1">✅ Import completato!</p>
                <p>📦 Processate: <strong>{uploadResult.total_processed}</strong></p>
                <p>✅ Salvate: <strong className="text-green-400">{uploadResult.saved}</strong></p>
                <p>
                  ⏭️ Saltate (duplicati):{' '}
                  <strong className="text-yellow-400">
                    {(uploadResult.skipped ?? 0) +
                      (uploadResult.duplicates_found_in_db ?? 0) +
                      (uploadResult.maintenance?.total_duplicates_removed ?? 0)}
                  </strong>
                </p>
                {uploadResult.errors && uploadResult.errors.length > 0 && (
                  <div className="mt-2">
                    <p className="text-red-400 font-semibold">Errori:</p>
                    {uploadResult.errors.map((e, i) => <p key={i} className="text-red-300 text-xs">{e}</p>)}
                  </div>
                )}
              </div>
            )}
            {uploadError && !loadingUpload && (
              <div className="mt-4 p-3 bg-red-900/50 border border-red-600 rounded text-sm text-red-300">
                {uploadError}
              </div>
            )}
          </div>
        </div>

        {/* Pannello Aggiungi Manualmente */}
        <div className="bg-slate-700 rounded-lg p-6 shadow-xl mb-8">
          <h2 className="text-xl font-bold text-white mb-4">➕ Aggiungi Manualmente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input type="text" placeholder="Nome attività *" value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-slate-800 text-white p-2 rounded border border-slate-600 text-sm" />
            <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="bg-slate-800 text-white p-2 rounded border border-slate-600 text-sm">
              <option value="running">🏃 Running</option>
              <option value="cycling">🚴 Cycling</option>
              <option value="hiking">🥾 Hiking</option>
              <option value="walking">🚶 Walking</option>
            </select>
            <input type="date" value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="bg-slate-800 text-white p-2 rounded border border-slate-600 text-sm" />
            <input type="number" placeholder="Distanza (m) *" value={formData.distance || ''}
              onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) })}
              className="bg-slate-800 text-white p-2 rounded border border-slate-600 text-sm" />
            <input type="number" placeholder="Durata (secondi) *" value={formData.duration || ''}
              onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) })}
              className="bg-slate-800 text-white p-2 rounded border border-slate-600 text-sm" />
            <button onClick={handleAddManually} disabled={loadingManual}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded transition text-sm">
              {loadingManual ? '⏳ Aggiunta...' : '➕ Aggiungi'}
            </button>
          </div>
          {manualMessage && (
            <div className={`mt-3 p-3 rounded text-sm font-medium ${manualMessage.ok ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'}`}>
              {manualMessage.text}
            </div>
          )}
        </div>

        {/* Lista Attività */}
        <div className="bg-slate-700 rounded-lg p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white">📋 Attività ({activities.length})</h2>
            <button onClick={handleLoadActivities} disabled={loadingDB}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold py-2 px-4 rounded text-sm transition">
              {loadingDB ? '⏳' : '🔄 Aggiorna'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-white text-sm">
              <thead className="border-b border-slate-600">
                <tr>
                  <th className="text-left p-2">Nome</th>
                  <th className="text-left p-2">Tipo</th>
                  <th className="text-left p-2">Data</th>
                  <th className="text-right p-2">Distanza (km)</th>
                  <th className="text-right p-2">Durata (min)</th>
                  <th className="text-right p-2">Passo (min/km)</th>
                  <th className="text-right p-2">Dislivello+ (m)</th>
                  <th className="text-right p-2">FC media</th>
                  <th className="text-right p-2">Calorie (kcal)</th>
                  <th className="text-left p-2">Luogo</th>
                  <th className="text-left p-2">Source</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center p-8 text-gray-400">
                      Nessuna attività — clicca <strong>🔄 Aggiorna</strong> o importa un file JSON
                    </td>
                  </tr>
                ) : (
                  activities.map((activity, idx) => {
                    const distKm = activity.distance_m != null ? (activity.distance_m / 1000).toFixed(2) : '—';
                    const durMin = formatDuration(activity.duration_sec);
                    const pace = activity.pace_min_per_km != null
                      ? Math.floor(activity.pace_min_per_km) + ':' + String(Math.round((activity.pace_min_per_km % 1) * 60)).padStart(2, '0')
                      : '—';
                    const dateStr = activity.date ? new Date(activity.date).toLocaleDateString('it-IT') : '—';
                    return (
                    <tr key={getActivityKey(activity, idx)} className="border-b border-slate-600 hover:bg-slate-600">
                      <td className="p-2 font-medium">{activity.name}</td>
                      <td className="p-2 capitalize">{activity.type}</td>
                      <td className="p-2">{dateStr}</td>
                      <td className="text-right p-2">{distKm}</td>
                      <td className="text-right p-2">{durMin}</td>
                      <td className="text-right p-2">{pace}</td>
                      <td className="text-right p-2">{activity.elevation_gain_m != null ? activity.elevation_gain_m.toFixed(1) : '—'}</td>
                      <td className="text-right p-2">{activity.avg_hr ?? '—'}</td>
                      <td className="text-right p-2">{activity.calories_kcal ?? '—'}</td>
                      <td className="p-2 text-gray-300">{activity.location ?? '—'}</td>
                      <td className="p-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          activity.source === 'garmin' ? 'bg-blue-700 text-blue-100' :
                          activity.source === 'strava' ? 'bg-orange-700 text-orange-100' :
                          'bg-gray-600 text-gray-200'
                        }`}>
                          {activity.source}
                        </span>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

