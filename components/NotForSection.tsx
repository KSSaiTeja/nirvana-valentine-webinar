"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useRegistrationModal } from "@/contexts/RegistrationModalContext";
import {
  Newspaper,
  TrendingDown,
  Scale,
  Target,
  ShieldAlert,
  LayoutList,
} from "lucide-react";

const GOLD = "#c9a227";

const CARDS = [
  {
    icon: Newspaper,
    text: "Confused by current market behaviour, despite constant news and opinions?",
  },
  {
    icon: TrendingDown,
    text: "Markets seem to be moving, but your portfolio is still in the red — unsure why?",
  },
  {
    icon: Scale,
    text: "Not clear whether to stay invested, rebalance, or change your strategy altogether?",
  },
  {
    icon: Target,
    text: "Struggling to align your portfolio for the next phase of the market cycle?",
  },
  {
    icon: ShieldAlert,
    text: "Worried about downside risk, but unsure how to manage it effectively?",
  },
  {
    icon: LayoutList,
    text: "Making decisions based on fear or noise rather than a structured framework?",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function NotForSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const { openModal } = useRegistrationModal();

  return (
    <section
      id="not-for"
      ref={ref}
      className="relative w-full py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden bg-white"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease }}
            className="font-inter text-neutral-400 text-sm sm:text-base font-medium mb-2 sm:mb-3"
          >
            Is this you?
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.06, ease }}
            className="font-playfair text-neutral-900 text-2xl sm:text-3xl md:text-4xl lg:text-[2.75rem] font-bold tracking-tight max-w-2xl mx-auto leading-tight"
          >
            Does Your Investment Journey
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.12, ease }}
            className="font-playfair text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mt-2 sm:mt-3 bg-linear-to-r from-amber-500 via-yellow-500 to-amber-600 bg-clip-text text-transparent"
          >
            Feel Like This...?
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-6">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.text}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.55,
                  delay: 0.15 + i * 0.07,
                  ease,
                }}
                className="flex flex-col items-center text-center rounded-2xl bg-white p-6 sm:p-7 md:p-8 border border-neutral-100/80 transition-shadow duration-300"
                style={{
                  boxShadow:
                    "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04), 0 12px 32px -8px rgba(0,0,0,0.06)",
                }}
              >
                <div
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shrink-0 mb-4 sm:mb-5 border-2"
                  style={{ borderColor: GOLD, color: GOLD }}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.75} />
                </div>
                <p className="font-inter text-neutral-800 text-[15px] sm:text-base md:text-[17px] font-normal leading-[1.6] max-w-[320px] mx-auto">
                  {card.text}
                </p>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.55, ease }}
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
