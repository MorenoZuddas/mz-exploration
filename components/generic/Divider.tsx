'use client';

import { ListMusic, Library, Camera, PlaneTakeoff, Mountain, Zap, SportShoe } from 'lucide-react';
import type { ReactNode } from 'react';

type DividerIconType = 'running' | 'trekking' | 'trip' | 'books' | 'photo' | 'music' | 'default';

interface DividerProps {
  className?: string;
  containerClassName?: string;
  tone?: 'current' | 'blue' | 'purple' | 'black';
  color?: 'current' | 'blue' | 'purple' | 'black';
  size?: 'sm' | 'md' | 'lg';
  symbol?: string;
  iconType?: DividerIconType;
  backgroundClassName?: string;
}

const iconMap: Record<DividerIconType, ReactNode> = {
  running: <SportShoe className="w-full h-full" strokeWidth={2.25} />,
  trekking: <Mountain className="w-full h-full" strokeWidth={2} />,
  trip: <PlaneTakeoff className="w-full h-full" strokeWidth={2} />,
  books: <Library className="w-full h-full" strokeWidth={2} />,
  photo: <Camera className="w-full h-full" strokeWidth={2} />,
  music: <ListMusic className="w-full h-full" strokeWidth={2} />,
  default: <Zap className="w-full h-full" strokeWidth={2} />,
};

const toneVariants: Record<NonNullable<DividerProps['tone']>, { line: string; symbol: string }> = {
  current: {
    line: 'bg-gradient-to-r from-transparent via-[var(--color-comp-divider-current-line)] to-transparent',
    symbol: 'text-[var(--color-comp-divider-current-symbol)]',
  },
  blue: {
    line: 'bg-gradient-to-r from-transparent via-[var(--color-comp-divider-blue-line)] to-transparent',
    symbol: 'text-[var(--color-comp-divider-blue-symbol)]',
  },
  purple: {
    line: 'bg-gradient-to-r from-transparent via-[var(--color-comp-divider-purple-line)] to-transparent',
    symbol: 'text-[var(--color-comp-divider-purple-symbol)]',
  },
  black: {
    line: 'bg-gradient-to-r from-transparent via-[var(--color-comp-divider-black-line)] to-transparent',
    symbol: 'text-[var(--color-comp-divider-black-symbol)]',
  },
};

const sizeVariants: Record<NonNullable<DividerProps['size']>, { wrapper: string; line: string; symbol: string; icon: string }> = {
  sm: {
    wrapper: 'py-1',
    line: 'h-px',
    symbol: 'text-[10px]',
    icon: 'w-3 h-3',
  },
  md: {
    wrapper: 'py-2',
    line: 'h-px',
    symbol: 'text-xs',
    icon: 'w-4 h-4',
  },
  lg: {
    wrapper: 'py-3',
    line: 'h-[2px]',
    symbol: 'text-sm',
    icon: 'w-5 h-5',
  },
};

export function Divider({
  className = '',
  containerClassName = '',
  tone,
  color,
  size = 'md',
  symbol = '✦',
  iconType,
  backgroundClassName = 'bg-transparent',
}: DividerProps) {
  const resolvedTone = tone ?? color ?? 'current';
  const variant = toneVariants[resolvedTone];
  const sizing = sizeVariants[size];
  const resolvedIconType = iconType || 'default';
  const iconElement = iconMap[resolvedIconType];

  return (
    <div className={`${backgroundClassName} px-4 ${sizing.wrapper} ${containerClassName}`} aria-hidden="true">
      <div className={`mx-auto max-w-6xl flex items-center gap-3 ${className}`}>
        <div className={`${sizing.line} flex-1 ${variant.line}`} />
        {iconType ? (
          <div className={`${variant.symbol} ${sizing.icon} flex items-center justify-center`}>
            {iconElement}
          </div>
        ) : (
          <span className={`${variant.symbol} ${sizing.symbol}`}>{symbol}</span>
        )}
        <div className={`${sizing.line} flex-1 ${variant.line}`} />
      </div>
    </div>
  );
}

