'use client';

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Loader from "@/components/Loader";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const isStorybookRoute = pathname.startsWith('/storybook');
  const footerClassName = pathname.startsWith('/exploration') ? '!mt-0' : '';

  useEffect(() => {
    const start = setTimeout(() => setIsLoading(true), 0);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => {
      clearTimeout(start);
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
