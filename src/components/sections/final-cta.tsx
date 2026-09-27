import { Button } from "@/components/ui/button";
import { DarkSection } from "@/components/layout/dark-section";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function FinalCtaSection() {
  return (
    <DarkSection className="px-4 py-24 text-center">
      <div className="mx-auto max-w-2xl">
        <h2 className="text-3xl sm:text-4xl">
          Pronto para tirar seu projeto do papel?
        </h2>
        <p className="mt-4 text-lg opacity-80">
          Preço fechado, 30% de entrada e o saldo na entrega — fale com a
          gente agora.
        </p>
        <Button asChild size="lg" className="mt-8">
          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Fale com a gente no WhatsApp
          </a>
        </Button>
      </div>
    </DarkSection>
  );
}
