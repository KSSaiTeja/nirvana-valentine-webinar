"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

export type ScrollToOptions = {
  offset?: number;
  duration?: number;
};

type LenisScrollContextValue = {
  scrollYRef: React.MutableRefObject<number>;
  /** Smooth-scroll to a CSS selector (e.g. "#details"). Use for anchor links so Lenis handles scroll. */
  scrollTo: (selector: string, options?: ScrollToOptions) => void;
};

const LenisScrollContext = createContext<LenisScrollContextValue | null>(null);

export function useLenisScroll() {
  const ctx = useContext(LenisScrollContext);
  if (!ctx) throw new Error("useLenisScroll must be used within LenisScrollProvider");
  return ctx;
}

export function LenisScrollProvider({
  scrollYRef,
  scrollTo,
  children,
}: {
  scrollYRef: React.MutableRefObject<number>;
  scrollTo: (selector: string, options?: ScrollToOptions) => void;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ scrollYRef, scrollTo }), [scrollYRef, scrollTo]);
  return (
    <LenisScrollContext.Provider value={value}>
      {children}
    </LenisScrollContext.Provider>
  );
}
