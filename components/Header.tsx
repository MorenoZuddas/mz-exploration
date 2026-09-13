'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ChevronDownIcon,
  MountainIcon,
  PlaneTakeoffIcon,
  SportShoeIcon,
  type LucideIcon,
} from '@/components/Icons';

export interface HeaderNavLink {
  label: React.ReactNode;
  href: string;
}

interface HeaderExplorationItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface HeaderProps {
  className?: string;
  backgroundClassName?: string;
  tone?: 'current' | 'blue' | 'purple' | 'black';
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  aboutLink?: HeaderNavLink;
  contactLink?: HeaderNavLink;
  explorationLink?: HeaderNavLink;
  explorationItems?: HeaderExplorationItem[];
}

const headerToneClasses: Record<NonNullable<HeaderProps['tone']>, { link: string; hoverBg: string; border: string }> = {
  current: {
    link: 'hover:text-[var(--color-comp-header-link-hover)]',
    hoverBg: 'hover:bg-[var(--color-comp-header-hover-bg)]',
    border: 'border-[var(--color-comp-header-border)]',
  },
  blue: {
    link:    'hover:text-[var(--color-comp-header-blue-link-hover)]',
    hoverBg: 'hover:bg-[var(--color-comp-header-blue-hover-bg)]',
    border:  'border-[var(--color-comp-header-blue-border)]',
  },
  purple: {
    link:    'hover:text-[var(--color-comp-header-purple-link-hover)]',
    hoverBg: 'hover:bg-[var(--color-comp-header-purple-hover-bg)]',
    border:  'border-[var(--color-comp-header-purple-border)]',
  },
  black: {
    link:    'hover:text-[var(--color-comp-header-black-link-hover)]',
    hoverBg: 'hover:bg-[var(--color-comp-header-black-hover-bg)]',
    border:  'border-[var(--color-comp-header-black-border)]',
  },
};

const defaultAboutLink: HeaderNavLink = { label: 'Chi Sono', href: '/about' };
const defaultContactLink: HeaderNavLink = { label: 'Contatti', href: '/contact' };
const defaultExplorationLink: HeaderNavLink = { label: 'Exploration', href: '/exploration' };
const defaultExplorationItems: HeaderExplorationItem[] = [
  { label: 'Running', href: '/exploration/running', icon: SportShoeIcon },
  { label: 'Trekking', href: '/exploration/trekking', icon: MountainIcon },
  { label: 'Trips', href: '/exploration/trips', icon: PlaneTakeoffIcon },
];

