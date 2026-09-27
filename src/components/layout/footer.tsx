import Image from "next/image";
import { siteConfig } from "@/content/site";
import { buildWhatsAppLink } from "@/lib/whatsapp";

// lucide-react (1.48.0) dropped brand/social icons - inline SVGs matching its
// 24x24 stroke-based style (SPEC_DEVIATION: design.md assumed lucide-react
// would have an Instagram icon; it no longer ships brand icons at all, so the
// WhatsApp icon below is hand-drawn the same way for consistency).
function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width={18}
      height={18}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3a9 9 0 0 0-7.75 13.5L3 21l4.5-1.25A9 9 0 1 0 12 3z" />
      <path d="M8.5 9.3c0 3.5 2.7 6.2 6.2 6.2.5 0 .9-.4.9-.9v-.7c0-.3-.2-.5-.4-.6l-1.5-.6c-.3-.1-.6 0-.8.2l-.3.4a5 5 0 0 1-2.1-2.1l.4-.3c.2-.2.3-.5.2-.8l-.6-1.5c-.1-.3-.4-.4-.6-.4h-.7c-.5 0-.9.4-.9.9z" />
    </svg>
  );
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/60 px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center gap-2">
              <Image
                src="/brand/logo-crontech.webp"
                alt=""
                width={28}
                height={28}
              />
              <span className="font-heading text-lg">Cron Tech</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Sites, sistemas sob medida, automações e agentes de IA —
              resultado pronto, com preço fechado.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={siteConfig.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram da Cron Tech"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-foreground/80 transition-colors hover:text-foreground"
            >
              <InstagramIcon />
            </a>
            <a
              href={buildWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp da Cron Tech"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 text-foreground/80 transition-colors hover:text-foreground"
            >
              <WhatsAppIcon />
            </a>
          </div>

          <nav aria-label="Navegação do rodapé" className="sm:text-right">
            <ul className="flex flex-col gap-2 text-sm">
              {siteConfig.navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="text-foreground/80 transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6">
          <p className="text-sm text-muted-foreground">
            © {year} Cron Tech. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
