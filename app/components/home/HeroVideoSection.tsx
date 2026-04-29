import Link from 'next/link';

export function HeroVideoSection() {
  return (
    <section className="relative w-full h-[50vh] overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        poster="https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777467700/cagliar_dallalto_-_stefano_garau_-_shutterstock.com__1_mzsy2n.jpg"
      >
        <source
          src="https://res.cloudinary.com/derbnvxif/video/upload/q_auto/f_auto/v1777450410/hero-bg.mp4"
          type="video/mp4"
        />
        <source
          src="https://res.cloudinary.com/derbnvxif/video/upload/q_auto/f_auto/v1777450410/hero-bg.webm"
          type="video/webm"
        />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4">
            MZ EXPLORATION
          </h1>
          <h2 className="text-xl sm:text-2xl lg:text-3xl text-white/90 mb-8">
            Un mondo oltre la pista e il sentiero.
          </h2>

        </div>
      </div>
    </section>
  );
}
