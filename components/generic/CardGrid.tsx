'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { ButtonTone } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BadgeChip } from '@/components/BadgeChip';
import type { BadgeChipType } from '@/components/BadgeChip';
import type { BadgeChipSize } from '@/components/BadgeChip';

export type CardGridType = 'running' | 'track_running' | 'trekking' | 'trip';
export type CardGridColor = 'current' | 'blue' | 'purple' | 'black';
export type CardGridVariant = 'default' | 'activity';

export interface CardGridItem {
  id: string;
  title: string;
  href: string;
  image?: string;
  type?: CardGridType;
  date?: string;
  description?: string;
  distance?: string;
  duration?: string;
  pace?: string;
  kcal?: string;
  hasPhoto?: boolean; // Se true, mostra il badge "Photo" sulla card activity
}

export interface CardGridSortOption {
  value: string;
  label: string;
}

interface CardGridProps {
  variant?: CardGridVariant;
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
  showBadgeOnImage?: boolean;
  showDate?: boolean;
  showDescription?: boolean;
  useMotion?: boolean;
  visibleItems?: number;
  showVisibilityToggle?: boolean;
  showMoreLabel?: string;
  showLessLabel?: string;
  visibilityToggleClassName?: string;
  showMoreTone?: ButtonTone;
  showLessTone?: ButtonTone;
  sortOptions?: CardGridSortOption[];
  sortValue?: string;
  onSortChange?: (value: string) => void;
  sortLabel?: string;
  showItemsCount?: boolean;
  itemsCountLabel?: string;
  tone?: CardGridColor;
  sectionClassName?: string;
  titleColor?: CardGridColor;
  subtitleColor?: CardGridColor;
  onItemClick?: (item: CardGridItem) => void;
  maxCards?: number;
  activityPhotoBadgePosition?: 'border' | 'date-row'; // 'border' = fuori dal bordo card, 'date-row' = a destra della data
  activityPhotoBadgeSize?: BadgeChipSize;
  activityPhotoBadgeRounded?: boolean;
  activityTextColor?: CardGridColor;
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

const activityTextVariants: Record<CardGridColor, { title: string; date: string; label: string; value: string }> = {
  current: {
    title: 'text-slate-900 dark:text-white',
    date: 'text-slate-500 dark:text-slate-400',
    label: 'text-slate-600 dark:text-slate-400',
    value: 'text-slate-900 dark:text-white',
  },
  blue: {
    title: 'text-blue-700 dark:text-blue-300',
    date: 'text-blue-600 dark:text-blue-400',
    label: 'text-blue-700 dark:text-blue-300',
    value: 'text-blue-700 dark:text-blue-300',
  },
  purple: {
    title: 'text-violet-800 dark:text-violet-300',
    date: 'text-violet-700 dark:text-violet-400',
    label: 'text-violet-700 dark:text-violet-300',
    value: 'text-violet-800 dark:text-violet-200',
  },
  black: {
    title: 'text-black dark:text-slate-200',
    date: 'text-black/70 dark:text-slate-300',
    label: 'text-black/80 dark:text-slate-300',
    value: 'text-black dark:text-slate-200',
  },
};

function toBadgeType(type?: CardGridType): BadgeChipType | null {
  if (!type) return null;
  if (type === 'track_running') return 'running';
  if (type === 'running' || type === 'trekking' || type === 'trip') return type;
  return null;
}

export function CardGrid({
  variant = 'default',
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
  showBadgeOnImage = false,
  showDate = true,
  showDescription = false,
  useMotion = true,
  visibleItems,
  showVisibilityToggle = true,
  showMoreLabel = 'Mostra tutte',
  showLessLabel = 'Mostra meno',
  visibilityToggleClassName = '',
  showMoreTone = 'blue',
  showLessTone = 'black',
  sortOptions,
  sortValue,
  onSortChange,
  sortLabel = 'Sort by',
  showItemsCount = false,
  itemsCountLabel = 'attività',
  tone,
  sectionClassName = 'px-4 py-16 sm:px-6 lg:px-8 bg-white dark:bg-slate-900',
  titleColor = 'current',
  subtitleColor = 'current',
  onItemClick,
  maxCards,
  activityPhotoBadgePosition = 'border',
  activityPhotoBadgeSize = 'medium',
  activityPhotoBadgeRounded = false,
  activityTextColor = 'current',
}: CardGridProps) {
  const itemsToDisplay = useMemo(() => {
    if (maxCards && maxCards > 0) {
      return items.slice(0, maxCards);
    }
    return items;
  }, [items, maxCards]);
  const resolvedTitleColor = tone ?? titleColor;
  const resolvedSubtitleColor = tone ?? subtitleColor;
  const titleColorClass = textColorVariants[resolvedTitleColor].title;
  const subtitleColorClass = textColorVariants[resolvedSubtitleColor].subtitle;
  const activityTextStyle = activityTextVariants[activityTextColor];
  const normalizedVisibleItems =
    typeof visibleItems === 'number' && Number.isFinite(visibleItems) && visibleItems > 0
      ? Math.floor(visibleItems)
      : null;

  // Conta quanti item mostrare (paginazione a gruppi)
  const [shownCount, setShownCount] = useState<number>(normalizedVisibleItems ?? Infinity);

  useEffect(() => {
    setShownCount(normalizedVisibleItems ?? Infinity);
  }, [normalizedVisibleItems, items.length]);

  const displayedItems = useMemo(() => {
    if (maxCards && maxCards > 0) return items.slice(0, maxCards);
    if (!normalizedVisibleItems) return items;
    return items.slice(0, shownCount);
  }, [items, normalizedVisibleItems, shownCount, maxCards]);

  const hasMore = !maxCards && Boolean(normalizedVisibleItems) && items.length > shownCount;
  const hasLess = !maxCards && Boolean(normalizedVisibleItems) && shownCount > (normalizedVisibleItems ?? 0);

  const shouldShowToggle =
    Boolean(showVisibilityToggle) &&
    Boolean(normalizedVisibleItems) &&
    (hasMore || hasLess) &&
    !maxCards;

  const headerAnimation = useMotion
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        viewport: { once: true },
      }
    : {};

