import {
  testimonials as defaultTestimonials,
  type Testimonial,
} from "@/content/testimonials";

const DIFFERENTIATORS = [
  {
    title: "Você fala com quem constrói",
    description:
      "Sem camada de account manager repassando pedido - quem entende o projeto é quem responde.",
  },
  {
    title: "Entrega documentada, sem caixa-preta",
    description:
      "Código, decisões e acessos ficam com você, prontos para qualquer time dar continuidade.",
  },
  {
    title: "Preço fechado por entrega, sem hora extra escondida",
    description:
      "Você sabe o que vai pagar antes de começar - o risco de estouro de escopo é nosso, não seu.",
  },
];

interface DifferentiatorsSectionProps {
  testimonials?: Testimonial[];
}

export function DifferentiatorsSection({
  testimonials = defaultTestimonials,
}: DifferentiatorsSectionProps) {
  return (
    <section className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-xl text-3xl sm:text-4xl">Por que a Cron Tech</h2>

        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {DIFFERENTIATORS.map((item) => (
            <div key={item.title}>
              <h3 className="font-heading text-xl">{item.title}</h3>
              <p className="mt-2 text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {testimonials.length > 0 && (
          <div className="mt-16 grid gap-8 sm:grid-cols-2">
            {testimonials.map((testimonial) => (
              <blockquote
                key={testimonial.author}
                className="rounded-sm bg-card p-6"
              >
                <p className="font-heading text-lg italic">
                  {testimonial.quote}
                </p>
                <footer className="mt-4 text-sm text-muted-foreground">
                  {testimonial.author} - {testimonial.role}
                </footer>
              </blockquote>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
