"use client";

import Image from "next/image";
import Link from "next/link";
import { useRegistrationModal } from "@/contexts/RegistrationModalContext";

export default function Header() {
  const { openModal } = useRegistrationModal();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full px-4 pt-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-[960px] items-center justify-between">
        <div className="flex shrink-0 items-center">
          <Link href="#" className="relative block h-9 w-[149px]">
            <Image
              src="/Logo.svg"
              alt="Nirvana by Savart"
              width={149}
              height={36}
              className="h-9 w-auto object-contain object-left"
              priority
            />
          </Link>
        </div>

        <button
          type="button"
          onClick={openModal}
          className="font-inter font-semibold text-white px-6 py-3 sm:px-8 sm:py-4 rounded-full min-h-[44px] sm:min-h-[52px] inline-flex items-center justify-center transition-transform duration-300 ease-out hover:-translate-y-[2px] bg-neutral-900 text-sm sm:text-base shrink-0"
        >
          Reserve my seat
        </button>
      </div>
    </header>
  );
}