export default function Header({
  className = '',
  backgroundClassName = 'bg-[var(--color-comp-header-bg)]',
  tone = 'current',
  logoSrc = '/logo/hp-logo.svg',
  logoAlt = 'mz-exploration logo',
  logoWidth = 160,
  logoHeight = 138,
  aboutLink = defaultAboutLink,
  contactLink = defaultContactLink,
  explorationLink = defaultExplorationLink,
  explorationItems = defaultExplorationItems,
}: HeaderProps) {
  const isLightBg = backgroundClassName.includes('bg-white');
  const toneClasses = isLightBg
    ? {
        link: 'text-[var(--color-role-text-primary)] hover:text-[var(--color-role-text-secondary)]',
        hoverBg: 'hover:bg-[var(--color-role-surface-muted)]',
        border: 'border-[var(--color-role-border-soft)]',
      }
    : headerToneClasses[tone];
  const rootTextClass = isLightBg ? 'text-[var(--color-role-text-primary)]' : 'text-[var(--color-comp-header-text)]';
  const explorationTextColumnWidth = '5.75rem';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExplorationOpen, setIsExplorationOpen] = useState(false);

  const toggleMenu = () => {
    const opening = !isMenuOpen;
    setIsMenuOpen(opening);
    if (opening) setIsExplorationOpen(true);
  };

  const toggleExploration = () => {
    setIsExplorationOpen(!isExplorationOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsExplorationOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 ${rootTextClass} shadow-lg ${backgroundClassName} ${className}`}>
      <div className="max-w-6xl mx-auto px-3 py-[10px] sm:px-4 md:py-[14px]">
        <div className="flex items-center justify-between">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
                src={logoSrc}
                alt={logoAlt}
                width={logoWidth}
                height={logoHeight}
                className="h-auto w-[116px] sm:w-[160px]"
                priority
            />
          </Link>

          {/* Desktop Menu - Center */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href={aboutLink.href}
              className={`${toneClasses.link} transition-colors font-medium`}
            >
              {aboutLink.label}
            </Link>

            {/* Exploration Dropdown */}
            <div className="relative group">
              <Link
                href={explorationLink.href}
                className={`${toneClasses.link} transition-colors font-medium`}
                style={{ ['--exp-text-w' as string]: explorationTextColumnWidth }}
              >
                <span className="inline-grid grid-cols-[var(--exp-text-w)_12px] items-center gap-x-[2px] leading-none">
                  <span className="w-[var(--exp-text-w)] text-left">{explorationLink.label}</span>
                  <ChevronDownIcon className="h-[12px] w-[12px] justify-self-end group-hover:rotate-180 transition-transform" />
                </span>
              </Link>

              {/* Dropdown Menu */}
              <div
                className={`absolute left-0 mt-1 w-max ${isLightBg ? 'bg-[var(--color-role-surface-base)]' : 'bg-[var(--color-comp-header-dropdown-bg)] backdrop-blur'} rounded-md border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 overflow-hidden ${toneClasses.border}`}
                style={{ ['--exp-text-w' as string]: explorationTextColumnWidth }}
              >
                <div className={`${isLightBg ? 'divide-y divide-[var(--color-role-border-soft)]' : 'divide-y divide-[var(--color-comp-header-divide-dark)]'}`}>
                  {explorationItems.map((item) => (
                    <Link
                      key={`${item.href}-${item.label}`}
                      href={item.href}
                      className={`block whitespace-nowrap px-3 py-2 text-sm leading-none ${toneClasses.hoverBg} ${toneClasses.link} transition-colors`}
                    >
                      <span className="inline-grid grid-cols-[var(--exp-text-w)_12px] items-center gap-x-[2px] leading-none">
                        <span className="w-[var(--exp-text-w)] text-left">{item.label}</span>
                        <item.icon className="h-[12px] w-[12px] justify-self-end" strokeWidth={item.icon === SportShoeIcon ? 2.25 : undefined} />
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            <Link
              href={contactLink.href}
              className={`${toneClasses.link} transition-colors font-medium`}
            >
              {contactLink.label}
            </Link>
          </nav>

          {/* Hamburger Menu Button - Right (Mobile) */}
          <button
            onClick={toggleMenu}
            className={`md:hidden flex flex-col gap-1 p-1.5 ${toneClasses.hoverBg} rounded-md transition-colors`}
            aria-label="Toggle menu"
          >
            <span
              className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-[6px]' : ''
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-5 h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-[6px]' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className={`md:hidden mt-2 pb-2 border-t pt-3 space-y-1 ${toneClasses.border}`}>
            <Link
              href="/about"
              onClick={closeMenu}
              className={`block px-3 py-1.5 text-[15px] ${toneClasses.hoverBg} ${toneClasses.link} transition-colors rounded-md font-medium`}
            >
              {aboutLink.label}
            </Link>

            {/* Mobile Exploration Menu */}
            <div>
              <div className="flex items-stretch gap-1">
                <Link
                  href={explorationLink.href}
                  onClick={closeMenu}
                  className={`flex-1 px-3 py-1.5 text-[15px] ${toneClasses.hoverBg} ${toneClasses.link} transition-colors rounded-md font-medium`}
                >
                  {explorationLink.label}
                </Link>
                <button
                  onClick={toggleExploration}
                  className={`px-3 py-1.5 ${toneClasses.hoverBg} ${toneClasses.link} transition-colors rounded-md font-medium flex items-center justify-center`}
                  aria-label={isExplorationOpen ? 'Chiudi sotto-menu Exploration' : 'Apri sotto-menu Exploration'}
                  aria-expanded={isExplorationOpen}
                >
                  <ChevronDownIcon
                    className={`w-3.5 h-3.5 transition-transform ${
                      isExplorationOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
              </div>

              {isExplorationOpen && (
                <div className={`${isLightBg ? 'bg-[var(--color-role-surface-base)]' : 'bg-[var(--color-comp-header-dropdown-bg)]'} rounded-md border mt-1 overflow-hidden ${toneClasses.border}`}>
                  <div className={`${isLightBg ? 'divide-y divide-[var(--color-role-border-soft)]' : 'divide-y divide-[var(--color-comp-header-divider)]/80'}`}>
                    {explorationItems.map((item) => (
                    <Link
                      key={`${item.href}-${item.label}-mobile`}
                      href={item.href}
                      onClick={closeMenu}
                      className={`flex items-center justify-between gap-3 px-4 py-2 ${toneClasses.hoverBg} ${toneClasses.link} transition-colors text-sm`}
                    >
                      <span>{item.label}</span>
                      <item.icon className="h-[12px] w-[12px] shrink-0" strokeWidth={item.icon === SportShoeIcon ? 2.25 : undefined} />
                    </Link>
                  ))}
                  </div>
                </div>
              )}
            </div>

            <Link
              href={contactLink.href}
              onClick={closeMenu}
              className={`block px-3 py-1.5 text-[15px] ${toneClasses.hoverBg} ${toneClasses.link} transition-colors rounded-md font-medium`}
            >
              {contactLink.label}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}