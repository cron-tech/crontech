import { Button } from "@/components/ui/button";
import {
  TerminalWindow,
  type TerminalLine,
} from "@/components/ui/terminal-window";
import { buildWhatsAppLink } from "@/lib/whatsapp";

const HERO_TERMINAL_LINES: TerminalLine[] = [
  { text: "cron-tech entregar \\" },
  { text: "--sites --sistemas-sob-medida \\", prompt: false },
  { text: "--automacoes --agentes-ia", prompt: false },
  { text: "aguardando aprovação do cliente" },
  { text: "saldo final na entrega do resultado" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-40 pb-20">
      <div className="mx-auto flex max-w-5xl flex-col gap-10 md:flex-row md:items-center md:justify-between">
        <div className="max-w-xl">
          <p className="font-mono text-sm text-foreground">
            $ outcome-as-a-service
          </p>
          <h1 className="mt-4 text-4xl leading-tight sm:text-5xl">
            Você entrega o problema. A Cron Tech entrega o resultado pronto.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Sites, sistemas, automações e agentes de IA sob o modelo Outcome
            as a Service: preço fechado, 30% de entrada e o saldo na
            entrega, sem licença de uso.
          </p>
          <Button asChild size="lg" className="mt-8">
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
            >
              Fale com a gente
            </a>
          </Button>
        </div>

        <TerminalWindow
          lines={HERO_TERMINAL_LINES}
          animated
          className="w-full max-w-sm shrink-0"
        />
      </div>
    </section>
  );
}
