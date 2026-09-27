export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    question: "Como funciona o pagamento?",
    answer:
      "30% de entrada no início do projeto e 70% na entrega do resultado — à vista ou parcelado.",
  },
  {
    question: "O que é o modelo OaaS (Outcome as a Service)?",
    answer:
      "Você paga por um resultado entregue, com preço fechado — não por hora, por licença ou por squad alocado.",
  },
  {
    question: "Quanto tempo leva?",
    answer:
      "Depende do escopo. O prazo é definido na proposta, junto com o preço fechado — em \"O que entregamos\" há as faixas indicativas de cada serviço.",
  },
  {
    question: "E se o escopo mudar no meio do projeto?",
    answer:
      "O preço fechado na proposta cobre o escopo combinado, e o risco de estouro desse escopo é da Cron Tech, não seu. Um pedido novo, fora do que foi combinado, entra numa proposta à parte.",
  },
  {
    question: "O que acontece depois da entrega?",
    answer:
      "Você tem 30 dias de ajustes sem custo. Depois desse prazo, manutenção é cobrada à parte, só se você solicitar.",
  },
  {
    question: "De quem é o código e os acessos?",
    answer:
      "Seus — código, decisões técnicas e credenciais de acesso ficam com você desde a entrega.",
  },
  {
    question: "Como eu começo?",
    answer:
      "Chama no WhatsApp e conta o que precisa — a gente faz o diagnóstico e envia uma proposta com preço fechado.",
  },
];
