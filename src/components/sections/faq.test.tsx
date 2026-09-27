import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FaqSection } from "./faq";
import { faq } from "@/content/faq";

describe("FaqSection", () => {
  it("renders every question from faq.ts as an accordion trigger", () => {
    render(<FaqSection />);

    faq.forEach((item) => {
      expect(
        screen.getByRole("button", { name: item.question }),
      ).toBeInTheDocument();
    });
  });

  it("opening a second question closes the first (one open at a time)", async () => {
    const user = userEvent.setup();
    render(<FaqSection />);

    const [first, second] = faq;
    const firstTrigger = screen.getByRole("button", { name: first.question });
    const secondTrigger = screen.getByRole("button", {
      name: second.question,
    });

    await user.click(firstTrigger);
    expect(firstTrigger).toHaveAttribute("aria-expanded", "true");

    await user.click(secondTrigger);
    expect(secondTrigger).toHaveAttribute("aria-expanded", "true");
    expect(firstTrigger).toHaveAttribute("aria-expanded", "false");
  });
});
