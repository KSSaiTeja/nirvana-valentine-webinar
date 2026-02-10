"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

type LenisScrollContextValue = {
  scrollYRef: React.MutableRefObject<number>;
};

const LenisScrollContext = createContext<LenisScrollContextValue | null>(null);

export function useLenisScroll() {
  const ctx = useContext(LenisScrollContext);
  if (!ctx) throw new Error("useLenisScroll must be used within LenisScrollProvider");
  return ctx;
}

export function LenisScrollProvider({
  scrollYRef,
  children,
}: {
  scrollYRef: React.MutableRefObject<number>;
  children: ReactNode;
}) {
  const value = useMemo(() => ({ scrollYRef }), [scrollYRef]);
  return (
    <LenisScrollContext.Provider value={value}>
      {children}
    </LenisScrollContext.Provider>
  );
}
