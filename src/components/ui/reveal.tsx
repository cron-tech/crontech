"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
}

// Discreet, utilitarian scroll-in for below-the-fold sections only (AD-004).
// Hero/Navbar/TechStrip never get this wrapper - the first paint can't wait
// on an in-view animation to finish.
export function Reveal({ children, className }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      // "reveal" is a stable hook for the <noscript> override in
      // src/app/layout.tsx: framer-motion renders `initial` (opacity:0,
      // translated) as an inline style in the server HTML itself, so without
      // JS ever running to animate it into view, the content stays invisible
      // forever (LP-01 AC6 - home must work with JS disabled).
      className={cn("reveal", className)}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}
