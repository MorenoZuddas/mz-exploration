'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ActivityDetailModal } from '@/components/ActivityDetailModal';

interface Props {
  activityId: string;
  detailsPageUrl: string;
}

export function ActivityClickHandler({ activityId, detailsPageUrl }: Props) {
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Determina se è desktop (md+) basato su media query
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleClick = () => {
    if (isDesktop) {
      // Desktop: apri modale
      setShowModal(true);
    } else {
      // Mobile/tablet: vai alla pagina
      router.push(detailsPageUrl);
    }
  };

  return (
    <>
      <div onClick={handleClick} className="cursor-pointer">
        {/* Il contenuto viene reso dai componenti figli */}
      </div>

      {/* Modale (solo su desktop) */}
      {isDesktop && (
        <ActivityDetailModal
          activityId={activityId}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          detailsPageUrl={detailsPageUrl}
        />
      )}
    </>
  );
}

