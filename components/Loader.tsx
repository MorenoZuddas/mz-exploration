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
  current: { primary: 'border-t-blue-600 border-r-blue-600', secondary: 'border-b-blue-400' },
  blue: { primary: 'border-t-blue-600 border-r-blue-600', secondary: 'border-b-blue-400' },
  purple: { primary: 'border-t-violet-700 border-r-violet-700', secondary: 'border-b-violet-400' },
  black: { primary: 'border-t-slate-900 border-r-slate-900 dark:border-t-slate-100 dark:border-r-slate-100', secondary: 'border-b-slate-500 dark:border-b-slate-300' },
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
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm ${className}`}>
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className={`relative ${sizeClass.wrapper}`}>
          <div className={`absolute inset-0 border-4 border-transparent ${toneClass.primary} rounded-full animate-spin`} />
          <div className={`absolute ${sizeClass.inner} border-4 border-transparent ${toneClass.secondary} rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>

        {/* Text */}
        <p className={`text-slate-900 dark:text-white font-semibold ${sizeClass.title}`}>
          {title}
        </p>
        <p className={`text-slate-500 dark:text-slate-400 ${sizeClass.subtitle}`}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

