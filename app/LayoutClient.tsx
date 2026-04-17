"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Loader from "@/components/Loader";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function LayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const startTimer = setTimeout(() => setIsLoading(true), 0);
    const stopTimer = setTimeout(() => setIsLoading(false), 500);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(stopTimer);
    };
  }, [pathname]);

  return (
    <>
      {isLoading && <Loader />}
      <Header />
      {children}
      <Footer />
    </>
  );
}
