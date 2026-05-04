import Image from 'next/image';
import Link from 'next/link';
import {
  AnimatedSection,
  CardGrid,
  Divider,
  Hero,
} from '@/components/generic';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CarouselCards } from '@/components/ui/carousel';

interface HomeCarouselItem {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  href: string;
  imageSrc: string;
}

const homeCarouselItems: HomeCarouselItem[] = [
  {
    id: 'running',
    title: 'Running',
    subtitle: 'Road to Marathon',
    description: 'Corse su strada, pista e allenamenti per raccontare progressi, numeri ed emozioni.',
    href: '/exploration/running',
    imageSrc:
      'https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777450410/running_Large_zorzw2.jpg',
  },
  {
    id: 'trekking',
    title: 'Trekking',
    subtitle: 'Natura e dislivello',
    description: 'Escursioni, panorami, salite e percorsi da ricordare con dati, foto e dettagli utili.',
    href: '/exploration/trekking',
    imageSrc:
      'https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777450410/trekking_h2lev5.jpg',
  },
  {
    id: 'trips',
    title: 'Trips',
    subtitle: 'Esperienze e cultura',
    description: 'Una raccolta di viaggi, idee e luoghi che meritano una storia dedicata.',
    href: '/exploration/trips',
    imageSrc:
      'https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777450410/trips_exvdmu.avif',
  },
];

export default function Home() {
  return (
    <main className="w-full homepage-main" data-testid="homepage-main">
      {/* Hero Video Section */}
      <Hero
        title="MZ EXPLORATION"
        subtitle="Un mondo oltre la pista e il sentiero."
        heightClassName="h-[34vh] sm:h-[38vh]"
        titleClassName="text-3xl sm:text-4xl lg:text-5xl"
        subtitleClassName="text-sm sm:text-base lg:text-lg"
        data-testid="hp-hero-1"
      />

      <Divider color="current" size="md" data-testid="hp-divider-2" />

      {/* Carousel Section (Running, Trekking, Trips) */}
      <div id="hp-categories-3" className="bg-white dark:bg-slate-900 scroll-mt-20 hp-categories-3" data-testid="hp-categories-3">
        <AnimatedSection className="px-4 py-8 sm:px-6 lg:px-8 hp-carousel-section-4" data-testid="hp-carousel-section-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-5 hp-section-title-4" data-testid="hp-carousel-title-4">
              Esploriamo assieme
            </h2>
            <CarouselCards
              horizontal
              carouselCard={1}
              gap="md"
              className="w-full hp-carousel-5"
              previousButtonProps={{ className: 'left-2 sm:-left-10', tone: 'blue' }}
              nextButtonProps={{ className: 'right-2 sm:-right-10', tone: 'blue' }}
              data-testid="hp-carousel-5"
            >
              {homeCarouselItems.map((slide) => (
                <Card key={slide.id} className="relative overflow-hidden border-slate-200 dark:border-slate-700 hp-carousel-item-6" data-testid={`hp-carousel-item-${slide.id}-6`}>
                  <div className="relative h-[23rem] sm:h-[26rem] w-full hp-carousel-image-wrapper-6">
                    <Image
                      src={slide.imageSrc}
                      alt={slide.title}
                      fill
                      className="object-cover hp-carousel-image-6"
                      sizes="(max-width: 768px) 100vw, 980px"
                      priority={slide.id === 'running'}
                      data-testid={`hp-carousel-image-${slide.id}-6`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/25 hp-carousel-overlay-6" />

                    <div className="absolute inset-0 flex items-end p-6 sm:p-8 hp-carousel-content-6">
                      <div className="max-w-xl text-white space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-blue-200 sm:text-sm hp-carousel-subtitle-6" data-testid={`hp-carousel-subtitle-${slide.id}-6`}>
                          {slide.subtitle}
                        </p>
                        <CardHeader className="p-0 pb-1">
                          <CardTitle className="text-3xl text-white sm:text-4xl hp-carousel-title-6" data-testid={`hp-carousel-title-${slide.id}-6`}>
                            {slide.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-0">
                          <p className="text-sm text-white/90 sm:text-base hp-carousel-description-6" data-testid={`hp-carousel-description-${slide.id}-6`}>{slide.description}</p>
                          <Button asChild tone="white" size="lg" radius="lg" className="hp-carousel-button-6">
                            <Link href={slide.href} data-testid={`hp-carousel-link-${slide.id}-6`}>Vai a {slide.title}</Link>
                          </Button>
                        </CardContent>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </CarouselCards>
          </div>
        </AnimatedSection>
      </div>

      <Divider color="blue" size="sm" data-testid="hp-divider-7" />

      {/* Latest Adventures Section */}
      <CardGrid
        sectionClassName="px-4 py-8 sm:px-6 lg:px-8 bg-white dark:bg-slate-900"
        titleColor="current"
        subtitleColor="current"
        data-testid="hp-latest-adventures-8"
      />

      <Divider color="purple" size="sm" data-testid="hp-divider-9" />

      {/* Coming Soon Section */}
      <AnimatedSection className="px-4 py-10 sm:px-6 lg:px-8 bg-white dark:bg-slate-900 hp-coming-soon-10" data-testid="hp-coming-soon-10">
        <div className="max-w-4xl mx-auto rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-6 text-center hp-coming-soon-box-10" data-testid="hp-coming-soon-box-10">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400 hp-coming-soon-label-10" data-testid="hp-coming-soon-label-10">
            Coming Soon
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white hp-coming-soon-title-10" data-testid="hp-coming-soon-title-10">
            Sezione Libri, Foto, Musica
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300 hp-coming-soon-description-10" data-testid="hp-coming-soon-description-10">
            Una raccolta che raconta mindset, performance e avventura attraverso diverse forme di media.
          </p>
        </div>
      </AnimatedSection>
    </main>
  );
}