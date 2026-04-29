"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';

interface SlideItem {
  id: 'running' | 'trekking' | 'trips';
  title: string;
  subtitle: string;
  description: string;
  href: string;
  imageSrc: string;
  externalHref?: string;
  externalLabel?: string;
}

const slides: SlideItem[] = [
  {
    id: 'running',
    title: 'Running',
    subtitle: 'Road to Marathon',
    description: 'Corse su strada, pista, sterrato, corro ovunque.',
    href: '/exploration/running',
    imageSrc:
      'https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777450410/running_Large_zorzw2.jpg',
  },
  {
    id: 'trekking',
    title: 'Trekking',
    subtitle: 'Natura e pace',
    description: 'Escursioni e percorsi in natura da rivedere con calma.',
    href: '/exploration/trekking',
    imageSrc:
      'https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777450410/trekking_h2lev5.jpg',
  },
  {
    id: 'trips',
    title: 'Trips',
    subtitle: 'Esperienze e cultura',
    description: 'Piccole parti di mondo.',
    href: '/exploration/trips',
    imageSrc:
      'https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777450410/trips_exvdmu.avif',
  },
];

type TextColorVariant = 'current' | 'blue' | 'purple' | 'black';

interface HomeExperienceCarouselProps {
  titleColor?: TextColorVariant;
  subtitleColor?: TextColorVariant;
}

const carouselTitleColorVariants: Record<TextColorVariant, string> = {
  current: 'text-white',
  blue: 'text-blue-300',
  purple: 'text-violet-300',
  black: 'text-black dark:text-slate-200',
};

const carouselSubtitleColorVariants: Record<TextColorVariant, string> = {
  current: 'text-blue-200',
  blue: 'text-blue-200',
  purple: 'text-violet-200',
  black: 'text-black/80 dark:text-slate-300',
};

export function HomeExperienceCarousel({
  titleColor = 'current',
  subtitleColor = 'current',
}: HomeExperienceCarouselProps) {
  const titleColorClass = carouselTitleColorVariants[titleColor];
  const subtitleColorClass = carouselSubtitleColorVariants[subtitleColor];

  return (
    <section className="px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <Carousel opts={{ align: 'start' }} className="w-full">
          <CarouselContent>
            {slides.map((slide) => (
              <CarouselItem key={slide.id} className="basis-full">
                <Card className="relative overflow-hidden border-slate-200 dark:border-slate-700">
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
                        <p className={`text-xs sm:text-sm uppercase tracking-[0.2em] ${subtitleColorClass}`}>
                          {slide.subtitle}
                        </p>
                        <CardHeader className="p-0 pb-1">
                          <CardTitle className={`text-3xl sm:text-4xl ${titleColorClass}`}>{slide.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 space-y-4">
                          <p className="text-white/90 text-sm sm:text-base">{slide.description}</p>
                          <div className="flex flex-wrap gap-3">
                            <Link
                              href={slide.href}
                              className="inline-flex rounded-lg bg-blue-600 px-4 py-2 text-white font-semibold hover:bg-blue-700 transition"
                            >
                              Vai a {slide.title}
                            </Link>
                            {slide.externalHref && slide.externalLabel && (
                              <a
                                href={slide.externalHref}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex rounded-lg bg-white/15 px-4 py-2 text-white font-semibold hover:bg-white/25 transition"
                              >
                                {slide.externalLabel}
                              </a>
                            )}
                          </div>
                        </CardContent>
                      </div>
                    </div>
                  </div>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-2 sm:-left-10" />
          <CarouselNext className="right-2 sm:-right-10" />
        </Carousel>
      </div>
    </section>
  );
}
