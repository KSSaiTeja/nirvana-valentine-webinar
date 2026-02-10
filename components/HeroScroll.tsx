"use client";

import { useRef, useEffect, useCallback } from "react";
import { useImagePreloader } from "@/hooks/useImagePreloader";
import { useLenisScroll } from "@/contexts/LenisScrollContext";
import { useRegistrationModal } from "@/contexts/RegistrationModalContext";
import { motion, useScroll, useTransform } from "framer-motion";

const HERO_HEIGHT_VH = 120;
const FRAME_LERP = 0.12;
const HERO_EASE = [0.22, 1, 0.36, 1] as const;

function BlurRevealText({
  text,
  className,
  baseDelay = 0,
  charDelay = 0.035,
  duration = 0.45,
}: {
  text: string;
  className?: string;
  baseDelay?: number;
  charDelay?: number;
  duration?: number;
}) {
  const chars = text.split("");
  return (
    <span className={className}>
      {chars.map((char, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ filter: "blur(10px)", opacity: 0 }}
          animate={{ filter: "blur(0px)", opacity: 1 }}
          transition={{
            duration,
            delay: baseDelay + i * charDelay,
            ease: HERO_EASE,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export function HeroScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { images, isReady, totalFrames, error } = useImagePreloader();
  const { scrollYRef } = useLenisScroll();
  const { openModal } = useRegistrationModal();
  const currentFrameRef = useRef(0);
  const targetFrameRef = useRef(0);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const scrollButtonOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, index: number) => {
      const img = images[index];
      if (!img) return;
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height);
      const w = img.width * scale;
      const h = img.height * scale;
      const x = (canvas.width - w) / 2;
      const y = (canvas.height - h) / 2;
      ctx.drawImage(img, x, y, w, h);
    },
    [images]
  );

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || !isReady || images.length === 0 || totalFrames === 0) return;

    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio ?? 1, 2);

    const setSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const w = Math.round(width * dpr);
      const h = Math.round(height * dpr);
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      draw(ctx, canvas, Math.round(currentFrameRef.current));
    };

    setSize();
    const resizeObserver = new ResizeObserver(() => setSize());
    resizeObserver.observe(container);

    const update = () => {
      const scrollY = scrollYRef.current;
      const sectionTop = container.offsetTop;
      const sectionHeight = container.offsetHeight;
      const viewportHeight = window.innerHeight;
      const maxScroll = Math.max(0, sectionHeight - viewportHeight);
      const progress = maxScroll <= 0 ? 0 : Math.max(0, Math.min(1, (scrollY - sectionTop) / maxScroll));
      targetFrameRef.current = Math.min(Math.floor(progress * totalFrames), totalFrames - 1);

      const target = targetFrameRef.current;
      let current = currentFrameRef.current;
      current += (target - current) * FRAME_LERP;
      if (Math.abs(target - current) < 0.5) current = target;
      currentFrameRef.current = current;
      draw(ctx, canvas, Math.round(current));
    };

    let rafId = requestAnimationFrame(function loop() {
      update();
      rafId = requestAnimationFrame(loop);
    });

    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, [isReady, images.length, totalFrames, draw, scrollYRef]);

  return (
    <div
      ref={containerRef}
      className="relative w-full"
      style={{ height: `${HERO_HEIGHT_VH}vh` }}
    >
      <div className="sticky top-0 left-0 w-full h-dvh min-h-dvh max-h-dvh flex items-center justify-center overflow-hidden">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover will-change-transform"
          style={{ display: isReady ? "block" : "none", touchAction: "none" }}
        />
        {/* Smooth fade at bottom of last frame into next section */}
        {isReady && (
          <div
            className="absolute inset-x-0 bottom-0 h-[45%] pointer-events-none"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.4) 50%, rgba(255,255,255,0.92) 85%, white 100%)",
            }}
          />
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <p className="font-inter font-medium text-red-400 text-sm tracking-wide text-center px-4">{error}</p>
          </div>
        )}
        {!isReady && !error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <p className="font-inter font-medium text-white/90 text-sm tracking-wide">
              Loading…
            </p>
          </div>
        )}
        {isReady && (
          <div className="absolute inset-0 flex flex-col items-center justify-center min-h-dvh px-4 sm:px-6 md:px-8">
            <div className="w-full max-w-[760px] mx-auto text-center">
              <h1 className="font-playfair text-white text-[clamp(2.75rem,6.5vw,64px)] font-semibold tracking-[-0.025em] leading-[1.35]">
                <BlurRevealText
                  text="Love Grows."
                  baseDelay={0.2}
                  charDelay={0.04}
                />
              </h1>
              <p className="font-playfair text-white text-[clamp(3rem,7.5vw,72px)] font-semibold italic tracking-[-0.025em] leading-[1.35] mt-3">
                <BlurRevealText
                  text="So Should Your Wealth."
                  baseDelay={0.55}
                  charDelay={0.035}
                />
              </p>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.6, ease: HERO_EASE }}
                className="font-inter text-white text-[20px] font-semibold tracking-[0.01em] leading-[1.6] mt-7 max-w-[600px] mx-auto text-center"
              >
                This Valentine&apos;s, choose a better financial partner.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.8, ease: HERO_EASE }}
                className="font-inter text-white text-[13px] sm:text-[14px] font-semibold uppercase tracking-[0.08em] mt-6"
              >
                Feb 14, 2026 &nbsp;•&nbsp; 90 Minutes &nbsp;•&nbsp; Live + Q&A &nbsp;•&nbsp; ₹499 (Incl. GST)
              </motion.p>
              <motion.div style={{ opacity: scrollButtonOpacity }} className="mt-8">
                <a
                  href="#details"
                  className="font-inter font-normal text-[15px] text-white/95 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full min-h-[48px] inline-flex items-center justify-center hover:bg-white/30 transition-colors duration-300"
                >
                  Scroll to know more
                </a>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 1, ease: HERO_EASE }}
                className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-5"
              >
                <button
                  type="button"
                  onClick={openModal}
                  className="font-inter font-semibold text-white bg-[#111] px-7 py-4 rounded-full min-h-[48px] inline-flex items-center justify-center hover:-translate-y-[2px] transition-transform duration-300 ease-out"
                >
                  Reserve my seat.
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
