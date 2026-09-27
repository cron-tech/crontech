import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/sections/hero";
import { TechStrip } from "@/components/sections/tech-strip";
import { PainSection } from "@/components/sections/pain";
import { AudienceFitSection } from "@/components/sections/audience-fit";
import { DarkTerminalSection } from "@/components/sections/dark-terminal";
import { DifferentiatorsSection } from "@/components/sections/differentiators";

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
      </main>
    </>
  );
}
