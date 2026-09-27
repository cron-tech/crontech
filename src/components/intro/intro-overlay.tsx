"use client";

import { useEffect, useLayoutEffect, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";
import { shouldSkipIntro } from "@/lib/intro-state";

// Kept in sync with the inline script in src/app/layout.tsx (AD-001).
const INTRO_SESSION_KEY = "crontech:intro-seen";
const BRAND_NAME = "Cron Tech";
const TYPEWRITER_LETTER_DELAY_MS = 80;
const TYPEWRITER_HOLD_MS = 700;

const letterVariants = {
  hidden: { opacity: 0 },
  visible: (index: number) => ({
    opacity: 1,
    transition: { delay: (index * TYPEWRITER_LETTER_DELAY_MS) / 1000 },
  }),
};

function subscribeNever() {
  return () => {};
}

// No SSR value to reconcile against - the overlay is a client-only addition
// layered on top of the already-server-rendered home (AD-001).
function getServerSnapshot() {
  return false;
}

function getShouldPlaySnapshot() {
  let hasSeenIntro: boolean;
  try {
    hasSeenIntro = sessionStorage.getItem(INTRO_SESSION_KEY) === "1";
  } catch {
    hasSeenIntro = true;
  }
  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  return !shouldSkipIntro({ hasSeenIntro, prefersReducedMotion });
}

export function IntroOverlay() {
  const shouldPlay = useSyncExternalStore(
    subscribeNever,
    getShouldPlaySnapshot,
    getServerSnapshot,
  );
  const [dismissed, setDismissed] = useState(false);
  const visible = shouldPlay && !dismissed;
  const prefersReducedMotion = useReducedMotion();

  useLayoutEffect(() => {
    // Dev Strict Mode remounts once and resets <html> to only the attributes
    // React itself manages, clearing the inline script's data-intro (see
    // node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md,
    // "Re-applying attributes in development"). No-op in production.
    if (shouldPlay) {
      document.documentElement.setAttribute("data-intro", "show");
    }
  }, [shouldPlay]);

  useEffect(() => {
    if (!visible) return;

    const totalMs =
      BRAND_NAME.length * TYPEWRITER_LETTER_DELAY_MS + TYPEWRITER_HOLD_MS;
    const timeout = setTimeout(dismiss, totalMs);
    return () => clearTimeout(timeout);
  }, [visible]);

  function dismiss() {
    try {
      sessionStorage.setItem(INTRO_SESSION_KEY, "1");
    } catch {
      // sessionStorage unavailable (e.g. private browsing) - nothing to persist.
    }
    setDismissed(true);
  }

  if (!shouldPlay) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          // Mirrors DarkSection's class recipe (AD-002); a plain <DarkSection>
          // can't carry the exit-fade animation below.
          className="intro-overlay dark bg-background text-foreground fixed inset-0 z-50 flex flex-col items-center justify-center gap-8"
          role="presentation"
          onClick={dismiss}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "repeating-linear-gradient(to right, var(--brand-lime) 0 1px, transparent 1px 64px), repeating-linear-gradient(to bottom, var(--brand-lime) 0 1px, transparent 1px 64px)",
              opacity: 0.12,
            }}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            <div
              className="h-72 w-72 rounded-full blur-3xl"
              style={{ backgroundColor: "var(--brand-lime)", opacity: 0.35 }}
            />
          </div>

          <motion.div
            className="relative h-24 w-24"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Image
              src="/brand/logo-crontech.webp"
              alt="Cron Tech"
              width={96}
              height={96}
            />
          </motion.div>

          <p
            className="relative font-heading text-4xl italic sm:text-5xl"
            aria-label={BRAND_NAME}
          >
            {BRAND_NAME.split("").map((letter, index) => (
              <motion.span
                key={index}
                custom={index}
                initial="hidden"
                animate="visible"
                variants={letterVariants}
                aria-hidden="true"
              >
                {letter === " " ? " " : letter}
              </motion.span>
            ))}
          </p>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="relative"
            onClick={(event) => {
              event.stopPropagation();
              dismiss();
            }}
          >
            Pular
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
