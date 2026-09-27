import Image from "next/image";
import { Button } from "@/components/ui/button";
import { cases } from "@/content/cases";
import { services } from "@/content/services";

export function CasesSection() {
  const illustrativeServices = services.filter(
    (service) => !service.hasShowcaseCases,
  );

  return (
    <section id="casos" className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-xl text-3xl sm:text-4xl">Casos reais</h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {cases.map((project) => (
            <div key={project.name}>
              <div className="overflow-hidden rounded-sm border border-border/60">
                <Image
                  src={project.imageSrc}
                  alt={project.imageAlt}
                  width={945}
                  height={436}
                  className="h-auto w-full"
                />
              </div>
              <h3 className="mt-4 font-heading text-xl">{project.name}</h3>
              <p className="mt-2 text-muted-foreground">
                {project.description}
              </p>
              <Button asChild variant="outline" size="sm" className="mt-4">
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver demo
                </a>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2">
          {illustrativeServices.map((service) => (
            <div key={service.id}>
              <h3 className="font-heading text-lg">{service.name}</h3>
              <p className="mt-2 text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
