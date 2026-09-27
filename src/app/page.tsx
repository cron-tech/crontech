import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero";
import { TechStrip } from "@/components/sections/tech-strip";
import { PainSection } from "@/components/sections/pain";
import { AudienceFitSection } from "@/components/sections/audience-fit";
import { DarkTerminalSection } from "@/components/sections/dark-terminal";
import { DifferentiatorsSection } from "@/components/sections/differentiators";
import { CasesSection } from "@/components/sections/cases";
import { ServicesSection } from "@/components/sections/services";
import { HowItWorksSection } from "@/components/sections/how-it-works";
import { FaqSection } from "@/components/sections/faq";
import { FinalCtaSection } from "@/components/sections/final-cta";
import { Footer } from "@/components/layout/footer";
import { Reveal } from "@/components/ui/reveal";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <TechStrip />
        <Reveal>
          <PainSection />
        </Reveal>
        <Reveal>
          <AudienceFitSection />
        </Reveal>
        <Reveal>
          <DarkTerminalSection />
        </Reveal>
        <Reveal>
          <DifferentiatorsSection />
        </Reveal>
        <Reveal>
          <CasesSection />
        </Reveal>
        <Reveal>
          <ServicesSection />
        </Reveal>
        <Reveal>
          <HowItWorksSection />
        </Reveal>
        <Reveal>
          <FaqSection />
        </Reveal>
        <Reveal>
          <FinalCtaSection />
        </Reveal>
      </main>
      <Reveal>
        <Footer />
      </Reveal>
    </>
  );
}
