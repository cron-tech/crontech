import { DarkSection } from "@/components/layout/dark-section";
import { TerminalWindow, type TerminalLine } from "@/components/ui/terminal-window";

const DELIVERY_TERMINAL_LINES: TerminalLine[] = [
  { text: "cron-tech deploy --projeto sistema-interno" },
  { text: "build: sucesso" },
  { text: "testes: sucesso" },
  { text: "deploy: produção" },
  { text: "fatura: emitida após a entrega, não antes" },
];

export function DarkTerminalSection() {
  return (
    <DarkSection className="px-4 py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="max-w-xl text-3xl sm:text-4xl">
          Você recebe o projeto pronto. A cobrança só chega depois da
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
