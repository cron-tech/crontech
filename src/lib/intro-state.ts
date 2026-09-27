export interface IntroStateInput {
  hasSeenIntro: boolean;
  prefersReducedMotion: boolean;
}

export function shouldSkipIntro({
  hasSeenIntro,
  prefersReducedMotion,
}: IntroStateInput): boolean {
  return hasSeenIntro || prefersReducedMotion;
}
