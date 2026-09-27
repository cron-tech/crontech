import { Button } from "@/components/ui/button";
import { services } from "@/content/services";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function ServicesSection() {
  return (
    <section id="servicos" className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-xl text-3xl sm:text-4xl">O que entregamos</h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <div key={service.id} className="border-t-2 border-primary pt-4">
              <h3 className="font-heading text-xl">{service.name}</h3>
              <p className="mt-2 text-muted-foreground">
                {service.description}
              </p>
              <p className="mt-3 font-mono text-sm text-primary">
                {service.timeframe}
              </p>
              <Button asChild size="sm" className="mt-4">
                <a
                  href={buildWhatsAppLink(service.whatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Solicitar orçamento
                </a>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
