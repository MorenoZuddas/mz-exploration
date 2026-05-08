type LoaderTone = 'current' | 'blue' | 'purple' | 'black';
type LoaderSize = 'sm' | 'md' | 'lg';

interface LoaderProps {
  className?: string;
  title?: string;
  subtitle?: string;
  tone?: LoaderTone;
  size?: LoaderSize;
}

const loaderToneClasses: Record<LoaderTone, { primary: string; secondary: string }> = {
  current: { primary: '[border-top-color:var(--color-comp-loader-current-border)] [border-right-color:var(--color-comp-loader-current-border)]', secondary: '[border-bottom-color:var(--color-comp-loader-current-border-inner)]' },
  blue:    { primary: '[border-top-color:var(--color-comp-loader-blue-border)] [border-right-color:var(--color-comp-loader-blue-border)]', secondary: '[border-bottom-color:var(--color-comp-loader-blue-border-inner)]' },
  purple:  { primary: '[border-top-color:var(--color-comp-loader-purple-border)] [border-right-color:var(--color-comp-loader-purple-border)]', secondary: '[border-bottom-color:var(--color-comp-loader-purple-border-inner)]' },
  black:   { primary: '[border-top-color:var(--color-comp-loader-black-border)] [border-right-color:var(--color-comp-loader-black-border)]', secondary: '[border-bottom-color:var(--color-comp-loader-black-border-inner)]' },
};

const loaderSizeClasses: Record<LoaderSize, { wrapper: string; inner: string; title: string; subtitle: string }> = {
  sm: { wrapper: 'w-12 h-12', inner: 'inset-1.5', title: 'text-base', subtitle: 'text-xs' },
  md: { wrapper: 'w-16 h-16', inner: 'inset-2', title: 'text-lg', subtitle: 'text-sm' },
  lg: { wrapper: 'w-20 h-20', inner: 'inset-3', title: 'text-xl', subtitle: 'text-base' },
};

export default function Loader({
  className = '',
  title = 'Caricamento...',
  subtitle = 'Preparando la pagina per te',
  tone = 'current',
  size = 'md',
}: LoaderProps) {
  const toneClass = loaderToneClasses[tone];
  const sizeClass = loaderSizeClasses[size];

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[var(--color-comp-loader-overlay)] backdrop-blur-sm ${className}`}>
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className={`relative ${sizeClass.wrapper}`}>
          <div className={`absolute inset-0 border-4 border-transparent ${toneClass.primary} rounded-full animate-spin`} />
          <div className={`absolute ${sizeClass.inner} border-4 border-transparent ${toneClass.secondary} rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>

        {/* Text */}
        <p className={`text-[var(--color-comp-loader-title)] font-semibold ${sizeClass.title}`}>
          {title}
        </p>
        <p className={`text-[var(--color-comp-loader-subtitle)] ${sizeClass.subtitle}`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

