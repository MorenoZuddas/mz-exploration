'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export type CardGridType = 'running' | 'trekking' | 'trip';
export type CardGridColor = 'current' | 'blue' | 'purple' | 'black';

export interface CardGridItem {
  id: string;
  title: string;
  href: string;
  image: string;
  type?: CardGridType;
  date?: string;
  description?: string;
}

interface CardGridProps {
  title?: string;
  subtitle?: string;
  items?: CardGridItem[];
  className?: string;
  containerClassName?: string;
  gridClassName?: string;
  cardClassName?: string;
  imageClassName?: string;
  columnsClassName?: string;
  fallbackImage?: string;
  showTypeBadge?: boolean;
  showDate?: boolean;
  showDescription?: boolean;
  useMotion?: boolean;
  tone?: CardGridColor;
  sectionClassName?: string;
  titleColor?: CardGridColor;
  subtitleColor?: CardGridColor;
}

const defaultItems: CardGridItem[] = [
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

const typeColors: Record<CardGridType, string> = {
  running: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  trekking: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  trip: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
};

const typeEmojis: Record<CardGridType, string> = {
  running: '🏃',
  trekking: '🥾',
  trip: '✈️',
};

const textColorVariants: Record<CardGridColor, { title: string; subtitle: string }> = {
  current: {
    title: 'text-slate-900 dark:text-white',
    subtitle: 'text-slate-600 dark:text-slate-400',
  },
  blue: {
    title: 'text-blue-700 dark:text-blue-300',
    subtitle: 'text-blue-600 dark:text-blue-400',
  },
  purple: {
    title: 'text-violet-800 dark:text-violet-300',
    subtitle: 'text-violet-700 dark:text-violet-400',
  },
  black: {
    title: 'text-black dark:text-slate-200',
    subtitle: 'text-black/80 dark:text-slate-300',
  },
};

export function CardGrid({
  title = 'Ultime Avventure',
  subtitle = 'I momenti piu recenti dalle mie attivita',
  items = defaultItems,
  className = '',
  containerClassName = '',
  gridClassName = '',
  cardClassName = '',
  imageClassName = '',
  columnsClassName = 'grid grid-cols-1 md:grid-cols-3 gap-6',
  fallbackImage = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=80',
  showTypeBadge = true,
  showDate = true,
  showDescription = false,
  useMotion = true,
  tone,
  sectionClassName = 'px-4 py-16 sm:px-6 lg:px-8 bg-white dark:bg-slate-900',
  titleColor = 'current',
  subtitleColor = 'current',
}: CardGridProps) {
  const resolvedTitleColor = tone ?? titleColor;
  const resolvedSubtitleColor = tone ?? subtitleColor;
  const titleColorClass = textColorVariants[resolvedTitleColor].title;
  const subtitleColorClass = textColorVariants[resolvedSubtitleColor].subtitle;
  const headerAnimation = useMotion
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        viewport: { once: true },
      }
    : {};

  return (
    <section className={`${sectionClassName} ${className}`}>
      <div className={`max-w-6xl mx-auto ${containerClassName}`}>
        <motion.div
          {...headerAnimation}
          className="mb-12"
        >
          <h2 className={`text-3xl sm:text-4xl font-bold mb-2 ${titleColorClass}`}>{title}</h2>
          {subtitle && <p className={subtitleColorClass}>{subtitle}</p>}
        </motion.div>

        <div className={`${columnsClassName} ${gridClassName}`}>
          {items.map((item, index) => (
            <motion.div
              key={item.id}
              initial={useMotion ? { opacity: 0, y: 30 } : undefined}
              whileInView={useMotion ? { opacity: 1, y: 0 } : undefined}
              transition={useMotion ? { duration: 0.5, delay: index * 0.1 } : undefined}
              viewport={useMotion ? { once: true } : undefined}
            >
              <Link href={item.href} className="block group h-full">
                <Card className={`overflow-hidden hover:shadow-lg transition-shadow h-full cursor-pointer group-hover:scale-[1.02] duration-300 ${cardClassName}`}>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                    <Image
                      src={item.image || fallbackImage}
                      alt={item.title}
                      fill
                      className={`object-cover group-hover:scale-110 transition-transform duration-300 ${imageClassName}`}
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.title}
                      </CardTitle>
                      {showTypeBadge && item.type && (
                        <span
                          className={`px-2 py-1 rounded text-sm font-semibold whitespace-nowrap ${typeColors[item.type]}`}
                        >
                          {typeEmojis[item.type]} {item.type}
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {showDescription && item.description && (
                      <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                    )}
                    {showDate && item.date && (
                      <p className="text-sm text-slate-500 dark:text-slate-400">{item.date}</p>
                    )}
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

