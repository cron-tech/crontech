import { DarkSection } from "@/components/layout/dark-section";
import { TerminalWindow, type TerminalLine } from "@/components/ui/terminal-window";

const DELIVERY_TERMINAL_LINES: TerminalLine[] = [
  { text: "cron-tech iniciar --projeto sistema-sob-medida" },
  { text: "proposta: preço fechado aprovado" },
  { text: "entrada: 30% confirmada" },
  { text: "build: sucesso · testes: sucesso" },
  { text: "deploy: produção" },
  { text: "saldo: 70% na entrega do resultado" },
  { text: "suporte: 30 dias de ajustes inclusos" },
];

export function DarkTerminalSection() {
  return (
    <DarkSection className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-xl text-3xl sm:text-4xl">
          Preço fechado antes de começar. 30% na entrada, o restante na
          entrega.
        </h2>
        <TerminalWindow
          lines={DELIVERY_TERMINAL_LINES}
          animated
          className="mt-10 w-full max-w-2xl"
        />
      </div>
    </DarkSection>
  );
}
