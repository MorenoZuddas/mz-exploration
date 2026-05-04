'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronDown, Mountain, PlaneTakeoff, SportShoe } from 'lucide-react';

export interface HeaderNavLink {
  label: React.ReactNode;
  href: string;
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
  explorationItems?: HeaderNavLink[];
}

const headerToneClasses: Record<NonNullable<HeaderProps['tone']>, { link: string; hoverBg: string; border: string }> = {
  current: {
    link: 'hover:text-blue-400',
    hoverBg: 'hover:bg-slate-800',
    border: 'border-slate-700',
  },
  blue: {
    link: 'hover:text-blue-200',
    hoverBg: 'hover:bg-blue-900/30',
    border: 'border-blue-900/70',
  },
  purple: {
    link: 'hover:text-violet-200',
    hoverBg: 'hover:bg-violet-900/30',
    border: 'border-violet-900/70',
  },
  black: {
    link: 'hover:text-slate-200',
    hoverBg: 'hover:bg-black/40',
    border: 'border-slate-600',
  },
};

const defaultAboutLink: HeaderNavLink = { label: 'Chi Sono', href: '/about' };
const defaultContactLink: HeaderNavLink = { label: 'Contatti', href: '/contact' };
const defaultExplorationLink: HeaderNavLink = { label: 'Exploration', href: '/exploration' };
const defaultExplorationItems: HeaderNavLink[] = [
  {
    label: (
      <span className="inline-flex items-center gap-2">
        <span>Running</span>
        <SportShoe className="h-4 w-4" strokeWidth={2.25} />
      </span>
    ),
    href: '/exploration/running',
  },
  {
    label: (
      <span className="inline-flex items-center gap-2">
        <span>Trekking</span>
        <Mountain className="h-4 w-4" />
      </span>
    ),
    href: '/exploration/trekking',
  },
  {
    label: (
      <span className="inline-flex items-center gap-2">
        <span>Trips</span>
        <PlaneTakeoff className="h-4 w-4" />
      </span>
    ),
    href: '/exploration/trips',
  },
];

export default function Header({
  className = '',
  backgroundClassName = 'bg-slate-900 dark:bg-slate-950',
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
        link: 'text-slate-900 hover:text-slate-700',
        hoverBg: 'hover:bg-slate-100',
        border: 'border-slate-900/30',
      }
    : headerToneClasses[tone];
  const rootTextClass = isLightBg ? 'text-slate-900' : 'text-white';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isExplorationOpen, setIsExplorationOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
      <div className="max-w-6xl mx-auto px-4 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
                src={logoSrc}
                alt={logoAlt}
                width={logoWidth}
                height={logoHeight}
                className="h-auto w-[126px] sm:w-[160px]"
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
                className={`${toneClasses.link} transition-colors font-medium flex items-center gap-1`}
              >
                {explorationLink.label}
                <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
              </Link>

              {/* Dropdown Menu */}
              <div className={`absolute left-0 mt-2 w-52 ${isLightBg ? 'bg-white' : 'bg-slate-800/95 backdrop-blur'} rounded-lg border shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2 ${toneClasses.border}`}>
                {explorationItems.map((item) => (
                  <Link
                    key={`${item.href}-${item.label}`}
                    href={item.href}
                    className={`flex items-center justify-center text-center px-4 py-2 ${toneClasses.hoverBg} ${toneClasses.link} transition-colors motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:scale-[1.01]`}
                  >
                    {item.label}
                  </Link>
                ))}
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
            className={`md:hidden flex flex-col gap-1.5 p-1.5 ${toneClasses.hoverBg} rounded-md transition-colors`}
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className={`md:hidden mt-2 pb-2 border-t pt-3 space-y-1.5 ${toneClasses.border}`}>
            <Link
              href="/about"
              onClick={closeMenu}
              className={`block px-3 py-1.5 text-base ${toneClasses.hoverBg} ${toneClasses.link} transition-colors rounded-md font-medium`}
            >
              {aboutLink.label}
            </Link>

            {/* Mobile Exploration Menu */}
            <div>
              <button
                onClick={toggleExploration}
                className={`w-full text-left px-3 py-1.5 text-base ${toneClasses.hoverBg} ${toneClasses.link} transition-colors rounded-md font-medium flex items-center justify-between`}
              >
                {explorationLink.label}
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform ${
                    isExplorationOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {isExplorationOpen && (
                <div className={`${isLightBg ? 'bg-white' : 'bg-slate-800/95'} rounded-md border mt-1 space-y-0.5 py-1 ${toneClasses.border}`}>
                  {explorationItems.map((item) => (
                    <Link
                      key={`${item.href}-${item.label}-mobile`}
                      href={item.href}
                      onClick={closeMenu}
                      className={`flex items-center justify-center text-center px-4 py-1.5 ${toneClasses.hoverBg} ${toneClasses.link} transition-colors text-sm motion-safe:transition-transform motion-safe:duration-200 motion-safe:hover:scale-[1.01]`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link
              href={contactLink.href}
              onClick={closeMenu}
              className={`block px-3 py-1.5 text-base ${toneClasses.hoverBg} ${toneClasses.link} transition-colors rounded-md font-medium`}
            >
              {contactLink.label}
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}