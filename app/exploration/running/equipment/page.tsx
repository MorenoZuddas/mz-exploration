"use client";

import EquipmentPage from '@/components/EquipmentPage';

const runningEquipment = [
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
];

export default function RunningEquipmentPage() {
  return (
    <EquipmentPage
      title="Attrezzatura Running"
      backUrl="/exploration/running"
      items={runningEquipment}
    />
  );
}

