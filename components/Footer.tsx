import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative w-full border-t border-neutral-100 bg-white py-8 sm:py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href="#"
          className="relative block h-8 w-[132px] sm:h-9 sm:w-[149px] opacity-90 hover:opacity-100 transition-opacity"
          aria-label="Nirvana by Savart – Home"
        >
          <Image
            src="/Logo.svg"
            alt="Nirvana by Savart"
            width={149}
            height={36}
            className="h-8 w-auto sm:h-9 object-contain object-left"
          />
        </Link>
        <p className="font-inter text-neutral-400 text-xs sm:text-sm">
          © {year} Nirvana by Savart. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
