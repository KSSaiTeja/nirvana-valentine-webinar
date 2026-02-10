import { HeroScroll } from "@/components/HeroScroll";
import { NotForSection } from "@/components/NotForSection";
import { WhyThisMattersSection } from "@/components/WhyThisMattersSection";
import { In90MinutesSection } from "@/components/In90MinutesSection";
import { WebinarDetailsSection } from "@/components/WebinarDetailsSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <main className="min-h-screen w-full bg-white">
        <HeroScroll />
        <NotForSection />
        <WhyThisMattersSection />
        <In90MinutesSection />
        <WebinarDetailsSection />
      </main>
      <Footer />
    </>
  );
}
