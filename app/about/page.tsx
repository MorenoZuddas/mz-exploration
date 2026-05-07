import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Code2,
  ExternalLink,
  Mail,
  Smartphone,
  type LucideIcon,
} from 'lucide-react';

import { AnimatedSection, PageShell } from '@/components/generic';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stripe } from '@/components/Stripe';

import aboutJson from './data/about.json';
import type { AboutContentData, AboutIconName } from './data/types';

const about = aboutJson as AboutContentData;

const iconMap: Record<AboutIconName, LucideIcon> = {
  Code2,
  Smartphone,
  Mail,
  Github: Code2,
  Linkedin: Smartphone,
  ExternalLink,
};

function resolveIcon(name: AboutIconName): LucideIcon {
  return iconMap[name] ?? ExternalLink;
}

export const metadata: Metadata = {
  title: 'Chi Sono | MZ Exploration',
  description:
    'Sviluppatore web/mobile orientato a prodotti digitali utili e accessibili: visione, competenze, passioni e contatti.',
  keywords: ['chi sono', 'sviluppatore web', 'sviluppatore mobile', 'next.js', 'portfolio'],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'Chi Sono | MZ Exploration',
    description:
      'Visione personale, background tecnico e passioni che guidano il progetto MZ Exploration.',
    url: '/about',
    type: 'profile',
  },
};

export default function AboutPage() {
  const personJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Moreno Zuddas',
    jobTitle: 'Web/Mobile Developer',
    url: '/about',
    sameAs: about.contacts.filter((contact) => !contact.href.startsWith('mailto:')).map((contact) => contact.href),
  };

  return (
    <PageShell background="white" className="about-main-4" data-testid="about-main-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />

      <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
        <Stripe
          imageSrc={about.hero.imageSrc}
          imageAlt={about.hero.imageAlt}
          imagePosition="left"
          imageSize="md"
          title={about.hero.headline}
          subtitle={about.hero.tagline}
          buttons={{
            label: about.hero.ctaLabel,
            href: about.hero.ctaHref,
            tone: 'black',
          }}
          background="white"
          className="about-hero-stripe"
          data-testid="about-hero-section"
        />

        <div className="my-8 h-px bg-slate-200 dark:bg-slate-800/90" aria-hidden="true" />

        <AnimatedSection className="about-mission-4" delay={0.05}>
          <section data-testid="about-mission-section">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">{about.mission.title}</h2>
            <div className="mt-4 space-y-3 sm:space-y-4">
              {about.mission.paragraphs.map((paragraph) => (
                <p key={paragraph} className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 sm:text-base">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        </AnimatedSection>

        <div className="my-8 h-px bg-slate-200 dark:bg-slate-800/90" aria-hidden="true" />

        <AnimatedSection className="about-skills-4" delay={0.1}>
          <section data-testid="about-skills-section">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">Competenze e Background</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {about.skills.map((skill) => {
                const Icon = resolveIcon(skill.icon);
                return (
                  <Card
                    key={`${skill.category}-${skill.name}`}
                    className="h-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        <span>{skill.category}</span>
                      </div>
                      <CardTitle className="text-lg text-slate-900 dark:text-slate-100">{skill.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{skill.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </AnimatedSection>

        <div className="my-8 h-px bg-slate-200 dark:bg-slate-800/90" aria-hidden="true" />

        <AnimatedSection className="about-passions-4" delay={0.15}>
          <section data-testid="about-passions-section">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">Cosa mi muove</h2>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {about.passions.map((passion) => {
                const Icon = resolveIcon(passion.icon);
                return (
                  <Card
                    key={passion.title}
                    className="h-full border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 transition-all duration-300 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base text-slate-900 dark:text-slate-100 sm:text-lg">
                        <Icon className="h-4 w-4 text-slate-500 dark:text-slate-400" aria-hidden="true" />
                        {passion.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{passion.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </section>
        </AnimatedSection>

        <div className="my-8 h-px bg-slate-200 dark:bg-slate-800/90" aria-hidden="true" />

        <AnimatedSection className="about-cta-4" delay={0.2}>
          <section className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 p-6 sm:p-8" data-testid="about-cta-section">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">Vuoi collaborare?</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base">
              Se vuoi confrontarti su una collaborazione, un prodotto o una nuova idea, puoi trovarmi qui.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {about.contacts.map((contact) => {
                const Icon = resolveIcon(contact.icon);
                const isExternal = !contact.href.startsWith('/');

                return (
                  <Link
                    key={contact.label}
                    href={contact.href}
                    target={isExternal && !contact.href.startsWith('mailto:') ? '_blank' : undefined}
                    rel={isExternal && !contact.href.startsWith('mailto:') ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center gap-1.5 rounded-lg border-2 border-slate-900 bg-transparent px-4 py-2 text-sm font-medium text-slate-900 transition-all duration-200 hover:scale-[1.02] hover:shadow-lg dark:border-white dark:text-white"
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    {contact.label}
                  </Link>
                );
              })}
            </div>
          </section>
        </AnimatedSection>
      </div>
    </PageShell>
  );
}

