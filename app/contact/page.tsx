import type { Metadata } from 'next';
import Link from 'next/link';

import { ContactForm } from '@/components/contact/ContactForm';
import { Icon, SOCIAL_BRAND_COLORS } from '@/components/Icons';
import { PageShell, Text } from '@/components/generic';

export const metadata: Metadata = {
  title: 'Contatti | MZ Exploration',
  description: 'Contatti e ricontatto email su MZ Exploration.',
  alternates: {
    canonical: '/contact',
  },
};

const contactLinks = [
  {
    label: 'Email',
    href: 'mailto:morenozuddas1@gmail.com',
    value: 'morenozuddas1@gmail.com',
    icon: 'mail' as const,
    color: SOCIAL_BRAND_COLORS.email,
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/moreno-zuddas-12321a128/',
    value: 'Moreno Zuddas',
    icon: 'linkedin' as const,
    color: SOCIAL_BRAND_COLORS.linkedin,
  },
  {
    label: 'Instagram',
    href: 'https://www.instagram.com/morenozuddas/?__d=1%3F%2F',
    value: '@morenozuddas',
    icon: 'instagram' as const,
    color: SOCIAL_BRAND_COLORS.instagram,
  },
  {
    label: 'GitHub',
    href: 'https://github.com/MorenoZuddas7',
    value: 'MorenoZuddas7',
    icon: 'github' as const,
    color: SOCIAL_BRAND_COLORS.github,
  },
];

export default function ContactPage() {
  return (
    <PageShell background="sky" className="co-main-1" data-testid="co-main-1">
      <section className="relative w-full h-[34vh] sm:h-[38vh] overflow-hidden co-hero-2" data-testid="co-hero-2">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105 co-hero-background-2"
          style={{
            backgroundImage:
              'url(https://res.cloudinary.com/derbnvxif/image/upload/q_auto/f_auto/v1777966565/CONTACT_ajntod.png)',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20 co-hero-overlay-2" />

        <Link
          href="/"
          className="absolute top-6 left-6 sm:left-10 inline-flex items-center gap-1.5 text-white/75 hover:text-white text-sm font-medium transition z-10 co-back-link-2"
          data-testid="co-back-link-2"
        >
          ← Home
        </Link>

        <div className="absolute inset-0 flex flex-col items-center justify-end px-6 pb-7 sm:px-10 sm:pb-8 co-hero-content-2" data-testid="co-hero-content-2">
          <div className="w-full max-w-2xl space-y-2 mb-5 text-center co-hero-text-2" data-testid="co-hero-text-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight co-title-2" data-testid="co-title-2">
              Contatti
            </h1>
            <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto co-subtitle-2" data-testid="co-subtitle-2">
              Collaborazioni, idee e confronto su running, trekking e sviluppo.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-6xl space-y-8">
          <Text as="p" variant="body" className="mx-auto max-w-3xl text-center text-base text-slate-700 dark:text-slate-300 sm:text-lg">
            Se vuoi collaborare, proporre un progetto o semplicemente fare due chiacchiere, scrivimi pure o usa il form qui sotto.
          </Text>

          <section className="mx-auto w-full max-w-3xl rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-900/60 sm:p-6 space-y-4">
            <div className="space-y-1 text-center">
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Richiedi ricontatto</h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">Compila il form e ti ricontatterò presto.</p>
            </div>
            <ContactForm />
          </section>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      {contactLinks.map((entry) => {
                        const isExternal = /^https?:\/\//.test(entry.href);
                        return (
                          <a
                            key={entry.label}
                            href={entry.href}
                            target={isExternal ? '_blank' : undefined}
                            rel={isExternal ? 'noopener noreferrer' : undefined}
                            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:-translate-y-0.5 hover:shadow-sm dark:border-slate-800 dark:bg-slate-900/60"
                          >
                            <div className="flex items-center gap-2.5">
                              <span
                                className="inline-flex h-9 w-9 items-center justify-center rounded-full border"
                                style={{ color: entry.color, borderColor: entry.color }}
                              >
                                <Icon name={entry.icon} size="sm" aria-hidden="true" />
                              </span>
                              <div>
                                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">{entry.label}</p>
                                <p className="text-sm font-medium text-slate-800 dark:text-slate-100">{entry.value}</p>
                              </div>
                            </div>
                          </a>
                        );
                      })}
                    </div>
        </div>
      </section>
    </PageShell>
  );
}
