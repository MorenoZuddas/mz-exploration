interface DividerProps {
  className?: string;
  containerClassName?: string;
  tone?: 'current' | 'blue' | 'purple' | 'black';
  color?: 'current' | 'blue' | 'purple' | 'black';
  size?: 'sm' | 'md' | 'lg';
  symbol?: string;
  backgroundClassName?: string;
}

const toneVariants: Record<NonNullable<DividerProps['tone']>, { line: string; symbol: string }> = {
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

const sizeVariants: Record<NonNullable<DividerProps['size']>, { wrapper: string; line: string; symbol: string }> = {
  sm: {
    wrapper: 'py-1',
    line: 'h-px',
    symbol: 'text-[10px]',
  },
  md: {
    wrapper: 'py-2',
    line: 'h-px',
    symbol: 'text-xs',
  },
  lg: {
    wrapper: 'py-3',
    line: 'h-[2px]',
    symbol: 'text-sm',
  },
};

export function Divider({
  className = '',
  containerClassName = '',
  tone,
  color,
  size = 'md',
  symbol = '✦',
  backgroundClassName = 'bg-white dark:bg-slate-900',
}: DividerProps) {
  const resolvedTone = tone ?? color ?? 'current';
  const variant = toneVariants[resolvedTone];
  const sizing = sizeVariants[size];

  return (
    <div className={`${backgroundClassName} px-4 ${sizing.wrapper} ${containerClassName}`} aria-hidden="true">
      <div className={`mx-auto max-w-6xl flex items-center gap-3 ${className}`}>
        <div className={`${sizing.line} flex-1 ${variant.line}`} />
        <span className={`${variant.symbol} ${sizing.symbol}`}>{symbol}</span>
        <div className={`${sizing.line} flex-1 ${variant.line}`} />
      </div>
    </div>
  );
}

