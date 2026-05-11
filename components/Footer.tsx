import Link from 'next/link';
import Image from 'next/image';
import type { CSSProperties } from 'react';
import {
  ActivityIcon,
  GithubIcon,
  InstagramIcon,
  LinkedinIcon,
  MailIcon,
  SOCIAL_BRAND_COLORS,
  SOCIAL_LABELS,
  type SocialType,
} from '@/components/Icons';

// ── Social icon types ────────────────────────────────────────────────
type SocialIconType = SocialType;
type SocialIconVariant = 'solid' | 'outline' | 'ghost';
type SocialIconSize = 'sm' | 'md' | 'lg' | 'xl';
type SocialColorScheme = 'light' | 'dark';

export interface FooterNavLink {
  label: string;
  href: string;
}

export interface FooterSocialLink {
  type: SocialIconType;
  href: string;
}

interface FooterProps {
  className?: string;
  backgroundClassName?: string;
  tone?: 'current' | 'blue' | 'purple' | 'black';
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  navLinks?: FooterNavLink[];
  socialLinks?: FooterSocialLink[];
  socialVariant?: SocialIconVariant;
  socialSize?: SocialIconSize;
  copyrightText?: string;
}

const SOCIAL_ICON_SIZES: Record<SocialIconSize, { icon: string; wrapper: string }> = {
  sm: { icon: 'h-4 w-4', wrapper: 'p-1.5' },
  md: { icon: 'h-5 w-5', wrapper: 'p-2' },
  lg: { icon: 'h-6 w-6', wrapper: 'p-2.5' },
  xl: { icon: 'h-8 w-8', wrapper: 'p-3' },
};

function getSocialStyle(variant: SocialIconVariant, color: string, scheme: SocialColorScheme): CSSProperties {
  const resolved = scheme === 'dark' ? '#FFFFFF' : color;
  if (variant === 'solid') {
    return scheme === 'dark'
      ? { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.35)', color: '#FFFFFF' }
      : { backgroundColor: color, borderColor: color, color: '#FFFFFF' };
  }
  if (variant === 'outline') return { backgroundColor: 'transparent', borderColor: resolved, color: resolved };
  return { backgroundColor: 'transparent', borderColor: 'transparent', color: resolved };
}

function SocialIconButton({ type, href, variant, size, scheme }: {
  type: SocialIconType; href: string;
  variant: SocialIconVariant; size: SocialIconSize; scheme: SocialColorScheme;
}) {
  const isExternal = /^https?:\/\//.test(href);
  const s = SOCIAL_ICON_SIZES[size];
  const focusCls = scheme === 'dark'
    ? 'focus-visible:ring-white/60 focus-visible:ring-offset-slate-900'
    : 'focus-visible:ring-slate-400 focus-visible:ring-offset-white';

  const iconEl = type === 'github' ? <GithubIcon className={s.icon} />
    : type === 'linkedin' ? <LinkedinIcon className={s.icon} />
    : type === 'instagram' ? <InstagramIcon className={s.icon} />
    : type === 'email' ? <MailIcon className={s.icon} aria-hidden="true" />
    : <ActivityIcon className={s.icon} aria-hidden="true" />;

  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      aria-label={SOCIAL_LABELS[type]}
      className={`inline-flex items-center justify-center rounded-full border transition-all duration-200 hover:scale-110 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${focusCls} ${s.wrapper}`}
      style={getSocialStyle(variant, SOCIAL_BRAND_COLORS[type], scheme)}
    >
      {iconEl}
    </a>
  );
}

