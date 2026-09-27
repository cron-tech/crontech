import { siteConfig } from "@/content/site";

const DEFAULT_MESSAGE =
  "Olá! Quero saber mais sobre os serviços da Cron Tech.";

export function buildWhatsAppLink(message: string = DEFAULT_MESSAGE): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${siteConfig.whatsappNumber}?text=${encodedMessage}`;
}
