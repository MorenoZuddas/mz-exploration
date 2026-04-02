import Link from 'next/link';
import Navigation from './components/Navigation';

export default function Home() {
  return (
    <>
      <Navigation />

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        {/* Hero Section */}
        <div className="max-w-6xl mx-auto py-20 px-4 text-center">
          <h1 className="text-6xl font-bold mb-4">🏃 Running Analytics</h1>
          <p className="text-2xl text-gray-600 mb-8">
            Analizza le tue attività running con dati Garmin
          </p>

          <div className="flex gap-4 justify-center mb-16">
            <Link
              href="/login"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-bold"
            >
              Accedi
            </Link>
            <Link
              href="/about"
              className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 transition font-bold"
            >
              Scopri di più
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="max-w-6xl mx-auto py-16 px-4">
          <h2 className="text-4xl font-bold text-center mb-12">Cosa Puoi Fare</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3">Statistiche Dettagliate</h3>
              <p className="text-gray-600">
                Visualizza km totali, pace media, frequenza cardiaca e molto altro
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-2xl font-bold mb-3">Traccia Progressione</h3>
              <p className="text-gray-600">
                Monitora i tuoi miglioramenti nel tempo con grafici interattivi
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3">Personal Best</h3>
              <p className="text-gray-600">
                Scopri i tuoi record personali per ogni distanza
              </p>
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-blue-600 text-white py-16">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Statistiche Generali</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <p className="text-5xl font-bold">1055</p>
                <p className="text-blue-100 mt-2">Km Totali</p>
              </div>
              <div>
                <p className="text-5xl font-bold">158</p>
                <p className="text-blue-100 mt-2">Uscite</p>
              </div>
              <div>
                <p className="text-5xl font-bold">5:14</p>
                <p className="text-blue-100 mt-2">Pace Media</p>
              </div>
              <div>
                <p className="text-5xl font-bold">1:30:49</p>
                <p className="text-blue-100 mt-2">Mezza Maratona</p>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="max-w-6xl mx-auto py-16 px-4 text-center">
          <h2 className="text-4xl font-bold mb-8">Pronto a Iniziare?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Accedi per visualizzare tutte le tue attività e statistiche dettagliate
          </p>
          <Link
            href="/login"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition font-bold text-lg"
          >
            Accedi Ora
          </Link>
        </div>
      </div>
    </>
  );
}