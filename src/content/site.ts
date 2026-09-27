export interface NavLink {
  label: string;
  href: string;
}

export interface SiteConfig {
  whatsappNumber: string;
  whatsappDisplay: string;
  instagramUrl: string;
  /** TODO: confirmar domínio de produção antes do deploy (usado em metadataBase/OG/sitemap). */
  productionUrl: string;
  navLinks: NavLink[];
}

export const siteConfig: SiteConfig = {
  whatsappNumber: "5531984503647",
  whatsappDisplay: "+55 31 98450-3647",
  instagramUrl: "https://www.instagram.com/cron_tech/",
  productionUrl: "https://crontech.com.br", // TODO: confirmar domínio real
  navLinks: [
    { label: "Serviços", href: "#servicos" },
    { label: "Casos", href: "#casos" },
    { label: "Como funciona", href: "#como-funciona" },
    { label: "FAQ", href: "#faq" },
  ],
};
