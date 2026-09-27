import { describe, expect, it } from "vitest";
import { shouldSkipIntro } from "./intro-state";

describe("shouldSkipIntro", () => {
  it("returns true when the intro was already seen this session and reduced motion is off", () => {
    expect(
      shouldSkipIntro({ hasSeenIntro: true, prefersReducedMotion: false }),
    ).toBe(true);
  });

  it("returns true when the intro was not seen yet but reduced motion is on", () => {
    expect(
      shouldSkipIntro({ hasSeenIntro: false, prefersReducedMotion: true }),
    ).toBe(true);
  });

  it("returns false when the intro was not seen and reduced motion is off", () => {
    expect(
      shouldSkipIntro({ hasSeenIntro: false, prefersReducedMotion: false }),
    ).toBe(false);
  });

  it("returns true when both the intro was already seen and reduced motion is on", () => {
    expect(
      shouldSkipIntro({ hasSeenIntro: true, prefersReducedMotion: true }),
    ).toBe(true);
  });
});
