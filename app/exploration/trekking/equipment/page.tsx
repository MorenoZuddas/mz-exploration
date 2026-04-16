"use client";

import EquipmentPage from '@/components/EquipmentPage';

const trekkingEquipment = [
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

