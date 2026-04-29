'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
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
    <header className="sticky top-0 z-50 bg-slate-900 dark:bg-slate-950 text-white shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Left */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Image
                src="/logo/hp-logo.svg"
                alt="mz-exploration logo"
                width={175}
                height={150}
                priority
            />
          </Link>

          {/* Desktop Menu - Center */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/about"
              className="hover:text-blue-400 transition-colors font-medium"
            >
              Chi Sono
            </Link>

            {/* Exploration Dropdown */}
            <div className="relative group">
              <Link
                href="/exploration"
                className="hover:text-blue-400 transition-colors font-medium flex items-center gap-1"
              >
                Exploration
                <svg
                  className="w-4 h-4 group-hover:rotate-180 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </Link>

              {/* Dropdown Menu */}
              <div className="absolute left-0 mt-0 w-48 bg-slate-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
                <Link
                  href="/exploration/running"
                  className="block px-4 py-2 hover:bg-slate-700 hover:text-blue-400 transition-colors"
                >
                  🏃 Running
                </Link>
                <Link
                  href="/exploration/trekking"
                  className="block px-4 py-2 hover:bg-slate-700 hover:text-blue-400 transition-colors"
                >
                  🥾 Trekking
                </Link>
                <Link
                  href="/exploration/trips"
                  className="block px-4 py-2 hover:bg-slate-700 hover:text-blue-400 transition-colors"
                >
                  ✈️ Trips
                </Link>
              </div>
            </div>

            <Link
              href="/contact"
              className="hover:text-blue-400 transition-colors font-medium"
            >
              Contatti
            </Link>
          </nav>

          {/* Hamburger Menu Button - Right (Mobile) */}
          <button
            onClick={toggleMenu}
            className="md:hidden flex flex-col gap-1.5 p-2 hover:bg-slate-800 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`w-6 h-0.5 bg-white transition-all duration-300 ${
                isMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 border-t border-slate-700 pt-4 space-y-2">
            <Link
              href="/"
              onClick={closeMenu}
              className="block px-4 py-2 hover:bg-slate-800 hover:text-blue-400 transition-colors rounded-lg font-medium"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={closeMenu}
              className="block px-4 py-2 hover:bg-slate-800 hover:text-blue-400 transition-colors rounded-lg font-medium"
            >
              Chi Sono
            </Link>

            {/* Mobile Exploration Menu */}
            <div>
              <button
                onClick={toggleExploration}
                className="w-full text-left px-4 py-2 hover:bg-slate-800 hover:text-blue-400 transition-colors rounded-lg font-medium flex items-center justify-between"
              >
                Exploration
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isExplorationOpen ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  />
                </svg>
              </button>

              {isExplorationOpen && (
                <div className="bg-slate-800 rounded-lg mt-1 space-y-1 py-2">
                  <Link
                    href="/exploration"
                    onClick={closeMenu}
                    className="block px-6 py-2 hover:bg-slate-700 hover:text-blue-400 transition-colors text-sm"
                  >
                    📍 Exploration
                  </Link>
                  <Link
                    href="/exploration/running"
                    onClick={closeMenu}
                    className="block px-6 py-2 hover:bg-slate-700 hover:text-blue-400 transition-colors text-sm"
                  >
                    🏃 Running
                  </Link>
                  <Link
                    href="/exploration/trekking"
                    onClick={closeMenu}
                    className="block px-6 py-2 hover:bg-slate-700 hover:text-blue-400 transition-colors text-sm"
                  >
                    🥾 Trekking
                  </Link>
                  <Link
                    href="/exploration/trips"
                    onClick={closeMenu}
                    className="block px-6 py-2 hover:bg-slate-700 hover:text-blue-400 transition-colors text-sm"
                  >
                    ✈️ Trips
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/contact"
              onClick={closeMenu}
              className="block px-4 py-2 hover:bg-slate-800 hover:text-blue-400 transition-colors rounded-lg font-medium"
            >
              Contatti
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}