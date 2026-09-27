"use client";

import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

const CHAR_DELAY_MS = 30;
const LINE_PAUSE_MS = 250;
const PROMPT_PREFIX = "$ ";
const CONTINUATION_PREFIX = "    ";

export interface TerminalLineObject {
  text: string;
  /** false = continuation line (no "$ " prompt, indented instead). Default: true. */
  prompt?: boolean;
}

export type TerminalLine = string | TerminalLineObject;

interface TerminalWindowProps {
  lines: TerminalLine[];
  animated?: boolean;
  className?: string;
}

function toFullLine(line: TerminalLine): string {
  if (typeof line === "string") return `${PROMPT_PREFIX}${line}`;
  const prompt = line.prompt ?? true;
  return `${prompt ? PROMPT_PREFIX : CONTINUATION_PREFIX}${line.text}`;
}

export function TerminalWindow({
  lines,
  animated = false,
  className,
}: TerminalWindowProps) {
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = animated && !prefersReducedMotion;
  const fullLines = lines.map(toFullLine);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-sm border border-white/10 bg-[var(--brand-dark)] text-[var(--brand-cream)] shadow-lg",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2"
      >
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
      </div>
      <div className="space-y-1.5 overflow-x-auto px-4 py-4 font-mono text-sm whitespace-pre">
        {fullLines.map((fullLine, lineIndex) => {
          if (!shouldAnimate) {
            return <p key={lineIndex}>{fullLine}</p>;
          }

          const charsBefore = fullLines
            .slice(0, lineIndex)
            .reduce((sum, previousLine) => sum + previousLine.length, 0);

          return (
            <p key={lineIndex}>
              {fullLine.split("").map((char, charIndex) => (
                <motion.span
                  key={charIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    delay:
                      (charsBefore * CHAR_DELAY_MS +
                        lineIndex * LINE_PAUSE_MS +
                        charIndex * CHAR_DELAY_MS) /
                      1000,
                    duration: 0.01,
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </p>
          );
        })}
      </div>
    </div>
  );
}
