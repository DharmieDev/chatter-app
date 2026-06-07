import { CtaSection } from "./CtaSection";
import { HeroSection } from "./Hero";



export default function Home() {
  return (
    <main className="bg-[#0d0c0b] min-h-screen selection:bg-[#db593b] selection:text-white">
      <HeroSection />
      <CtaSection />
    </main>
  );
}
