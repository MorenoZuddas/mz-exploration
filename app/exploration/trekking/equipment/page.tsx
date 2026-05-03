"use client";

import EquipmentPage from '@/components/EquipmentPage';

const trekkingEquipment = [
  {
    id: 'boots-1',
    name: 'Scarponi Trekking',
    category: 'Calzature',
    brand: 'Salomon',
    model: 'X Ultra Mid 4 GTX',
    year: 2024,
    description: 'Scarponi impermeabili con ottimo grip per sentieri tecnici e uscite lunghe.',
    icon: '🥾',
    km: 320,
    condition: 'Buono' as const,
  },
  {
    id: 'pack-1',
    name: 'Zaino Escursionismo',
    category: 'Zaino',
    brand: 'Osprey',
    model: 'Talon 22',
    year: 2024,
    description: 'Zaino leggero e stabile per trekking giornalieri, con tasche rapide e supporto idrico.',
    icon: '🎒',
    condition: 'Nuovo' as const,
  },
  {
    id: 'poles-1',
    name: 'Bastoncini Trekking',
    category: 'Accessori',
    brand: 'Black Diamond',
    model: 'Trail Explorer 3',
    year: 2023,
    description: 'Bastoncini regolabili in alluminio utili su salite ripide e discese lunghe.',
    icon: '🦯',
    condition: 'Buono' as const,
  },
  {
    id: 'shell-1',
    name: 'Giacca Antipioggia',
    category: 'Abbigliamento',
    brand: 'The North Face',
    model: 'DryVent Shell',
    year: 2024,
    description: 'Shell antivento e impermeabile, compatta nello zaino e adatta a meteo variabile.',
    icon: '🧥',
    condition: 'Nuovo' as const,
  },
  {
    id: 'lamp-1',
    name: 'Lampada Frontale',
    category: 'Sicurezza',
    brand: 'Petzl',
    model: 'Actik Core',
    year: 2023,
    description: 'Frontale ricaricabile utile per partenze all\'alba, rientri tardi o emergenze.',
    icon: '🔦',
    condition: 'Buono' as const,
  },
];

export default function TrekkingEquipmentPage() {
  return (
    <EquipmentPage
      title="Attrezzatura Trekking"
      backUrl="/exploration/trekking"
      items={trekkingEquipment}
    />
  );
}

