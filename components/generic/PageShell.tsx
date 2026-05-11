import type { ElementType, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type PageBackground = 'sky' | 'white' | 'navy';

export const pageBackgroundClasses: Record<PageBackground, string> = {
  sky: 'bg-[image:var(--gradient-page-sky)] text-[var(--color-role-text-primary)]',
  white: 'bg-[image:var(--gradient-page-white)] text-[var(--color-role-text-primary)]',
  navy: 'bg-[image:var(--gradient-page-navy)] text-[var(--color-role-text-inverse)]',
};

interface PageShellProps {
  children: ReactNode;
  className?: string;
  background?: PageBackground;
  as?: ElementType;
  ['data-testid']?: string;
}

export function PageShell({
  children,
  className = '',
  background = 'sky',
  as: Component = 'main',
  'data-testid': dataTestId,
}: PageShellProps) {
  return (
    <Component className={cn('min-h-screen w-full', pageBackgroundClasses[background], className)} data-testid={dataTestId}>
      {children}
    </Component>
  );
}