// ── Costanti Footer ───────────────────────────────────────────────────
const footerToneClasses: Record<NonNullable<FooterProps['tone']>, { link: string; separator: string; border: string }> = {
  current: {
    link: 'text-[var(--color-comp-footer-link)] hover:text-[var(--color-comp-footer-link-hover)]',
    separator: 'text-[var(--color-comp-footer-separator)]',
    border: 'border-[var(--color-comp-footer-border)]',
  },
  blue: {
    link: 'text-[var(--color-comp-footer-blue-link)] hover:text-[var(--color-comp-footer-blue-link-hover)]',
    separator: 'text-[var(--color-comp-footer-blue-separator)]',
    border: 'border-[var(--color-comp-footer-blue-border)]',
  },
  purple: {
    link: 'text-[var(--color-comp-footer-purple-link)] hover:text-[var(--color-comp-footer-purple-link-hover)]',
    separator: 'text-[var(--color-comp-footer-purple-separator)]',
    border: 'border-[var(--color-comp-footer-purple-border)]',
  },
  black: {
    link: 'text-[var(--color-comp-footer-black-link)] hover:text-[var(--color-comp-footer-black-link-hover)]',
    separator: 'text-[var(--color-comp-footer-black-separator)]',
    border: 'border-[var(--color-comp-footer-black-border)]',
  },
};

const defaultNavLinks: FooterNavLink[] = [
  { label: 'Chi Sono', href: '/about' },
  { label: 'Exploration', href: '/exploration' },
  { label: 'Contatti', href: '/contact' },
];

const defaultSocialLinks: FooterSocialLink[] = [
    { type: 'email',    href: 'mailto:morenozuddas1@gmail.com' },
    { type: 'github',   href: 'https://github.com/MorenoZuddas7' },
    { type: 'instagram', href: 'https://www.instagram.com/morenozuddas?igsh=bXJpZTU4cWN0MHY=' },
    { type: 'linkedin', href: 'https://www.linkedin.com/in/moreno-zuddas-12321a128/' },
    { type: 'strava',   href: 'https://www.strava.com/athletes/154912379' },
];

// ── Componente Footer ─────────────────────────────────────────────────
export default function Footer({
  className = '',
  backgroundClassName = 'bg-[var(--color-comp-footer-bg)]',
  tone = 'current',
  logoSrc = '/logo/hp-logo.svg',
  logoAlt = 'mz-exploration logo',
  logoWidth = 150,
  logoHeight = 150,
  navLinks = defaultNavLinks,
  socialLinks = defaultSocialLinks,
  socialVariant = 'outline',
  socialSize = 'sm',
  copyrightText = '© 2026 Moreno Zuddas. All rights reserved.',
}: FooterProps) {
  const isLightBg = backgroundClassName.includes('bg-white');
  const socialScheme: SocialColorScheme = isLightBg ? 'light' : 'dark';
  const toneClasses = isLightBg
    ? {
        link: 'text-[var(--color-role-text-primary)] hover:text-[var(--color-role-text-secondary)]',
        separator: 'text-[var(--color-role-text-secondary)]',
        border: 'border-[var(--color-role-border-soft)]',
      }
    : footerToneClasses[tone];
  const rootTextClass = isLightBg
    ? 'text-[var(--color-role-text-primary)]'
    : 'text-[var(--color-comp-footer-text)]';

  return (
    <footer className={`${backgroundClassName} ${rootTextClass} py-3 ${className}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image src={logoSrc} alt={logoAlt} width={logoWidth} height={logoHeight}
              className="opacity-75 w-[90px] h-auto md:w-[150px]" />
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap justify-center gap-3 text-xs md:text-sm">
            {navLinks.map((link, index) => (
              <div key={`${link.href}-${link.label}`} className="flex items-center gap-3">
                <Link href={link.href} className={`${toneClasses.link} transition`}>{link.label}</Link>
                {index < navLinks.length - 1 ? <span className={toneClasses.separator}>•</span> : null}
              </div>
            ))}
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-2 shrink-0">
            {socialLinks.map((link) => (
              <SocialIconButton
                key={`${link.type}-${link.href}`}
                type={link.type}
                href={link.href}
                variant={socialVariant}
                size={socialSize}
                scheme={socialScheme}
              />
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className={`mt-3 pt-3 border-t ${toneClasses.border}`}>
          <p className={`${isLightBg ? 'text-[var(--color-role-text-secondary)]' : 'text-[var(--color-comp-footer-copyright)]'} w-full text-[10px] text-center`}>
            {copyrightText}
          </p>
        </div>
      </div>
    </footer>
  );
}