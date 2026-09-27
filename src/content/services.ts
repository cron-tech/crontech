export interface Service {
  id: string;
  name: string;
  description: string;
  timeframe: string;
  whatsappMessage: string;
  hasShowcaseCases: boolean;
}

export const services: Service[] = [
  {
    id: "sites-landing-pages",
    name: "Sites e Landing Pages",
    description:
      "Site institucional ou landing page de alta conversão, do zero ao ar, no mesmo padrão dos cases reais abaixo.",
    timeframe: "7 a 15 dias úteis",
    whatsappMessage:
      "Olá! Quero solicitar um orçamento para Sites e Landing Pages.",
    hasShowcaseCases: true,
  },
  {
    id: "sistemas-web-desktop",
    name: "Sistemas Web & Desktop",
    description:
      "Sistema sob medida para um processo específico do seu negócio, rodando na web ou no desktop.",
    timeframe: "20 a 45 dias úteis",
    whatsappMessage:
      "Olá! Quero solicitar um orçamento para Sistemas Web & Desktop.",
    hasShowcaseCases: false,
  },
  {
    id: "mini-erp",
    name: "Mini ERP",
    description:
      "Gestão integrada de estoque, financeiro e vendas num só sistema, sem o custo e a complexidade de um ERP genérico.",
    timeframe: "30 a 60 dias úteis",
    whatsappMessage: "Olá! Quero solicitar um orçamento para um Mini ERP.",
    hasShowcaseCases: false,
  },
  {
    id: "automacoes-rpa",
    name: "Automações (RPA)",
    description:
      "Automação de tarefas manuais repetitivas entre sistemas que hoje dependem de alguém copiar e colar.",
    timeframe: "10 a 20 dias úteis",
    whatsappMessage:
      "Olá! Quero solicitar um orçamento para Automações (RPA).",
    hasShowcaseCases: false,
  },
  {
    id: "agentes-ia",
    name: "Agentes de IA",
    description:
      "Agente de IA integrado ao seu WhatsApp ou sistema interno, treinado para responder ou executar tarefas do seu negócio.",
    timeframe: "15 a 30 dias úteis",
    whatsappMessage: "Olá! Quero solicitar um orçamento para um Agente de IA.",
    hasShowcaseCases: false,
  },
];
