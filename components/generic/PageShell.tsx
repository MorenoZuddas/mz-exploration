import type { ElementType, ReactNode } from 'react';

import { cn } from '@/lib/utils';

export type PageBackground = 'sky' | 'white' | 'navy';

export const pageBackgroundClasses: Record<PageBackground, string> = {
  sky: 'bg-sky-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100',
  white: 'bg-white text-slate-900 dark:bg-slate-900 dark:text-slate-100',
  navy: 'bg-slate-900 text-slate-100 dark:bg-slate-950 dark:text-slate-100',
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

