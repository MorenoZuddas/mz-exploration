import Navigation from '../components/Navigation';

export default function AboutPage() {
  return (
    <>
      <Navigation />

      <div className="max-w-6xl mx-auto py-16 px-4">
        <h1 className="text-5xl font-bold mb-12">Chi Sono</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Bio Section */}
          <div>
            <h2 className="text-3xl font-bold mb-6">Moreno Zuddas</h2>

            <p className="text-gray-600 mb-4 text-lg">
              Sono un runner appassionato da Cagliari, Sardegna. La corsa è la mia passione
              e questo progetto nasce dalla voglia di analizzare e tracciare i miei progressi
              nel running.
            </p>

            <p className="text-gray-600 mb-6 text-lg">
              Ho iniziato a correre nel 2025 e da allora non ho mai smesso. Ogni giorno
              cerco di migliorarmi e di raggiungere nuovi obiettivi.
            </p>

            <h3 className="text-2xl font-bold mb-4">Obiettivi</h3>
            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <span className="text-gray-600">Mezza maratona sotto 1:20:00</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <span className="text-gray-600">10K sotto 40:00</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <span className="text-gray-600">Maratona sotto 3:00:00</span>
              </li>
            </ul>
          </div>

          {/* Stats Section */}
          <div>
            <h3 className="text-2xl font-bold mb-6">I Miei Numeri</h3>

            <div className="space-y-4">
              <div className="bg-blue-50 rounded-lg p-6">
                <p className="text-gray-600 mb-2">Km Totali</p>
                <p className="text-4xl font-bold text-blue-600">1055</p>
              </div>

              <div className="bg-green-50 rounded-lg p-6">
                <p className="text-gray-600 mb-2">Numero di Uscite</p>
                <p className="text-4xl font-bold text-green-600">158</p>
              </div>

              <div className="bg-yellow-50 rounded-lg p-6">
                <p className="text-gray-600 mb-2">Pace Media</p>
                <p className="text-4xl font-bold text-yellow-600">5:14/km</p>
              </div>

              <div className="bg-red-50 rounded-lg p-6">
                <p className="text-gray-600 mb-2">Dislivello Totale</p>
                <p className="text-4xl font-bold text-red-600">~500km</p>
              </div>
            </div>

            <h3 className="text-2xl font-bold mt-8 mb-4">Tecnologie Usate</h3>
            <div className="flex flex-wrap gap-2">
              {['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'MongoDB', 'Vercel'].map((tech) => (
                <span key={tech} className="bg-gray-200 text-gray-800 px-4 py-2 rounded-full text-sm font-semibold">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}