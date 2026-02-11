"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Calendar, Clock, ShieldCheck } from "lucide-react";
import { useRegistrationModal } from "@/contexts/RegistrationModalContext";

const GOLD = "#c9a227";
const CARD_SHADOW =
  "0 1px 2px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.04), 0 12px 32px -8px rgba(0,0,0,0.06)";
const ease = [0.22, 1, 0.36, 1] as const;

const DETAILS = [
  {
    icon: Calendar,
    label: "Date",
    value: "Saturday, February 14, 2026",
    sub: "10:30am – 12:30pm",
  },
  {
    icon: Clock,
    label: "Duration",
    value: "90 mins live + Q&A",
  },
  {
    icon: ShieldCheck,
    label: "Guarantee",
    value: "Full recording + slides within 24 hours",
    sub: "Presentation within 24 hours. Zero risk if you can't attend live",
  },
];

export function WebinarDetailsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });
  const { openModal } = useRegistrationModal();

  return (
    <section
      id="details"
      ref={ref}
      className="relative w-full py-16 sm:py-20 md:py-24 lg:py-28 overflow-hidden bg-neutral-50/80"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10">
        <div className="text-center mb-10 sm:mb-12 md:mb-14">
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease }}
            className="font-inter text-neutral-500 text-sm sm:text-base font-medium uppercase tracking-[0.12em] mb-3 sm:mb-4"
          >
            Webinar Details
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.06, ease }}
            className="font-playfair text-neutral-900 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight max-w-xl mx-auto leading-tight italic"
          >
            Everything You Need to Know
          </motion.h2>
        </div>

        <div className="space-y-4 sm:space-y-5 mb-10 sm:mb-12">
          {DETAILS.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 16 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.5,
                  delay: 0.12 + i * 0.06,
                  ease,
                }}
                className="rounded-2xl bg-white p-5 sm:p-6 border border-neutral-100/80 flex gap-4 sm:gap-5 items-start"
                style={{ boxShadow: CARD_SHADOW }}
              >
                <div
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0"
                  style={{ backgroundColor: `${GOLD}14`, color: GOLD }}
                >
                  <Icon className="w-5 h-5 sm:w-5 sm:h-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 pt-0.5">
                  <p className="font-inter text-neutral-500 text-xs sm:text-sm font-medium uppercase tracking-wider mb-1">
                    {item.label}
                  </p>
                  <p className="font-inter text-neutral-900 text-[15px] sm:text-base font-medium leading-snug">
                    {item.value}
                  </p>
                  {item.sub && (
                    <p className="font-inter text-neutral-500 text-sm mt-1.5">
                      {item.sub}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55, delay: 0.4, ease }}
          className="rounded-3xl bg-white border border-neutral-100/80 p-6 sm:p-8 md:p-10 text-center"
          style={{
            boxShadow:
              "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px -4px rgba(0,0,0,0.06), 0 24px 48px -12px rgba(0,0,0,0.08)",
          }}
        >
          <p className="font-inter text-neutral-900 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            ₹499
          </p>
          <p className="font-inter text-neutral-500 text-sm sm:text-base mt-1">
            (GST included)
          </p>
          <button
            type="button"
            onClick={openModal}
            className="mt-6 sm:mt-8 font-inter font-semibold text-white px-8 py-4 rounded-full min-h-[52px] inline-flex items-center justify-center transition-transform duration-300 ease-out hover:-translate-y-[2px] bg-neutral-900 w-full sm:w-auto"
          >
            Reserve my seat
          </button>
          <p className="font-inter text-neutral-500 text-sm sm:text-base mt-5 max-w-sm mx-auto leading-relaxed">
            Valentine&apos;s Day is once a year. Secure your spot before seats
            fill.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
