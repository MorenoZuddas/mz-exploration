interface HeroProps {
  title?: string;
  subtitle?: string;
  videoMp4Src?: string;
  videoWebmSrc?: string;
  posterSrc?: string;
  heightClassName?: string;
  titleClassName?: string;
  subtitleClassName?: string;
  overlayClassName?: string;
  titleColor?: 'current' | 'blue' | 'purple' | 'black';
  subtitleColor?: 'current' | 'blue' | 'purple' | 'black';
}

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
  videoMp4Src = 'https://res.cloudinary.com/derbnvxif/video/upload/q_auto/f_auto/v1777450410/hero-bg.mp4',
  videoWebmSrc = 'https://res.cloudinary.com/derbnvxif/video/upload/q_auto/f_auto/v1777450410/hero-bg.webm',
  posterSrc = 'https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777467700/cagliar_dallalto_-_stefano_garau_-_shutterstock.com__1_mzsy2n.jpg',
  heightClassName = 'h-[36vh] sm:h-[40vh]',
  titleClassName = 'text-3xl sm:text-4xl lg:text-5xl',
  subtitleClassName = 'text-base sm:text-lg lg:text-xl',
  overlayClassName = 'bg-black/40',
  titleColor = 'current',
  subtitleColor = 'current',
}: HeroProps) {
  return (
    <section className={`relative w-full ${heightClassName} overflow-hidden`}>
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster={posterSrc}
      >
        <source src={videoMp4Src} type="video/mp4" />
        <source src={videoWebmSrc} type="video/webm" />
      </video>

      {/* Dark Overlay */}
      <div className={`absolute inset-0 ${overlayClassName}`} />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <h1 className={`${titleClassName} ${heroTitleColorVariants[titleColor]} font-bold mb-2`}>{title}</h1>
          <h2 className={`${subtitleClassName} ${heroSubtitleColorVariants[subtitleColor]}`}>{subtitle}</h2>
        </div>
      </div>
    </section>
  );
}
