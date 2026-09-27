export interface CaseStudy {
  name: string;
  description: string;
  demoUrl: string;
  imageSrc: string;
  imageAlt: string;
}

export const cases: CaseStudy[] = [
  {
    name: "Performance Motion",
    description: "Consultoria esportiva e personal training de alta performance.",
    demoUrl: "https://performance-motion.vercel.app/",
    imageSrc: "/cases/performance-motion.png",
    imageAlt: "Captura de tela do site institucional da Performance Motion",
  },
  {
    name: "Studio Aureum",
    description: "Projetos residenciais e de interiores exclusivos.",
    demoUrl: "https://studioaureum.vercel.app/",
    imageSrc: "/cases/studio-aureum.png",
    imageAlt: "Captura de tela do site institucional da Studio Aureum",
  },
  {
    name: "EvolutionAI",
    description:
      "SaaS B2B que conecta agentes de IA às ferramentas da empresa.",
    demoUrl: "https://evolutionai-virid.vercel.app/",
    imageSrc: "/cases/evolution.png",
    imageAlt: "Captura de tela da landing page da EvolutionAI",
  },
];
