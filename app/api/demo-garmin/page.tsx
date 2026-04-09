'use client';

import { useState } from 'react';

interface ActivityFormData {
  name: string;
  type: string;
  date: string;
  distance: number;
  duration: number;
  elevation_gain?: number;
  calories?: number;
}

function toRecord(value: unknown): Record<string, unknown> | null {
  return typeof value === 'object' && value !== null ? (value as Record<string, unknown>) : null;
}

export default function GarminDemoPage() {
  const [activities, setActivities] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(false);
  const [jsonInput, setJsonInput] = useState('');
  const [formData, setFormData] = useState<ActivityFormData>({
    name: '',
    type: 'running',
    date: new Date().toISOString().split('T')[0],
    distance: 0,
    duration: 0,
  });

  // Test connessione database
  const handleTestConnection = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/test-db');
      const data = await res.json();
      alert(`✅ ${data.message}\n\nAttività: ${data.data.collections.activities}\nSync Logs: ${data.data.collections.sync_logs}`);
    } catch (error) {
      alert(`❌ Errore: ${error instanceof Error ? error.message : 'Unknown'}`);
    } finally {
      setLoading(false);
    }
  };

  // Carica le attività esistenti
  const handleLoadActivities = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/activities/garmin');
      const data = await res.json();
      setActivities(data.data.recent_activities || []);
      alert(`✅ ${data.data.total_activities} attività totali`);
    } catch (error) {
      alert(`❌ Errore: ${error instanceof Error ? error.message : 'Unknown'}`);
    } finally {
      setLoading(false);
    }
  };

  // Import da JSON testuale
  const handleImportJSON = async () => {
    if (!jsonInput.trim()) {
      alert('❌ Incolla il JSON prima');
      return;
    }

    setLoading(true);
    try {
      const jsonData = JSON.parse(jsonInput);
      const activitiesToImport = Array.isArray(jsonData) ? jsonData : [jsonData];

      // Aggiungi source se manca (fingerprint viene generato lato API)
      const processedActivities = activitiesToImport.flatMap((activity: unknown) => {
        const record = toRecord(activity);
        if (!record) return [];
        return [{ ...record, source: 'garmin' }];
      });

      if (processedActivities.length === 0) {
        throw new Error('Nessun oggetto attività valido trovato nel JSON');
      }

      const res = await fetch('/api/activities/garmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(processedActivities),
      });

      const result = await res.json();
      if (result.status === 'success') {
        alert(`✅ ${result.message}\n\nSalvate: ${result.data.saved}\nSaltate: ${result.data.skipped}`);
        setJsonInput('');
        handleLoadActivities();
      } else {
        alert(`❌ ${result.message}`);
      }
    } catch (error) {
      alert(`❌ JSON invalido: ${error instanceof Error ? error.message : 'Unknown'}`);
    } finally {
      setLoading(false);
    }
  };

  // Aggiungi manualmente
  const handleAddManually = async () => {
    if (!formData.name || formData.distance <= 0 || formData.duration <= 0) {
      alert('❌ Compila i campi obbligatori');
      return;
    }

    setLoading(true);
    try {
      const activity = {
        name: formData.name,
        type: formData.type,
        date: new Date(formData.date),
        distance: formData.distance,
        duration: formData.duration,
        elevation_gain: formData.elevation_gain || undefined,
        calories: formData.calories || undefined,
        source: 'manual',
      };

      const res = await fetch('/api/activities/garmin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify([activity]),
      });

      const result = await res.json();
      if (result.status === 'success') {
        alert('✅ Attività aggiunta');
        setFormData({
          name: '',
          type: 'running',
          date: new Date().toISOString().split('T')[0],
          distance: 0,
          duration: 0,
        });
        handleLoadActivities();
      }
    } catch (error) {
      alert(`❌ Errore: ${error instanceof Error ? error.message : 'Unknown'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">🏃 Garmin Activities Manager</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pannello Test DB */}
          <div className="bg-slate-700 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">🔗 Test Database</h2>
            <button
              onClick={handleTestConnection}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded transition"
            >
              {loading ? 'Testing...' : 'Test Connection'}
            </button>
            <button
              onClick={handleLoadActivities}
              disabled={loading}
              className="w-full mt-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded transition"
            >
              {loading ? 'Loading...' : 'Load Activities'}
            </button>
          </div>

          {/* Pannello JSON Input */}
          <div className="bg-slate-700 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">📄 Import da JSON</h2>
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              placeholder="Incolla qui il JSON dal file Garmin..."
              className="w-full h-32 bg-slate-800 text-white p-3 rounded border border-slate-600 focus:border-blue-500 focus:outline-none text-sm font-mono"
            />
            <button
              onClick={handleImportJSON}
              disabled={loading}
              className="w-full mt-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded transition"
            >
              {loading ? 'Importing...' : 'Import JSON'}
            </button>
          </div>

          {/* Pannello Aggiungi Manualmente */}
          <div className="bg-slate-700 rounded-lg p-6 shadow-xl">
            <h2 className="text-xl font-bold text-white mb-4">➕ Aggiungi Manualmente</h2>
            <input
              type="text"
              placeholder="Nome attività"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mb-2 bg-slate-800 text-white p-2 rounded border border-slate-600 text-sm"
            />
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full mb-2 bg-slate-800 text-white p-2 rounded border border-slate-600 text-sm"
            >
              <option value="running">🏃 Running</option>
              <option value="cycling">🚴 Cycling</option>
              <option value="hiking">🥾 Hiking</option>
              <option value="walking">🚶 Walking</option>
            </select>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="w-full mb-2 bg-slate-800 text-white p-2 rounded border border-slate-600 text-sm"
            />
            <input
              type="number"
              placeholder="Distanza (m)"
              value={formData.distance || ''}
              onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) })}
              className="w-full mb-2 bg-slate-800 text-white p-2 rounded border border-slate-600 text-sm"
            />
            <input
              type="number"
              placeholder="Durata (s)"
              value={formData.duration || ''}
              onChange={(e) => setFormData({ ...formData, duration: parseFloat(e.target.value) })}
              className="w-full mb-2 bg-slate-800 text-white p-2 rounded border border-slate-600 text-sm"
            />
            <button
              onClick={handleAddManually}
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 disabled:bg-gray-500 text-white font-bold py-3 px-4 rounded transition"
            >
              {loading ? 'Adding...' : 'Add Activity'}
            </button>
          </div>
        </div>

        {/* Lista Attività */}
        <div className="mt-8 bg-slate-700 rounded-lg p-6 shadow-xl">
          <h2 className="text-2xl font-bold text-white mb-4">📋 Recent Activities</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-white text-sm">
              <thead className="border-b border-slate-600">
                <tr>
                  <th className="text-left p-2">Nome</th>
                  <th className="text-left p-2">Tipo</th>
                  <th className="text-left p-2">Data</th>
                  <th className="text-right p-2">Distanza (km)</th>
                  <th className="text-right p-2">Durata (min)</th>
                  <th className="text-left p-2">Source</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-gray-400">
                      Nessuna attività caricata
                    </td>
                  </tr>
                ) : (
                  activities.map((activity: unknown) => {
                    const act = activity as Record<string, unknown>;
                    return (
                      <tr key={String(act._id)} className="border-b border-slate-600 hover:bg-slate-600">
                        <td className="p-2">{String(act.name)}</td>
                        <td className="p-2">{String(act.type)}</td>
                        <td className="p-2">
                          {new Date(String(act.date)).toLocaleDateString('it-IT')}
                        </td>
                        <td className="text-right p-2">
                          {((act.distance as number) / 1000).toFixed(2)}
                        </td>
                        <td className="text-right p-2">
                          {Math.round((act.duration as number) / 60)}
                        </td>
                        <td className="p-2">{String(act.source)}</td>
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
