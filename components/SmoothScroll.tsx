"use client";

import { useCallback, useEffect, useRef } from "react";
import Lenis from "lenis";
import { LenisScrollProvider } from "@/contexts/LenisScrollContext";
import "lenis/dist/lenis.css";

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const rafRef = useRef<number>(0);
  const lenisRef = useRef<Lenis | null>(null);
  const scrollYRef = useRef(0);

  const scrollTo = useCallback((selector: string, options?: { offset?: number; duration?: number }) => {
    const el = document.querySelector(selector);
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el as HTMLElement, {
        offset: options?.offset ?? 0,
        duration: options?.duration ?? 1.2,
      });
    }
  }, []);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 2,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      orientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1.2,
      syncTouch: true,
      syncTouchLerp: 0.06,
    });
    lenisRef.current = lenis;
    document.documentElement.classList.add("lenis", "lenis-smooth");

    lenis.on("scroll", (instance) => {
      scrollYRef.current = instance.scroll;
    });

    function raf(time: number) {
      lenis.raf(time);
      rafRef.current = requestAnimationFrame(raf);
    }
    rafRef.current = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafRef.current);
      document.documentElement.classList.remove("lenis", "lenis-smooth");
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <LenisScrollProvider scrollYRef={scrollYRef} scrollTo={scrollTo}>
      {children}
    </LenisScrollProvider>
  );
}
