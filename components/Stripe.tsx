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
  imageKind?: 'pic-portrait' | 'landscape';
  imagePosition?: 'left' | 'right';
  imageSize?: 'sm' | 'md' | 'lg';
  portraitObjectPosition?: string;

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
  ['data-testid']?: string;
}

const bgVariants = {
  white: {
    container: 'bg-[var(--color-comp-stripe-white-bg)]',
    border: 'border border-[var(--color-comp-stripe-white-border)]',
    borderGradient: 'dark:shadow-[inset_0_0_20px_rgba(51,65,85,0.3)]',
    textTitle: 'text-[var(--color-comp-stripe-white-title)]',
    textMuted: 'text-[var(--color-comp-stripe-white-text)]',
    imageBorder: 'border-[var(--color-comp-stripe-white-image-border)]',
    imageBg: 'bg-[var(--color-comp-stripe-white-image-bg)]',
  },
  navy: {
    container: 'bg-[var(--color-comp-stripe-navy-bg)]',
    border: 'border border-[var(--color-comp-stripe-navy-border)]',
    borderGradient: 'shadow-[inset_0_0_20px_rgba(255,255,255,0.05)]',
    textTitle: 'text-[var(--color-comp-stripe-navy-title)]',
    textMuted: 'text-[var(--color-comp-stripe-navy-text)]',
    imageBorder: 'border-[var(--color-comp-stripe-navy-image-border)]',
    imageBg: 'bg-[var(--color-comp-stripe-navy-image-bg)]',
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
  imageKind = 'pic-portrait',
  imagePosition,
  imageSize = 'md',
  portraitObjectPosition = '50% 18%',
  title,
  subtitle,
  text,
  buttons,
  background = 'white',
  className = '',
  animated = true,
  animationDelay = 0,
  'data-testid': dataTestId = 'stripe-component',
}: StripeProps) {
  const bgStyle = bgVariants[background];
  const imageSizeClass = imageSizeVariants[imageSize];
  const resolvedImagePosition = imagePosition ?? (imageKind === 'landscape' ? 'right' : 'left');
  const isLandscape = imageKind === 'landscape';

  // Normalizza buttons a un array
  const buttonsList = buttons
    ? Array.isArray(buttons)
      ? buttons
      : [buttons]
    : [];

  const portraitImageEl = (
    <div
      className={cn(
        'relative shrink-0 overflow-hidden rounded-full border-2',
        imageSizeClass,
        bgStyle.imageBorder,
        bgStyle.imageBg
      )}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes={imageSize === 'sm' ? '80px' : imageSize === 'md' ? '112px' : '144px'}
        className="object-cover"
        style={{ objectPosition: portraitObjectPosition }}
        priority
      />
    </div>
  );

  const landscapeImageEl = (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border shrink-0 w-full aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5]',
        bgStyle.imageBorder,
        bgStyle.imageBg
      )}
    >
      <Image
        src={imageSrc}
        alt={imageAlt}
        fill
        sizes="(min-width: 1024px) 35vw, 100vw"
        className="object-cover object-center"
        priority
      />
    </div>
  );

  const contentEl = (
    <div className={cn('space-y-1.5 sm:space-y-2', isLandscape ? 'w-full' : 'flex-1')}>
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
        isLandscape
          ? cn(
              'grid gap-4 sm:gap-6 md:items-stretch',
              resolvedImagePosition === 'right' ? 'md:grid-cols-[1fr_35%]' : 'md:grid-cols-[35%_1fr]'
            )
          : 'flex flex-col gap-4 sm:gap-6 md:items-center md:justify-between',
        !isLandscape && resolvedImagePosition === 'right' && 'md:flex-row-reverse',
        !isLandscape && resolvedImagePosition === 'left' && 'md:flex-row',
        className
      )}
      data-testid={dataTestId}
    >
      {isLandscape && resolvedImagePosition === 'right' ? (
        <>
          {contentEl}
          <div className="h-full">{landscapeImageEl}</div>
        </>
      ) : (
        <>
          <div>{isLandscape ? landscapeImageEl : portraitImageEl}</div>
          {contentEl}
        </>
      )}
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


