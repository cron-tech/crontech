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

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <Hero />
        <TechStrip />
        <PainSection />
        <AudienceFitSection />
        <DarkTerminalSection />
        <DifferentiatorsSection />
        <CasesSection />
        <ServicesSection />
        <HowItWorksSection />
      </main>
    </>
  );
}
