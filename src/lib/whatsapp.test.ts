import { describe, expect, it } from "vitest";
import { buildWhatsAppLink } from "./whatsapp";
import { siteConfig } from "@/content/site";

describe("buildWhatsAppLink", () => {
  it("returns a wa.me URL with the real number and a default message when called without arguments", () => {
    const url = buildWhatsAppLink();

    expect(url.startsWith(`https://wa.me/${siteConfig.whatsappNumber}?text=`)).toBe(true);
    expect(url).not.toContain("text=&");
    expect(new URL(url).searchParams.get("text")).not.toBe("");
  });

  it("returns a wa.me URL with a simple custom message correctly encoded", () => {
    const url = buildWhatsAppLink("Quero um orçamento");

    expect(url).toBe(
      `https://wa.me/${siteConfig.whatsappNumber}?text=Quero%20um%20or%C3%A7amento`,
    );
  });

  it("encodes spaces, accents, and special characters in the message", () => {
    const message = "Serviço: Sites & Landing Pages — 100% remoto?";
    const url = buildWhatsAppLink(message);

    expect(new URL(url).searchParams.get("text")).toBe(message);
  });
});
