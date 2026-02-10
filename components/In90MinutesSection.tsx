"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Ban, BookOpen, Check, X } from "lucide-react";
import { useRegistrationModal } from "@/contexts/RegistrationModalContext";

const GOLD = "#c9a227";
const CARD_SHADOW =
  "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04), 0 12px 32px -8px rgba(0,0,0,0.06)";
const ease = [0.22, 1, 0.36, 1] as const;

const NO_FLUFF = [
  "No stock tips",
  "No predictions",
  "No hype",
  "No shortcuts",
];

const PURE_STRATEGY = [
  "Why asset classes moved together",
  "EU-India / US-India deal impacts",
  "Budget 2026: What actually affects your portfolio",
  "Rethinking Portfolio Strategy",
];

export function In90MinutesSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const { openModal } = useRegistrationModal();

  return (
    <section
      id="what-you-gain"
      ref={ref}
      className="relative w-full py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden bg-white"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease }}
            className="font-inter text-neutral-500 text-sm sm:text-base font-medium uppercase tracking-[0.12em] mb-3 sm:mb-4"
          >
            In 90 Minutes
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.06, ease }}
            className="font-playfair text-neutral-900 text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold tracking-tight max-w-2xl mx-auto leading-tight italic"
          >
            What You&apos;ll Actually Gain
          </motion.h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15, ease }}
            className="rounded-2xl bg-neutral-50 border border-neutral-100/80 p-6 sm:p-8 md:p-9"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${GOLD}18`, color: GOLD }}
              >
                <Ban className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
              </div>
              <h3 className="font-playfair text-neutral-900 text-xl sm:text-2xl font-semibold tracking-tight">
                No Fluff
              </h3>
            </div>
            <ul className="space-y-3 sm:space-y-4">
              {NO_FLUFF.map((item) => (
                <li
                  key={item}
                  className="font-inter text-neutral-700 text-[15px] sm:text-base leading-[1.6] flex items-start gap-3"
                >
                  <X
                    className="w-5 h-5 shrink-0 mt-0.5 text-red-500"
                    strokeWidth={2}
                    aria-hidden
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.22, ease }}
            className="rounded-2xl bg-white border border-neutral-100/80 p-6 sm:p-8 md:p-9 ring-1 ring-amber-500/10"
            style={{ boxShadow: CARD_SHADOW }}
          >
            <div className="flex items-center gap-3 mb-5 sm:mb-6">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${GOLD}18`, color: GOLD }}
              >
                <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
              </div>
              <h3 className="font-playfair text-neutral-900 text-xl sm:text-2xl font-semibold tracking-tight">
                Pure Strategy
              </h3>
            </div>
            <ul className="space-y-3 sm:space-y-4">
              {PURE_STRATEGY.map((item) => (
                <li
                  key={item}
                  className="font-inter text-neutral-700 text-[15px] sm:text-base leading-[1.6] flex items-start gap-3"
                >
                  <Check
                    className="w-5 h-5 shrink-0 mt-0.5 text-green-500"
                    strokeWidth={2}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.45, ease }}
          className="mt-14 sm:mt-16 md:mt-20 text-center"
        >
          <button
            type="button"
            onClick={openModal}
            className="font-inter font-semibold text-white px-8 py-4 rounded-full min-h-[52px] inline-flex items-center justify-center transition-transform duration-300 ease-out hover:-translate-y-[2px] bg-neutral-900"
          >
            Reserve my seat.
          </button>
        </motion.div>
      </div>
    </section>
  );
}
