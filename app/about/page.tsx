import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Activity,
  Code2,
  Cpu,
  ExternalLink,
  Lightbulb,
  Mail,
  Plane,
  Puzzle,
  Smartphone,
  Users,
  type LucideIcon,
} from 'lucide-react';

import { AnimatedSection, PageShell } from '@/components/generic';
import { Card, CardContent, CardHeader, CardTitle, type CardTone } from '@/components/ui/card';
import { Stripe } from '@/components/Stripe';

import aboutJson from './data/about.json';
import type { AboutContentData, AboutIconName } from './data/types';

const about = aboutJson as AboutContentData;

const iconMap: Record<AboutIconName, LucideIcon> = {
  Activity,
  Code2,
  Cpu,
  Smartphone,
  Lightbulb,
  Mail,
  Plane,
  Puzzle,
  Users,
  Github: Code2,
  Linkedin: Smartphone,
  ExternalLink,
};

const skillCardColors: CardTone[] = ['blue', 'purple', 'navy', 'crimson', 'pear', 'current'];
const passionCardColors: CardTone[] = ['navy', 'crimson', 'pear', 'blue'];

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
          imagePosition="right"
          imageSize="lg"
          imageKind="pic-portrait"
          title={about.hero.headline}
          subtitle={about.hero.tagline}
          buttons={{
            label: about.hero.ctaLabel,
            href: about.hero.ctaHref,
            tone: 'white',
          }}
          background="navy"
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
              {about.skills.map((skill, index) => {
                const Icon = resolveIcon(skill.icon);
                const backgroundColor = skillCardColors[index % skillCardColors.length];
                return (
                  <Card
                    key={`${skill.category}-${skill.name}`}
                    tone={backgroundColor}
                    className="h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-2 text-xs uppercase tracking-wide opacity-80">
                        <Icon className="h-4 w-4" aria-hidden="true" />
                        <span>{skill.category}</span>
                      </div>
                      <CardTitle className="text-lg">{skill.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed opacity-90">{skill.description}</p>
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
              {about.passions.map((passion, index) => {
                const Icon = resolveIcon(passion.icon);
                const backgroundColor = passionCardColors[index % passionCardColors.length];
                return (
                  <Card
                    key={passion.title}
                    tone={backgroundColor}
                    className="h-full transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                        <Icon className="h-4 w-4 opacity-80" aria-hidden="true" />
                        {passion.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm leading-relaxed opacity-90">{passion.description}</p>
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

