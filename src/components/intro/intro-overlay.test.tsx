import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { IntroOverlay } from "./intro-overlay";

const INTRO_SESSION_KEY = "crontech:intro-seen";

function mockPrefersReducedMotion(matches: boolean) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    configurable: true,
    value: (query: string) => ({
      matches,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }),
  });
}

describe("IntroOverlay", () => {
  beforeEach(() => {
    sessionStorage.clear();
    mockPrefersReducedMotion(false);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it("renders the overlay and starts the typewriter animation when the session is empty and reduced motion is off", () => {
    render(<IntroOverlay />);

    expect(screen.getByRole("presentation")).toBeInTheDocument();
    expect(screen.getByLabelText("Cron Tech")).toBeInTheDocument();
  });

  it("does not render when the intro was already seen this session", () => {
    sessionStorage.setItem(INTRO_SESSION_KEY, "1");

    render(<IntroOverlay />);

    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  });

  it("does not render when prefers-reduced-motion is active", () => {
    mockPrefersReducedMotion(true);

    render(<IntroOverlay />);

    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  });

  it("clicking the skip control records the session flag and dismisses the overlay", async () => {
    const user = userEvent.setup();
    render(<IntroOverlay />);

    await user.click(screen.getByRole("button", { name: "Pular" }));

    expect(sessionStorage.getItem(INTRO_SESSION_KEY)).toBe("1");
    expect(screen.queryByRole("presentation")).not.toBeInTheDocument();
  });
});
