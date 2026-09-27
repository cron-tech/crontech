import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/content/site";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Button } from "@/components/ui/button";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-4 z-40 flex justify-center px-4">
      <nav className="flex items-center gap-6 rounded-full border border-border/60 bg-background/80 px-4 py-2 shadow-sm backdrop-blur">
        <Link href="/" aria-label="Cron Tech" className="flex items-center">
          <Image
            src="/brand/logo-crontech.webp"
            alt=""
            width={28}
            height={28}
          />
        </Link>
        <ul className="hidden items-center gap-6 text-sm font-medium md:flex">
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
        <Button asChild size="sm" className="hidden rounded-full md:inline-flex">
          <a
            href={buildWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
          >
            Fale com a gente
          </a>
        </Button>
        <MobileMenu links={siteConfig.navLinks} />
      </nav>
    </header>
  );
}
