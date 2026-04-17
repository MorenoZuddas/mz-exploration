"use client";

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface EquipmentItem {
  id: string;
  name: string;
  category: string;
  brand: string;
  model: string;
  year: number;
  description: string;
  icon: string;
  km?: number;
  condition: 'Nuovo' | 'Buono' | 'Usurato';
}

const equipmentData: Record<string, { title: string; backUrl: string; items: EquipmentItem[] }> = {
  running: {
    title: 'Attrezzatura Running',
    backUrl: '/exploration/running',
    items: [
      {
        id: 'shoe-1',
        name: 'Scarpe Running',
        category: 'Scarpe',
        brand: 'Nike',
        model: 'Pegasus 41',
        year: 2024,
        description: 'Scarpe versatili per la strada, comode e reattive. Ideali per gli allenamenti quotidiani.',
        icon: '👟',
        km: 450,
        condition: 'Buono' as const,
      },
      {
        id: 'shoe-2',
        name: 'Scarpe Trail',
        category: 'Scarpe',
        brand: 'ASICS',
        model: 'Gel-Venture 8',
        year: 2023,
        description: 'Scarpe trail running con grip eccellente. Perfette per terreni tecnici.',
        icon: '👞',
        km: 280,
        condition: 'Buono' as const,
      },
      {
        id: 'watch-1',
        name: 'Orologio GPS',
        category: 'Orologio',
        brand: 'Garmin',
        model: 'Forerunner 265',
        year: 2024,
        description: 'Orologio sportivo con GPS integrato. Traccia corsa, frequenza cardiaca, metriche VO2Max.',
        icon: '⌚',
        condition: 'Nuovo' as const,
      },
      {
        id: 'shirt-1',
        name: 'Maglietta Running',
        category: 'Abbigliamento',
        brand: 'Nike',
        model: 'Dri-FIT',
        year: 2024,
        description: 'Maglietta traspirante in tessuto tecnico, perfetta per lunghe distanze.',
        icon: '👕',
        condition: 'Buono' as const,
      },
      {
        id: 'shorts-1',
        name: 'Pantaloncini',
        category: 'Abbigliamento',
        brand: 'Adidas',
        model: 'Ultraboost',
        year: 2023,
        description: 'Pantaloncini leggeri con tasche, ideali per corse in estate.',
        icon: '🩳',
        condition: 'Buono' as const,
      },
      {
        id: 'backpack-1',
        name: 'Zaino Running',
        category: 'Accessori',
        brand: 'Decathlon',
        model: 'Trail 10L',
        year: 2024,
        description: 'Zaino leggero da 10L con supporto per flacone d\'acqua e tasche tecniche.',
        icon: '🎒',
        condition: 'Nuovo' as const,
      },
    ],
  },
  trekking: {
    title: 'Attrezzatura Trekking',
    backUrl: '/exploration/trekking',
    items: [
      {
        id: 'shoe-trek-1',
        name: 'Scarpe Trekking',
        category: 'Scarpe',
        brand: 'Salomon',
        model: 'Quest 4D 3',
        year: 2023,
        description: 'Scarpe trekking robuste con supporto della caviglia. Ideali per sentieri montani e terreni accidentati.',
        icon: '🥾',
        km: 320,
        condition: 'Buono' as const,
      },
      {
        id: 'backpack-trek-1',
        name: 'Zaino Trekking',
        category: 'Zaini',
        brand: 'Osprey',
        model: 'Atmos AG 65',
        year: 2022,
        description: 'Zaino da 65L con sistema di ventilazione AntiGravity. Perfetto per trek di più giorni.',
        icon: '🎒',
        km: 1200,
        condition: 'Buono' as const,
      },
      {
        id: 'tent-1',
        name: 'Tenda 2 Posti',
        category: 'Campeggio',
        brand: 'MSR',
        model: 'Hubba Hubba NX',
        year: 2023,
        description: 'Tenda ultraleggera a 2 posti, resistente alle intemperie. Grande spazio interno.',
        icon: '⛺',
        condition: 'Nuovo' as const,
      },
      {
        id: 'sleeping-bag-1',
        name: 'Sacco a Pelo',
        category: 'Campeggio',
        brand: 'The North Face',
        model: 'Inferno -10°C',
        year: 2023,
        description: 'Sacco a pelo con temperatura di comfort fino a -10°C, ideale per montagna.',
        icon: '🛏️',
        condition: 'Nuovo' as const,
      },
      {
        id: 'jacket-trek-1',
        name: 'Giacca Impermeabile',
        category: 'Abbigliamento',
        brand: 'Arc\'teryx',
        model: 'Beta LT',
        year: 2024,
        description: 'Giacca shell in Gore-Tex, leggera e completamente impermeabile.',
        icon: '🧥',
        condition: 'Nuovo' as const,
      },
      {
        id: 'pants-trek-1',
        name: 'Pantaloni Trekking',
        category: 'Abbigliamento',
        brand: 'Decathlon',
        model: 'MH500',
        year: 2023,
        description: 'Pantaloni tecnici in tessuto elastico, ideali per escursioni.',
        icon: '👖',
        condition: 'Buono' as const,
      },
      {
        id: 'poles-1',
        name: 'Bastoncini Trekking',
        category: 'Accessori',
        brand: 'Black Diamond',
        model: 'Ultralite',
        year: 2024,
        description: 'Bastoncini ultraleggeri in carbonio, riducono l\'affaticamento alle gambe.',
        icon: '🏔️',
        condition: 'Nuovo' as const,
      },
      {
        id: 'water-bottle-1',
        name: 'Borraccia Termica',
        category: 'Accessori',
        brand: 'Nalgene',
        model: 'Thermos 1L',
        year: 2023,
        description: 'Borraccia isolante che mantiene le bevande a temperatura costante.',
        icon: '🧊',
        condition: 'Buono' as const,
      },
    ],
  },
};

export default function EquipmentPage() {
  const params = useParams();
  const type = (params?.type as string) || 'running';
  const data = equipmentData[type] || equipmentData.running;

  const groupedByCategory = data.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, EquipmentItem[]>);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 border-b border-slate-200 dark:border-slate-700">
        <div className="max-w-4xl mx-auto">
          <Link
            href={data.backUrl}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 font-semibold"
          >
            ← Torna Indietro
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            🎽 {data.title}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300">
            L&apos;attrezzatura che utilizzo per le mie avventure
          </p>
        </div>
      </section>

      {/* Equipment Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {Object.entries(groupedByCategory).map(([category, categoryItems]) => (
            <div key={category} className="mb-12">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <span className="text-2xl">{item.icon}</span>
                            {item.name}
                          </CardTitle>
                          <CardDescription>
                            {item.brand} {item.model}
                          </CardDescription>
                        </div>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full"
                          style={{
                            backgroundColor: item.condition === 'Nuovo' ? '#d4edda' :
                                            item.condition === 'Buono' ? '#fff3cd' : '#f8d7da',
                            color: item.condition === 'Nuovo' ? '#155724' :
                                   item.condition === 'Buono' ? '#856404' : '#721c24'
                          }}
                        >
                          {item.condition}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {item.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-slate-600 dark:text-slate-400">Anno Acquisto</p>
                          <p className="font-semibold text-slate-900 dark:text-white">{item.year}</p>
                        </div>
                        {item.km && (
                          <div>
                            <p className="text-slate-600 dark:text-slate-400">Km/Usi</p>
                            <p className="font-semibold text-slate-900 dark:text-white">{item.km}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