  const shouldShowHeader = Boolean(title || subtitle || showItemsCount || (sortOptions && sortOptions.length > 0 && onSortChange));
  const headerBottomSpacing = title || subtitle ? 'mb-10' : 'mb-6';

  return (
    <section className={`${sectionClassName} ${className}`}>
      <div className={`max-w-6xl mx-auto ${containerClassName}`}>
        {shouldShowHeader ? (
          <motion.div
            {...headerAnimation}
            className={`flex items-end justify-between gap-4 flex-wrap ${headerBottomSpacing}`}
          >
            <div>
              {title ? <h2 className={`text-3xl sm:text-4xl font-bold mb-2 ${titleColorClass}`}>{title}</h2> : null}
              {subtitle ? <p className={subtitleColorClass}>{subtitle}</p> : null}
            </div>
            {(showItemsCount || (sortOptions && sortOptions.length > 0 && onSortChange)) ? (
              <div className="ml-auto flex items-center gap-4 text-sm text-slate-600 dark:text-slate-300">
                {showItemsCount ? <span className="whitespace-nowrap">{items.length} {itemsCountLabel}</span> : null}
                {sortOptions && sortOptions.length > 0 && onSortChange ? (
                  <div className="flex items-center gap-2">
                    <span className="font-medium whitespace-nowrap">{sortLabel}</span>
                    <Select value={sortValue} onValueChange={onSortChange}>
                      <SelectTrigger className="h-9 min-w-[12.5rem] border-slate-300 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100">
                        <SelectValue placeholder="Seleziona" />
                      </SelectTrigger>
                      <SelectContent>
                        {sortOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ) : null}
              </div>
            ) : null}
          </motion.div>
        ) : null}

        <div className={`${columnsClassName} ${gridClassName}`}>
          {displayedItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={useMotion ? { opacity: 0, y: 30 } : undefined}
              whileInView={useMotion ? { opacity: 1, y: 0 } : undefined}
              transition={useMotion ? { duration: 0.5, delay: index * 0.1 } : undefined}
              viewport={useMotion ? { once: true } : undefined}
            >
              {onItemClick ? (
                <button
                  type="button"
                  onClick={() => onItemClick(item)}
                  className="block group h-full w-full text-left"
                >
                  {variant === 'activity' ? (
                    // Wrapper relativo per permettere al badge di stare FUORI dalla card (overflow-visible)
                    <div className={activityPhotoBadgePosition === 'border' ? 'relative pt-3' : 'relative'}>
                      {item.hasPhoto && activityPhotoBadgePosition === 'border' && (
                        <BadgeChip
                          type="photo"
                          size={activityPhotoBadgeSize}
                          rounded={activityPhotoBadgeRounded}
                          text="Foto"
                          className="absolute -top-0 right-3 z-20 shadow-sm"
                        />
                      )}
                      <Card className={`overflow-hidden hover:shadow-lg transition-shadow h-full cursor-pointer group-hover:scale-[1.02] duration-300 ${cardClassName}`}>
                        {item.image ? (
                          <div className="relative h-52 w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                            <Image
                              src={item.image}
                              alt={item.title}
                              fill
                              className={`object-cover group-hover:scale-105 transition-transform duration-300 ${imageClassName}`}
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                          </div>
                        ) : null}
                        <CardHeader className="pb-2">
                          <CardTitle className={`text-lg truncate ${activityTextStyle.title}`}>
                            {item.title}
                          </CardTitle>
                          <div className="flex items-center justify-between mt-1">
                            {showDate && item.date ? <p className={`text-xs ${activityTextStyle.date}`}>{item.date}</p> : <span />}
                            {item.hasPhoto && activityPhotoBadgePosition === 'date-row' && (
                              <BadgeChip
                                type="photo"
                                size={activityPhotoBadgeSize}
                                rounded={activityPhotoBadgeRounded}
                                text="Foto"
                              />
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 gap-4">
                          <div>
                            <p className={`text-xs ${activityTextStyle.label}`}>Distanza</p>
                            <p className={`font-bold ${activityTextStyle.value}`}>{item.distance || '—'}</p>
                          </div>
                          <div>
                            <p className={`text-xs ${activityTextStyle.label}`}>Tempo</p>
                            <p className={`font-bold ${activityTextStyle.value}`}>{item.duration || '—'}</p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <Card className={`overflow-hidden hover:shadow-lg transition-shadow h-full cursor-pointer group-hover:scale-[1.02] duration-300 ${cardClassName}`}>
                      <div className="relative h-48 w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                        <Image
                          src={item.image || fallbackImage}
                          alt={item.title}
                          fill
                          className={`object-cover group-hover:scale-110 transition-transform duration-300 ${imageClassName}`}
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                            {showTypeBadge && showBadgeOnImage && toBadgeType(item.type) && (
                          <BadgeChip
                                type={toBadgeType(item.type) as BadgeChipType}
                            text={item.type}
                            floating
                            position="top-right"
                            className="z-10"
                          />
                        )}
                      </div>
                      <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                          <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {item.title}
                          </CardTitle>
                          {showTypeBadge && !showBadgeOnImage && toBadgeType(item.type) && (
                            <BadgeChip type={toBadgeType(item.type) as BadgeChipType} text={item.type} className="whitespace-nowrap" />
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
                  )}
                </button>
               ) : (
                 <Link href={item.href} className="block group h-full">
                   {variant === 'activity' ? (
                     <div className={activityPhotoBadgePosition === 'border' ? 'relative pt-3' : 'relative'}>
                       {item.hasPhoto && activityPhotoBadgePosition === 'border' && (
                         <BadgeChip
                           type="photo"
                           size={activityPhotoBadgeSize}
                           rounded={activityPhotoBadgeRounded}
                           text="Foto"
                           className="absolute -top-0 right-3 z-20 shadow-sm"
                         />
                       )}
                       <Card className={`overflow-hidden hover:shadow-lg transition-shadow h-full cursor-pointer group-hover:scale-[1.02] duration-300 ${cardClassName}`}>
                         {item.image ? (
                           <div className="relative h-52 w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                             <Image
                               src={item.image}
                               alt={item.title}
                               fill
                               className={`object-cover group-hover:scale-105 transition-transform duration-300 ${imageClassName}`}
                               sizes="(max-width: 768px) 100vw, 50vw"
                             />
                           </div>
                         ) : null}
                         <CardHeader className="pb-2">
                           <CardTitle className={`text-lg truncate ${activityTextStyle.title}`}>
                             {item.title}
                           </CardTitle>
                           <div className="flex items-center justify-between mt-1">
                             {showDate && item.date ? <p className={`text-xs ${activityTextStyle.date}`}>{item.date}</p> : <span />}
                             {item.hasPhoto && activityPhotoBadgePosition === 'date-row' && (
                               <BadgeChip
                                 type="photo"
                                 size={activityPhotoBadgeSize}
                                 rounded={activityPhotoBadgeRounded}
                                 text="Foto"
                               />
                             )}
                           </div>
                         </CardHeader>
                         <CardContent className="grid grid-cols-2 gap-4">
                           <div>
                             <p className={`text-xs ${activityTextStyle.label}`}>Distanza</p>
                             <p className={`font-bold ${activityTextStyle.value}`}>{item.distance || '—'}</p>
                           </div>
                           <div>
                             <p className={`text-xs ${activityTextStyle.label}`}>Tempo</p>
                             <p className={`font-bold ${activityTextStyle.value}`}>{item.duration || '—'}</p>
                           </div>
                         </CardContent>
                       </Card>
                     </div>
                   ) : (
                     <Card className={`overflow-hidden hover:shadow-lg transition-shadow h-full cursor-pointer group-hover:scale-[1.02] duration-300 ${cardClassName}`}>
                       <div className="relative h-48 w-full overflow-hidden bg-slate-200 dark:bg-slate-700">
                         <Image
                           src={item.image || fallbackImage}
                           alt={item.title}
                           fill
                           className={`object-cover group-hover:scale-110 transition-transform duration-300 ${imageClassName}`}
                           sizes="(max-width: 768px) 100vw, 33vw"
                         />
                         {showTypeBadge && showBadgeOnImage && toBadgeType(item.type) && (
                           <BadgeChip
                             type={toBadgeType(item.type) as BadgeChipType}
                             text={item.type}
                             floating
                             position="top-right"
                             className="z-10"
                           />
                         )}
                       </div>
                       <CardHeader>
                         <div className="flex items-start justify-between gap-2">
                           <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                             {item.title}
                           </CardTitle>
                           {showTypeBadge && !showBadgeOnImage && toBadgeType(item.type) && (
                             <BadgeChip type={toBadgeType(item.type) as BadgeChipType} text={item.type} className="whitespace-nowrap" />
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
                   )}
                 </Link>
               )}
            </motion.div>
          ))}
        </div>

        {shouldShowToggle ? (
          <div className={`mt-8 flex justify-center gap-3 ${visibilityToggleClassName}`}>
            {hasMore && (
              <Button
                variant="outline"
                tone={showMoreTone}
                onClick={() => setShownCount((prev) => prev + (normalizedVisibleItems ?? 4))}
              >
                {showMoreLabel}
              </Button>
            )}
            {hasLess && (
              <Button
                variant="outline"
                tone={showLessTone}
                onClick={() => setShownCount(normalizedVisibleItems ?? 4)}
              >
                {showLessLabel}
              </Button>
            )}
          </div>
        ) : null}
      </div>
    </section>
  );
}

