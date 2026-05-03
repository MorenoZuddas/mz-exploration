'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface UseActivityClickOptions {
  detailsPageUrl: string;
  onOpenModal?: () => void;
}

export function useActivityClick({ detailsPageUrl, onOpenModal }: UseActivityClickOptions) {
  const router = useRouter();
  const [isDesktop, setIsDesktop] = useState(
    () => (typeof window !== 'undefined' ? window.matchMedia('(min-width: 768px)').matches : false)
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 768px)');

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const handleClick = () => {

    if (isDesktop) {
      onOpenModal?.();
    } else {
      router.push(detailsPageUrl);
    }
  };

  return { handleClick, isDesktop };
}

