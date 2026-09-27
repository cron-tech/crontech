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

// Layout guide (docs/references/crontech-ref-home.webp): inner frame edges as
// percent of the viewport. The two horizontal lines double as the frame's top
// and bottom edges, extended full-bleed; FRAME_CORNERS mark where the
// frame's vertical sides meet those lines.
const FRAME_X = [8, 92];
// Top inset larger than bottom's: leaves clearance for the 5-item services
// list in the top-right corner (taller than the 2-line text in the bottom
// corners) so it never crosses the top guide line/dot.
const FRAME_Y = [22, 82];
const FRAME_CORNERS = [
  { x: FRAME_X[0], y: FRAME_Y[0] },
  { x: FRAME_X[1], y: FRAME_Y[0] },
  { x: FRAME_X[0], y: FRAME_Y[1] },
  { x: FRAME_X[1], y: FRAME_Y[1] },
];

const SERVICES = [
  "sites",
  "sistemas",
  "mini erp",
  "automações",
  "agentes de IA",
];

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
          // Mirrors DarkSection's class recipe (AD-002) for text-foreground
          // token scoping; the background itself is a darker one-off (see
          // style below), not the --background token DarkSection would use.
          className="intro-overlay dark text-foreground fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 overflow-hidden"
          style={{
            backgroundColor:
              "color-mix(in srgb, var(--brand-dark) 55%, black)",
          }}
          role="presentation"
          onClick={dismiss}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.4 }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div
              className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl"
              style={{ backgroundColor: "var(--brand-mid)", opacity: 0.25 }}
            />
            <div
              className="absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl"
              style={{ backgroundColor: "var(--brand-lime)", opacity: 0.2 }}
            />
            <div
              className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full blur-3xl"
              style={{ backgroundColor: "var(--brand-lime)", opacity: 0.2 }}
            />
            <div
              className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full blur-3xl"
              style={{ backgroundColor: "var(--brand-mid)", opacity: 0.25 }}
            />
          </div>

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
          >
            <div
              className="absolute inset-x-0 h-px"
              style={{
                top: `${FRAME_Y[0]}%`,
                backgroundColor: "var(--brand-lime)",
                opacity: 0.18,
              }}
            />
            <div
              className="absolute inset-x-0 h-px"
              style={{
                top: `${FRAME_Y[1]}%`,
                backgroundColor: "var(--brand-lime)",
                opacity: 0.18,
              }}
            />
            <div
              className="absolute w-px"
              style={{
                left: `${FRAME_X[0]}%`,
                top: `${FRAME_Y[0]}%`,
                height: `${FRAME_Y[1] - FRAME_Y[0]}%`,
                backgroundColor: "var(--brand-lime)",
                opacity: 0.18,
              }}
            />
            <div
              className="absolute w-px"
              style={{
                left: `${FRAME_X[1]}%`,
                top: `${FRAME_Y[0]}%`,
                height: `${FRAME_Y[1] - FRAME_Y[0]}%`,
                backgroundColor: "var(--brand-lime)",
                opacity: 0.18,
              }}
            />
            {FRAME_CORNERS.map((corner, index) => (
              <span
                key={index}
                className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
                style={{
                  left: `${corner.x}%`,
                  top: `${corner.y}%`,
                  backgroundColor: "var(--brand-lime)",
                  opacity: 0.6,
                }}
              />
            ))}
          </div>

          <p
            aria-hidden="true"
            className="absolute top-4 left-4 font-heading text-xs sm:top-6 sm:left-6 sm:text-sm"
          >
            outcome <em className="italic">as a service</em>
          </p>

          <ul
            aria-hidden="true"
            className="absolute top-4 right-4 hidden flex-col items-end gap-0.5 text-right font-heading text-sm leading-tight sm:top-6 sm:right-6 md:flex"
          >
            {SERVICES.map((service, index) => (
              <li
                key={service}
                className={index % 2 === 0 ? "opacity-90" : "opacity-45"}
              >
                {service}
              </li>
            ))}
          </ul>

          <p
            aria-hidden="true"
            className="absolute bottom-4 left-4 font-heading text-xs leading-snug sm:bottom-6 sm:left-6 sm:text-sm"
          >
            resultado pronto,
            <br />
            cobrado pela{" "}
            <em className="italic" style={{ color: "var(--brand-lime)" }}>
              entrega
            </em>
            .
          </p>

          <p
            aria-hidden="true"
            className="absolute right-4 bottom-4 font-heading text-xs sm:right-6 sm:bottom-6 sm:text-sm"
          >
            cron <em className="italic">tech</em>
          </p>

          <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
            <motion.div
              className="relative h-16 w-16 sm:h-20 sm:w-20"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Image
                src="/brand/logo-crontech.webp"
                alt="Cron Tech"
                width={80}
                height={80}
              />
            </motion.div>

            <p
              className="font-heading text-4xl italic sm:text-6xl"
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
          </div>

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
