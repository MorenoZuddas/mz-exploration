import Navigation from '../components/Navigation';

export default function GalleryPage() {
  const photos = [
    {
      id: 1,
      title: 'Cagliari Corsa',
      date: '25 Marzo 2026',
      distance: '9.01 km',
      description: 'Una bella corsa lungo le strade di Cagliari'
    },
    {
      id: 2,
      title: 'Lunamatrona Lungo',
      date: '24 Marzo 2026',
      distance: '20.02 km',
      description: 'Lungo collinare a Lunamatrona'
    },
    {
      id: 3,
      title: 'Cagliari Pista',
      date: '23 Marzo 2026',
      distance: '2.95 km',
      description: 'Allenamento veloce sulla pista'
    },
    {
      id: 4,
      title: 'Oristano Half Marathon',
      date: '22 Febbraio 2026',
      distance: '21.10 km',
      description: 'Mezza maratona di Oristano - 1:30:49'
    },
    {
      id: 5,
      title: '25k Collinari',
      date: '22 Marzo 2026',
      distance: '25.02 km',
      description: 'Gara collinare - Record personale!'
    },
    {
      id: 6,
      title: 'Cagliari Corsa',
      date: '21 Marzo 2026',
      distance: '8.09 km',
      description: 'Corsa mattutina a Cagliari'
    }
  ];

  return (
    <>

      <div className="max-w-6xl mx-auto py-16 px-4">
        <h1 className="text-5xl font-bold mb-4">Percorsi e Foto</h1>
        <p className="text-xl text-gray-600 mb-12">
          Scopri i miei percorsi di running e le foto delle mie attività
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {photos.map((photo) => (
            <div key={photo.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              {/* Placeholder Image */}
              <div className="bg-gradient-to-br from-blue-400 to-blue-600 h-48 flex items-center justify-center">
                <span className="text-6xl">🏃</span>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{photo.title}</h3>
                <p className="text-gray-600 mb-4">{photo.description}</p>

                <div className="space-y-2 text-sm text-gray-600">
                  <p>📅 {photo.date}</p>
                  <p>📍 {photo.distance}</p>
                </div>

                <button className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
                  Visualizza Percorso
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}