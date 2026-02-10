import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import Header from "@/components/Header";
import { RegistrationModalProvider } from "@/contexts/RegistrationModalContext";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Nirvana by Savart | Valentine Webinar | Gift Clarity — Not Just Chocolates",
  description:
    "90-min live webinar, Feb 14, 2026. Decode market chaos. EU-India & US-India deals, Budget impact, portfolio framework. ₹499 incl. GST. No tips. No predictions.",
  icons: {
    icon: [
      { url: "/favicon/favicon.ico", sizes: "any" },
      { url: "/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/favicon/apple-touch-icon.png",
  },
  manifest: "/favicon/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white">
      <body
        className={`${playfair.variable} ${inter.variable} antialiased bg-white text-neutral-900`}
      >
        <SmoothScroll>
          <RegistrationModalProvider>
            <Header />
            {children}
          </RegistrationModalProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
