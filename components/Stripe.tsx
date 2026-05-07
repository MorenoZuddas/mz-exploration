'use client';

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AnimatedSection } from '@/components/generic';

export interface StripeButton {
  label: string;
  href: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link';
  tone?: 'black' | 'white' | 'blue' | 'purple' | 'current' | 'navy';
}

export interface StripeProps {
  // Image
  imageSrc: string;
  imageAlt: string;
  imagePosition?: 'left' | 'right';
  imageSize?: 'sm' | 'md' | 'lg';

  // Content
  title: string;
  subtitle?: string;
  text?: string;

  // Buttons (1 o 2)
  buttons?: StripeButton | StripeButton[];

  // Style
  background?: 'white' | 'navy';
  className?: string;
  animated?: boolean;
  animationDelay?: number;
}

const bgVariants = {
  white: {
    container: 'bg-white dark:bg-slate-900',
    border: 'border border-slate-200 dark:border-slate-800',
    borderGradient: 'dark:shadow-[inset_0_0_20px_rgba(51,65,85,0.3)]',
    textTitle: 'text-slate-900 dark:text-slate-100',
    textMuted: 'text-slate-600 dark:text-slate-300',
  },
  navy: {
    container: 'bg-slate-900 dark:bg-slate-950',
    border: 'border border-slate-800 dark:border-slate-700',
    borderGradient: 'shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]',
    textTitle: 'text-slate-100 dark:text-white',
    textMuted: 'text-slate-300 dark:text-slate-400',
  },
};

const imageSizeVariants = {
  sm: 'h-16 w-16 sm:h-20 sm:w-20',
  md: 'h-20 w-20 sm:h-28 sm:w-28',
  lg: 'h-28 w-28 sm:h-36 sm:w-36',
};

export function Stripe({
  imageSrc,
  imageAlt,
  imagePosition = 'left',
  imageSize = 'md',
  title,
  subtitle,
  text,
  buttons,
  background = 'white',
  className = '',
  animated = true,
  animationDelay = 0,
}: StripeProps) {
  const bgStyle = bgVariants[background];
  const imageSizeClass = imageSizeVariants[imageSize];

  // Normalizza buttons a un array
  const buttonsList = buttons
    ? Array.isArray(buttons)
      ? buttons
      : [buttons]
    : [];

  const imageEl = (
    <div className={cn(
      'relative shrink-0 overflow-hidden rounded-full border-2',
      imageSizeClass,
      background === 'white'
        ? 'border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800'
        : 'border-slate-700 dark:border-slate-600 bg-slate-800 dark:bg-slate-900'
    )}>
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes={imageSize === 'sm' ? '80px' : imageSize === 'md' ? '112px' : '144px'}
        className="object-cover object-center"
        priority
      />
    </div>
  );

  const contentEl = (
    <div className="flex-1 space-y-1.5 sm:space-y-2">
      <h2 className={cn('text-xl font-bold leading-tight sm:text-2xl lg:text-3xl', bgStyle.textTitle)}>
        {title}
      </h2>
      {subtitle && (
        <p className={cn('text-sm sm:text-base font-medium', bgStyle.textMuted)}>
          {subtitle}
        </p>
      )}
      {text && (
        <p className={cn('text-sm sm:text-base leading-relaxed', bgStyle.textMuted)}>
          {text}
        </p>
      )}

      {buttonsList.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2 sm:pt-3">
          {buttonsList.map((btn, idx) => (
            <Button
              key={idx}
              asChild
              variant={btn.variant || 'default'}
              tone={btn.tone || (background === 'white' ? 'black' : 'white')}
              size="lg"
              className="hover:scale-[1.02] hover:shadow-lg transition-transform"
            >
              <Link href={btn.href}>{btn.label}</Link>
            </Button>
          ))}
        </div>
      )}
    </div>
  );

  const content = (
    <section
      className={cn(
        'rounded-2xl',
        bgStyle.container,
        bgStyle.border,
        bgStyle.borderGradient,
        'p-5 sm:p-6 lg:p-8 transition-colors duration-300',
        'flex flex-col gap-4 sm:gap-6',
        imagePosition === 'right' && 'md:flex-row-reverse',
        imagePosition === 'left' && 'md:flex-row',
        'md:items-center md:justify-between',
        className
      )}
      data-testid="stripe-component"
    >
      {imageEl}
      {contentEl}
    </section>
  );

  return animated ? (
    <AnimatedSection delay={animationDelay}>
      {content}
    </AnimatedSection>
  ) : (
    content
  );
}


