'use client';

import { useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  // Avvia il loader gia' al primo render, cosi' l'overlay precede eventuali skeleton locali.
  const [isLoading, setIsLoading] = useState(true);
  const pathname = usePathname();
  const isStorybookRoute = pathname.startsWith('/storybook');
  const footerClassName = pathname.startsWith('/exploration') ? '!mt-0' : '';

  useLayoutEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => {
      clearTimeout(timer);
    };
  }, [pathname]);

  return (
    <>
      {isLoading && <Loader />}
      {!isStorybookRoute && <Header />}
      {children}
      {!isStorybookRoute && <Footer className={footerClassName} />}
    </>
  );
}
