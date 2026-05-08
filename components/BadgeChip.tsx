'use client';

import { ListMusic, Library, Camera, PlaneTakeoff, Mountain, SportShoe } from 'lucide-react';
import { cloneElement, isValidElement, type ReactNode } from 'react';

export type BadgeChipType = 'running' | 'trekking' | 'trip' | 'books' | 'photo' | 'music';
export type BadgeChipSize = 'small' | 'medium' | 'large';
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
  'data-testid'?: string;
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
    wrapper: 'bg-[var(--color-comp-badge-running-bg)]',
    text: 'text-[var(--color-comp-badge-running-text)]',
    defaultText: 'Running',
    icon: <SportShoe className="h-3.5 w-3.5" strokeWidth={2.25} />,
  },
  trekking: {
    wrapper: 'bg-[var(--color-comp-badge-trekking-bg)]',
    text: 'text-[var(--color-comp-badge-trekking-text)]',
    defaultText: 'Trekking',
    icon: <Mountain className="h-3.5 w-3.5" />,
  },
  trip: {
    wrapper: 'bg-[var(--color-comp-badge-trip-bg)]',
    text: 'text-[var(--color-comp-badge-trip-text)]',
    defaultText: 'Trip',
    icon: <PlaneTakeoff className="h-3.5 w-3.5" />,
  },
  books: {
    wrapper: 'bg-[var(--color-comp-badge-books-bg)]',
    text: 'text-[var(--color-comp-badge-books-text)]',
    defaultText: 'Books',
    icon: <Library className="h-3.5 w-3.5" />,
  },
  photo: {
    wrapper: 'bg-[var(--color-comp-badge-photo-bg)]',
    text: 'text-[var(--color-comp-badge-photo-text)]',
    defaultText: 'Photo',
    icon: <Camera className="h-3.5 w-3.5" />,
  },
  music: {
    wrapper: 'bg-[var(--color-comp-badge-music-bg)]',
    text: 'text-[var(--color-comp-badge-music-text)]',
    defaultText: 'Music',
    icon: <ListMusic className="h-3.5 w-3.5" />,
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
  'data-testid': dataTestId,
}: BadgeChipProps) {
  const style = chipStyles[type];
  const sizing = sizeStyles[size];
  const radius = rounded ? 'rounded-full' : 'rounded-md';
  const floatClass = floating ? floatPositionStyles[position] : '';
  const iconNode = icon ?? style.icon;

  const iconWithSize = isValidElement<{ className?: string }>(iconNode)
    ? cloneElement(iconNode, {
        className: `${iconNode.props.className ?? ''} ${sizing.icon}`.trim(),
      })
    : iconNode;

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold ${radius} ${sizing.wrapper} ${floatClass} ${style.wrapper} ${style.text} ${className}`}
      data-testid={dataTestId}
    >
      {iconWithSize}
      <span className={textClassName}>{text ?? style.defaultText}</span>
    </span>
  );
}





