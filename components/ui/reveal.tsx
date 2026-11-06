"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  amount?: number;
  once?: boolean;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Scroll-triggered fade + rise. Transform animations are disabled globally by
 * <MotionConfig reducedMotion="user">; opacity still fades in gently.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  amount = 0.2,
  once = true,
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount }}
      transition={{ duration: 0.75, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}
