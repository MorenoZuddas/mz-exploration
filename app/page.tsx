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
    <main className="w-full">
      {/* Hero Video Section */}
      <Hero
        title="MZ EXPLORATION"
        subtitle="Un mondo oltre la pista e il sentiero."
        heightClassName="h-[34vh] sm:h-[38vh]"
        titleClassName="text-3xl sm:text-4xl lg:text-5xl"
        subtitleClassName="text-sm sm:text-base lg:text-lg"
      />

      <Divider color="current" size="md" />

      {/* Carousel Section (Running, Trekking, Trips) */}
      <div id="categories" className="bg-white dark:bg-slate-900 scroll-mt-20">
        <AnimatedSection className="px-4 py-8 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-5">
              Esploriamo assieme
            </h2>
            <CarouselCards
              horizontal
              carouselCard={1}
              gap="md"
              className="w-full"
              previousButtonProps={{ className: 'left-2 sm:-left-10', tone: 'blue' }}
              nextButtonProps={{ className: 'right-2 sm:-right-10', tone: 'blue' }}
            >
              {homeCarouselItems.map((slide) => (
                <Card key={slide.id} className="relative overflow-hidden border-slate-200 dark:border-slate-700">
                  <div className="relative h-[23rem] sm:h-[26rem] w-full">
                    <Image
                      src={slide.imageSrc}
                      alt={slide.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 980px"
                      priority={slide.id === 'running'}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/25" />

                    <div className="absolute inset-0 flex items-end p-6 sm:p-8">
                      <div className="max-w-xl text-white space-y-2">
                        <p className="text-xs uppercase tracking-[0.2em] text-blue-200 sm:text-sm">
                          {slide.subtitle}
                        </p>
                        <CardHeader className="p-0 pb-1">
                          <CardTitle className="text-3xl text-white sm:text-4xl">
                            {slide.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 p-0">
                          <p className="text-sm text-white/90 sm:text-base">{slide.description}</p>
                          <Button asChild tone="white" size="lg" radius="lg">
                            <Link href={slide.href}>Vai a {slide.title}</Link>
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

      <Divider color="blue" size="sm" />

      {/* Latest Adventures Section */}
      <CardGrid
        sectionClassName="px-4 py-8 sm:px-6 lg:px-8 bg-white dark:bg-slate-900"
        titleColor="current"
        subtitleColor="current"
      />

      <Divider color="purple" size="sm" />

      {/* Coming Soon Section */}
      <AnimatedSection className="px-4 py-10 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto rounded-xl border border-dashed border-slate-300 dark:border-slate-600 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-6 text-center">
          <p className="text-xs font-semibold tracking-[0.2em] uppercase text-slate-500 dark:text-slate-400">
            Coming Soon
          </p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">
            Sezione Libri, Foto, Musica
          </h2>
          <p className="mt-3 text-slate-600 dark:text-slate-300">
            Una raccolta che raconta mindset, performance e avventura attraverso diverse forme di media.
          </p>
        </div>
      </AnimatedSection>
    </main>
  );
}