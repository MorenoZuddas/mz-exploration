interface HeroProps {
  title?: string;
  subtitle?: string;
  className?: string;
  containerClassName?: string;
  contentClassName?: string;
  videoMp4Src?: string;
  videoWebmSrc?: string;
  posterSrc?: string;
  useVideo?: boolean;
  showOverlay?: boolean;
  heightClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  overlayClassName?: string;
  contentAlign?: 'center' | 'left' | 'right';
  tone?: 'current' | 'blue' | 'purple' | 'black';
  titleColor?: 'current' | 'blue' | 'purple' | 'black';
  subtitleColor?: 'current' | 'blue' | 'purple' | 'black';
}

const heroAlignVariants = {
  center: {
    wrapper: 'items-center justify-center',
    content: 'text-center',
  },
  left: {
    wrapper: 'items-start justify-center',
    content: 'text-left',
  },
  right: {
    wrapper: 'items-end justify-center',
    content: 'text-right',
  },
} as const;

const heroTitleColorVariants = {
  current: 'text-white',
  blue: 'text-blue-300',
  purple: 'text-violet-300',
  black: 'text-black dark:text-slate-200',
} as const;

const heroSubtitleColorVariants = {
  current: 'text-white/90',
  blue: 'text-blue-200',
  purple: 'text-violet-200',
  black: 'text-black/85 dark:text-slate-300',
} as const;

export function Hero({
  title = 'MZ EXPLORATION',
  subtitle = 'Un mondo oltre la pista e il sentiero.',
  className = '',
  containerClassName = '',
  contentClassName = '',
  videoMp4Src = 'https://res.cloudinary.com/derbnvxif/video/upload/q_auto/f_auto/v1777450410/hero-bg.mp4',
  videoWebmSrc = 'https://res.cloudinary.com/derbnvxif/video/upload/q_auto/f_auto/v1777450410/hero-bg.webm',
  posterSrc = 'https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777467700/cagliar_dallalto_-_stefano_garau_-_shutterstock.com__1_mzsy2n.jpg',
  useVideo = true,
  showOverlay = true,
  heightClassName = 'h-[36vh] sm:h-[40vh]',
  titleClassName = 'text-3xl sm:text-4xl lg:text-5xl',
  subtitleClassName = 'text-base sm:text-lg lg:text-xl',
  overlayClassName = 'bg-black/40',
  contentAlign = 'center',
  tone,
  titleColor = 'current',
  subtitleColor = 'current',
}: HeroProps) {
  const resolvedTitleTone = tone ?? titleColor;
  const resolvedSubtitleTone = tone ?? subtitleColor;
  const alignClass = heroAlignVariants[contentAlign];

  return (
    <section className={`relative w-full ${heightClassName} overflow-hidden ${className}`}>
      {/* Video Background */}
      {useVideo ? (
        <video
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover ${containerClassName}`}
          poster={posterSrc}
        >
          <source src={videoMp4Src} type="video/mp4" />
          <source src={videoWebmSrc} type="video/webm" />
        </video>
      ) : (
        <div
          className={`absolute inset-0 bg-cover bg-center ${containerClassName}`}
          style={{ backgroundImage: `url(${posterSrc})` }}
        />
      )}

      {/* Dark Overlay */}
      {showOverlay ? <div className={`absolute inset-0 ${overlayClassName}`} /> : null}

      {/* Content */}
      <div className={`absolute inset-0 flex flex-col px-4 ${alignClass.wrapper} ${contentClassName}`}>
        <div className={`max-w-2xl ${alignClass.content}`}>
          <h1 className={`${titleClassName} ${heroTitleColorVariants[resolvedTitleTone]} font-bold mb-2`}>{title}</h1>
          <h2 className={`${subtitleClassName} ${heroSubtitleColorVariants[resolvedSubtitleTone]}`}>{subtitle}</h2>
        </div>
      </div>
    </section>
  );
}

