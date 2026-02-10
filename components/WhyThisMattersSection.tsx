"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Activity, Globe, Sparkles } from "lucide-react";

const GOLD = "#c9a227";
const CARD_SHADOW =
  "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04), 0 12px 32px -8px rgba(0,0,0,0.06)";
const ease = [0.22, 1, 0.36, 1] as const;

const ITEMS = [
  {
    icon: Activity,
    title: "18 Months of Chaos",
    body: "Markets moved together—equities fell, gold surged, crypto zigzagged.",
  },
  {
    icon: Globe,
    title: "Global Uncertainty",
    body: "Trade deals. Budget shifts. Policies that affect your wealth daily.",
  },
  {
    icon: Sparkles,
    title: "Noise vs. Clarity",
    body: "You need strategy, not tips. Understanding, not predictions.",
  },
];

export function WhyThisMattersSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section
      id="why-now"
      ref={ref}
      className="relative w-full py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden bg-neutral-50/70"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="text-center mb-12 sm:mb-14 md:mb-16">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease }}
            className="font-inter text-neutral-500 text-sm sm:text-base font-medium uppercase tracking-[0.12em] mb-3 sm:mb-4"
          >
            Why This Matters Now
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.06, ease }}
            className="font-playfair text-neutral-900 text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold tracking-tight max-w-2xl mx-auto leading-[1.15]"
          >
            The Market Won&apos;t Wait.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.12, ease }}
            className="font-playfair italic text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold tracking-tight mt-2 bg-linear-to-r from-amber-600 via-amber-500 to-amber-600 bg-clip-text text-transparent"
          >
            Neither Should You.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {ITEMS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.55,
                  delay: 0.18 + i * 0.08,
                  ease,
                }}
                className="rounded-2xl bg-white p-6 sm:p-7 md:p-8 border border-neutral-100/80 text-center md:text-left transition-shadow duration-300 hover:shadow-[0_4px 20px_-4px_rgba(0,0,0,0.08)]"
                style={{ boxShadow: CARD_SHADOW }}
              >
                <div
                  className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0 mb-4 mx-auto md:mx-0"
                  style={{ backgroundColor: `${GOLD}14`, color: GOLD }}
                >
                  <Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={1.75} />
                </div>
                <h3 className="font-inter text-neutral-900 text-lg sm:text-xl font-semibold tracking-tight mb-2">
                  {item.title}
                </h3>
                <p className="font-inter text-neutral-600 text-[15px] sm:text-base leading-[1.65]">
                  {item.body}
                </p>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
