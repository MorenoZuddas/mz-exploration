'use client';

import { Music2, BookOpen, Camera, Plane, Mountain, PersonStanding } from 'lucide-react';
import { cloneElement, isValidElement, type ReactNode } from 'react';

export type BadgeChipType = 'running' | 'trekking' | 'trip' | 'books' | 'photo' | 'music';
type BadgeChipSize = 'small' | 'medium' | 'large';
type BadgeChipPosition = 'top-left' | 'top-center' | 'top-right';

interface BadgeChipProps {
  type: BadgeChipType;
  text?: string;
  size?: BadgeChipSize;
  rounded?: boolean;
  floating?: boolean;
  position?: BadgeChipPosition;
  className?: string;
  textClassName?: string;
  icon?: ReactNode;
}

const sizeStyles: Record<BadgeChipSize, { wrapper: string; icon: string }> = {
  small: { wrapper: 'px-2 py-0.5 text-[11px]', icon: 'h-3 w-3' },
  medium: { wrapper: 'px-2.5 py-1 text-xs', icon: 'h-3.5 w-3.5' },
  large: { wrapper: 'px-3 py-1.5 text-sm', icon: 'h-4 w-4' },
};

const floatPositionStyles: Record<BadgeChipPosition, string> = {
  'top-left': 'absolute top-2 left-2',
  'top-center': 'absolute top-2 left-1/2 -translate-x-1/2',
  'top-right': 'absolute top-2 right-2',
};

const chipStyles: Record<BadgeChipType, { wrapper: string; text: string; defaultText: string; icon: ReactNode }> = {
  running: {
    wrapper: 'bg-sky-100',
    text: 'text-sky-800',
    defaultText: 'Running',
    icon: <PersonStanding className="h-3.5 w-3.5" />,
  },
  trekking: {
    wrapper: 'bg-emerald-100',
    text: 'text-emerald-800',
    defaultText: 'Trekking',
    icon: <Mountain className="h-3.5 w-3.5" />,
  },
  trip: {
    wrapper: 'bg-orange-100',
    text: 'text-orange-800',
    defaultText: 'Trip',
    icon: <Plane className="h-3.5 w-3.5" />,
  },
  books: {
    wrapper: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-800 dark:text-slate-200',
    defaultText: 'Books',
    icon: <BookOpen className="h-3.5 w-3.5" />,
  },
  photo: {
    wrapper: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-800 dark:text-slate-200',
    defaultText: 'Photo',
    icon: <Camera className="h-3.5 w-3.5" />,
  },
  music: {
    wrapper: 'bg-slate-100 dark:bg-slate-800',
    text: 'text-slate-800 dark:text-slate-200',
    defaultText: 'Music',
    icon: <Music2 className="h-3.5 w-3.5" />,
  },
};

export function BadgeChip({
  type,
  text,
  size = 'medium',
  rounded = true,
  floating = false,
  position = 'top-right',
  className = '',
  textClassName = '',
  icon,
}: BadgeChipProps) {
  const style = chipStyles[type];
  const sizing = sizeStyles[size];
  const radius = rounded ? 'rounded-full' : 'rounded-md';
  const floatClass = floating ? floatPositionStyles[position] : '';
  const iconNode = icon ?? style.icon;

  const iconWithSize = isValidElement<{ className?: string }>(iconNode)
    ? cloneElement(iconNode, { className: sizing.icon })
    : iconNode;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold ${radius} ${sizing.wrapper} ${floatClass} ${style.wrapper} ${style.text} ${className}`}
    >
      {iconWithSize}
      <span className={textClassName}>{text ?? style.defaultText}</span>
    </span>
  );
}





