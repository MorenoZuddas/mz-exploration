"use client";

import Link from 'next/link';
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
}

export default function EquipmentPage({ title, backUrl, items }: EquipmentPageProps) {
  const groupedByCategory = items.reduce((acc, item) => {
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
            href={backUrl}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-6 font-semibold"
          >
            ← Torna Indietro
          </Link>
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            🎽 {title}
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
