"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle } from "lucide-react";

type RegistrationModalContextValue = {
  openModal: () => void;
  closeModal: () => void;
};

const RegistrationModalContext =
  createContext<RegistrationModalContextValue | null>(null);

const PAYMENT_URL =
  process.env.NEXT_PUBLIC_RAZORPAY_PAYMENT_URL ?? "https://rzp.io/rzp/RIB4o7Ao";

/** Indian mobile: 10 digits, optionally with +91 or 0 prefix. Must start with 6–9. */
function isValidIndianPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 10) return /^[6-9]\d{9}$/.test(digits);
  if (digits.length === 11 && digits.startsWith("0"))
    return /^0[6-9]\d{9}$/.test(digits);
  if (digits.length === 12 && digits.startsWith("91"))
    return /^91[6-9]\d{9}$/.test(digits);
  return false;
}

export function useRegistrationModal() {
  const ctx = useContext(RegistrationModalContext);
  if (!ctx)
    throw new Error(
      "useRegistrationModal must be used within RegistrationModalProvider",
    );
  return ctx;
}

export function RegistrationModalProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [showThankYou, setShowThankYou] = useState(false);

  const openModal = useCallback(() => {
    setSubmitError(null);
    setShowThankYou(false);
    setIsOpen(true);
  }, []);

  useEffect(() => {
    if (!showThankYou || !isOpen) return;
    const t = setTimeout(() => {
      window.location.href = PAYMENT_URL;
    }, 500);
    return () => clearTimeout(t);
  }, [showThankYou, isOpen]);
  const closeModal = useCallback(() => {
    if (!isSubmitting) {
      setSubmitError(null);
      setIsOpen(false);
    }
  }, [isSubmitting]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const data = new FormData(form);
    const name = (data.get("name") as string).trim();
    const phone = (data.get("phone") as string).trim();
    const email = (data.get("email") as string).trim();
    if (!isValidIndianPhone(phone)) {
      setSubmitError("Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    setSubmitError(null);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, email }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setSubmitError(json.error ?? "Failed to save. Please try again.");
        return;
      }
      form.reset();
      setSubmitError(null);
      setShowThankYou(true);
    } catch {
      setSubmitError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RegistrationModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-100 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
              aria-hidden
            />
            <motion.dialog
              open
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-1/2 top-1/2 z-101 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-neutral-100 bg-white p-6 shadow-xl outline-none sm:p-8"
              onClick={(e) => e.stopPropagation()}
              onClose={closeModal}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-playfair text-xl font-semibold text-neutral-900 sm:text-2xl">
                  {showThankYou ? "Thank you!" : "Reserve my seat"}
                </h2>
                {!showThankYou && (
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-full p-2 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {showThankYou ? (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-4 text-center"
                >
                  <CheckCircle
                    className="mx-auto w-14 h-14 text-green-500 mb-4"
                    strokeWidth={1.5}
                  />
                  <p className="font-inter text-neutral-700 text-base mb-1">
                    Your details have been saved.
                  </p>
                  <p className="font-inter text-neutral-500 text-sm">
                    Redirecting you to complete payment…
                  </p>
                </motion.div>
              ) : (
                <>
                  <p className="font-inter text-sm text-neutral-500 mb-6">
                    We&apos;ll share the webinar access details on your
                    registered email.
                  </p>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {submitError && (
                      <p className="font-inter text-sm text-red-600 bg-red-50 rounded-xl px-4 py-2">
                        {submitError}
                      </p>
                    )}
                    <div>
                      <label
                        htmlFor="reg-name"
                        className="font-inter mb-1.5 block text-sm font-medium text-neutral-700"
                      >
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="reg-name"
                        name="name"
                        type="text"
                        required
                        autoComplete="name"
                        className="font-inter w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="reg-phone"
                        className="font-inter mb-1.5 block text-sm font-medium text-neutral-700"
                      >
                        Phone number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="reg-phone"
                        name="phone"
                        type="tel"
                        required
                        autoComplete="tel"
                        minLength={10}
                        maxLength={14}
                        pattern="[0-9+\s\-]{10,14}"
                        title="Enter a valid 10-digit Indian mobile number (e.g. 9876543210)"
                        className="font-inter w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                        placeholder="e.g. 9876543210"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="reg-email"
                        className="font-inter mb-1.5 block text-sm font-medium text-neutral-700"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="reg-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        className="font-inter w-full rounded-xl border border-neutral-200 bg-white px-4 py-3 text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-1 focus:ring-neutral-400"
                        placeholder="you@example.com"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="font-inter mt-2 w-full font-semibold text-white rounded-full bg-neutral-900 py-4 transition-transform hover:-translate-y-[2px] disabled:opacity-60 disabled:pointer-events-none"
                    >
                      {isSubmitting ? "Saving…" : "Continue to payment"}
                    </button>
                  </form>
                </>
              )}
            </motion.dialog>
          </>
        )}
      </AnimatePresence>
    </RegistrationModalContext.Provider>
  );
}
