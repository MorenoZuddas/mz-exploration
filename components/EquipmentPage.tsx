"use client";

import Link from 'next/link';
import { PageShell, type PageBackground } from '@/components/generic';
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

interface EquipmentPageProps {
  title: string;
  backUrl: string;
  items: EquipmentItem[];
  subtitle?: string;
  className?: string;
  tone?: 'current' | 'blue' | 'purple' | 'black';
  background?: PageBackground;
  backLabel?: string;
  conditionClassMap?: Partial<Record<EquipmentItem['condition'], string>>;
}

const defaultConditionClassMap: Record<EquipmentItem['condition'], string> = {
  Nuovo:   'bg-[var(--color-comp-equipment-condition-new-bg)]  text-[var(--color-comp-equipment-condition-new-text)]',
  Buono:   'bg-[var(--color-comp-equipment-condition-good-bg)] text-[var(--color-comp-equipment-condition-good-text)]',
  Usurato: 'bg-[var(--color-comp-equipment-condition-used-bg)] text-[var(--color-comp-equipment-condition-used-text)]',
};

const toneTitleClassMap: Record<NonNullable<EquipmentPageProps['tone']>, string> = {
  current: 'text-[var(--color-tone-current-title)]',
  blue:    'text-[var(--color-tone-blue-title)]',
  purple:  'text-[var(--color-tone-purple-title)]',
  black:   'text-[var(--color-tone-black-title)]',
};

const toneLinkClassMap: Record<NonNullable<EquipmentPageProps['tone']>, string> = {
  current: 'text-[var(--color-tone-current-accent)] hover:text-[var(--color-tone-current-accent-hover)]',
  blue:    'text-[var(--color-tone-blue-accent)] hover:text-[var(--color-tone-blue-accent-hover)]',
  purple:  'text-[var(--color-tone-purple-accent)] hover:text-[var(--color-tone-purple-accent-hover)]',
  black:   'text-[var(--color-tone-black-accent)] hover:text-[var(--color-tone-black-accent-hover)]',
};

export default function EquipmentPage({
  title,
  backUrl,
  items,
  subtitle = "L'attrezzatura che utilizzo per le mie avventure",
  className = '',
  tone = 'current',
  background = 'white',
  backLabel = '← Torna Indietro',
  conditionClassMap,
}: EquipmentPageProps) {
  const resolvedConditionClassMap = { ...defaultConditionClassMap, ...conditionClassMap };
  const groupedByCategory = items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, EquipmentItem[]>);

  return (
    <PageShell background={background} className={className}>
      {/* Header */}
      <section className="px-4 py-12 sm:px-6 lg:px-8 border-b border-[var(--color-comp-equipment-section-border)]">
        <div className="max-w-4xl mx-auto">
          <Link
            href={backUrl}
            className={`inline-flex items-center mb-6 font-semibold ${toneLinkClassMap[tone]}`}
          >
            {backLabel}
          </Link>
          <h1 className={`text-4xl sm:text-5xl font-bold mb-4 ${toneTitleClassMap[tone]}`}>
            🎽 {title}
          </h1>
          <p className="text-lg text-[var(--color-comp-equipment-meta-text)]">
            {subtitle}
          </p>
        </div>
      </section>

      {/* Equipment Grid */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {Object.entries(groupedByCategory).map(([category, categoryItems]) => (
            <div key={category} className="mb-12">
              <h2 className={`text-2xl font-bold mb-6 ${toneTitleClassMap[tone]}`}>
                {category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryItems.map((item) => (
                  <Card key={item.id} className="hover:shadow-lg transition-shadow" tone={tone}>
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
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${resolvedConditionClassMap[item.condition]}`}>
                          {item.condition}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-[var(--color-comp-equipment-meta-text)]">
                        {item.description}
                      </p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-[var(--color-comp-equipment-meta-text)]">Anno Acquisto</p>
                          <p className="font-semibold text-[var(--color-tone-current-title)]">{item.year}</p>
                        </div>
                        {item.km && (
                          <div>
                            <p className="text-[var(--color-comp-equipment-meta-text)]">Km/Usi</p>
                            <p className="font-semibold text-[var(--color-tone-current-title)]">{item.km}</p>
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
    </PageShell>
  );
}

