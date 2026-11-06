"use client";

import { motion, type Variants } from "motion/react";
import { useMemo } from "react";
import { blurFocus } from "./variants";

interface TextRevealProps {
  text: string;
  className?: string;
  /** "words" | "lines" (lines split by \\n) */
  mode?: "words" | "lines";
  delay?: number;
  once?: boolean;
  amount?: number;
}

/**
 * Reveals text word-by-word or line-by-line with blur-to-focus.
 */
export function TextReveal({
  text,
  className,
  mode = "words",
  delay = 0,
  once = true,
  amount = 0.3,
}: TextRevealProps) {
  const tokens = useMemo(() => {
    if (mode === "lines") return text.split("\n").filter(Boolean);
    return text.split(/\s+/).filter(Boolean);
  }, [text, mode]);

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: mode === "words" ? 0.04 : 0.12, delayChildren: delay } },
  };

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={container}
      style={{ display: "inline-block" }}
    >
      {tokens.map((token, i) => (
        <motion.span
          key={`${token}-${i}`}
          variants={blurFocus}
          style={{ display: "inline-block", whiteSpace: "pre" }}
        >
          {token}
          {mode === "words" ? "\u00A0" : ""}
        </motion.span>
      ))}
    </motion.span>
  );
}
