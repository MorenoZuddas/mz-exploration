'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LatestAdventure {
  id: string;
  title: string;
  type: 'running' | 'trekking' | 'trip';
  image: string;
  date: string;
  href: string;
}

const baseAdventures: LatestAdventure[] = [
  {
    id: 'running-25k',
    title: '25k Collinari',
    type: 'running',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=800&q=80',
    date: '22 Mar 2026',
    href: '/exploration/running/22257187842',
  },
  {
    id: 'trekking-recent',
    title: 'Tre Cime Trek',
    type: 'trekking',
    image: 'https://images.pexels.com/photos/355465/pexels-photo-355465.jpeg?auto=compress&cs=tinysrgb&w=800',
    date: '15 Mar 2026',
    href: '/exploration/trekking',
  },
  {
    id: 'trips-generic',
    title: 'Barcellona Weekend',
    type: 'trip',
    image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80',
    date: '10 Mar 2026',
    href: '/exploration/trips',
  },
];

const typeColors: Record<string, string> = {
  running: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  trekking: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  trip: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
};

const typeEmojis: Record<string, string> = {
  running: '🏃',
  trekking: '🥾',
  trip: '✈️',
};

export function CardGrid() {
  const adventures = baseAdventures;

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Ultime Avventure
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            I momenti piu recenti dalle mie attivita
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {adventures.map((adventure, index) => (
            <motion.div
              key={adventure.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Link href={adventure.href} className="block group h-full">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full cursor-pointer group-hover:scale-105 duration-300">
                  <div className="relative h-48 w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                    <Image
                      src={adventure.image}
                      alt={adventure.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {adventure.title}
                      </CardTitle>
                      <span
                        className={`px-2 py-1 rounded text-sm font-semibold whitespace-nowrap ${typeColors[adventure.type]}`}
                      >
                        {typeEmojis[adventure.type]} {adventure.type}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{adventure.date}</p>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
