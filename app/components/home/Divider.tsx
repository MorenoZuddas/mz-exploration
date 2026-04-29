interface DividerProps {
  className?: string;
  color?: 'current' | 'blue' | 'purple' | 'black';
  symbol?: string;
}

const colorVariants: Record<NonNullable<DividerProps['color']>, { line: string; symbol: string }> = {
  current: {
    line: 'bg-gradient-to-r from-transparent via-slate-300 to-transparent dark:via-slate-700',
    symbol: 'text-slate-500 dark:text-slate-400',
  },
  blue: {
    line: 'bg-gradient-to-r from-transparent via-blue-600 to-transparent dark:via-blue-500',
    symbol: 'text-blue-600 dark:text-blue-400',
  },
  purple: {
    line: 'bg-gradient-to-r from-transparent via-violet-900 to-transparent dark:via-violet-700',
    symbol: 'text-violet-900 dark:text-violet-400',
  },
  black: {
    line: 'bg-gradient-to-r from-transparent via-black to-transparent dark:via-slate-200',
    symbol: 'text-black dark:text-slate-200',
  },
};

export function Divider({ className = '', color = 'current', symbol = '✦' }: DividerProps) {
  const variant = colorVariants[color];

  return (
    <div className={`bg-white dark:bg-slate-900 px-4 ${className}`} aria-hidden="true">
      <div className="mx-auto max-w-6xl flex items-center gap-3">
        <div className={`h-px flex-1 ${variant.line}`} />
        <span className={`${variant.symbol} text-xs`}>{symbol}</span>
        <div className={`h-px flex-1 ${variant.line}`} />
      </div>
    </div>
  );
}
