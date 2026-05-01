import type { ElementType, ReactNode } from 'react';

type TextTone = 'current' | 'blue' | 'purple' | 'black' | 'navy' | 'white';
type TextSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
type TextWeight = 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
type TextAlign = 'left' | 'center' | 'right' | 'justify';
type TextPosition = 'left' | 'center' | 'right';
type TextVariant = 'title' | 'subtitle' | 'body' | 'caption' | 'overline';

interface TextProps {
  children: ReactNode;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'p' | 'span' | 'div';
  tag?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5';
  variant?: TextVariant;
  tone?: TextTone;
  size?: TextSize;
  weight?: TextWeight;
  align?: TextAlign;
  position?: TextPosition;
  className?: string;
}

const variantClasses: Record<TextVariant, string> = {
  title: 'text-3xl font-bold leading-tight',
  subtitle: 'text-xl font-semibold leading-snug',
  body: 'text-base font-normal leading-relaxed',
  caption: 'text-sm font-medium leading-normal',
  overline: 'text-xs font-semibold uppercase tracking-widest leading-none',
};

const toneClasses: Record<TextTone, string> = {
  current: 'text-slate-900 dark:text-white',
  blue: 'text-blue-700 dark:text-blue-300',
  purple: 'text-violet-700 dark:text-violet-300',
  black: 'text-black dark:text-slate-100',
  navy: 'text-slate-900 dark:text-slate-100',
  white: 'text-white',
};

const sizeClasses: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
};

const weightClasses: Record<TextWeight, string> = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
};

const alignClasses: Record<TextAlign, string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

const positionClasses: Record<TextPosition, string> = {
  left: 'self-start',
  center: 'self-center',
  right: 'self-end',
};

export function Text({
  children,
  as,
  tag,
  variant = 'body',
  tone = 'current',
  size,
  weight,
  align = 'left',
  position = 'left',
  className = '',
}: TextProps) {
  const Comp = (tag ?? as ?? 'p') as ElementType;

  return (
    <Comp
      className={[
        variantClasses[variant],
        toneClasses[tone],
        size ? sizeClasses[size] : '',
        weight ? weightClasses[weight] : '',
        alignClasses[align],
        positionClasses[position],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </Comp>
  );
}

