'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseActivityClickOptions {
  activityId: string;
  detailsPageUrl: string;
  onOpenModal?: () => void;
}

export function useActivityClick({ activityId, detailsPageUrl, onOpenModal }: UseActivityClickOptions) {
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    setIsDesktop(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleClick = () => {
    if (!mounted) return;

    if (isDesktop) {
      onOpenModal?.();
    } else {
      router.push(detailsPageUrl);
    }
  };

  return { handleClick, isDesktop };
}

