'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Modal } from '@/components/Modal';
import type { ReactNode } from 'react';

interface Props {
  activityId: string;
  detailsPageUrl: string;
  children?: ReactNode;
  className?: string;
  desktopBreakpoint?: number;
  onDesktopOpen?: () => void;
  tone?: 'current' | 'blue' | 'purple' | 'black';
}

export function ActivityClickHandler({
  activityId,
  detailsPageUrl,
  children,
  className = 'cursor-pointer',
  desktopBreakpoint = 768,
  onDesktopOpen,
  tone = 'current',
}: Props) {
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(`(min-width: ${desktopBreakpoint}px)`).matches : false
  );
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Determina se è desktop (md+) basato su media query
    const mediaQuery = window.matchMedia(`(min-width: ${desktopBreakpoint}px)`);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [desktopBreakpoint]);

  const handleClick = () => {
    if (isDesktop) {
      // Desktop: apri modale
      setShowModal(true);
      onDesktopOpen?.();
    } else {
      // Mobile/tablet: vai alla pagina
      router.push(detailsPageUrl);
    }
  };

  return (
    <>
      <div onClick={handleClick} className={className} role="button" tabIndex={0} onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}>
        {children}
      </div>

      {/* Modale (solo su desktop) */}
      {isDesktop && (
        <Modal
          activityId={activityId}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          detailsPageUrl={detailsPageUrl}
          tone={tone}
        />
      )}
    </>
  );
}

