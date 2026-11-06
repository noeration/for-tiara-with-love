"use client";

import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";
import { Orchid } from "@/components/ui/orchid";
import { PortraitFrame } from "@/components/ui/portrait-frame";
import { GlowOrbs, PetalField, StarField } from "@/components/effects/petal-field";
import { useContent } from "@/components/content/content-context";
import { cn } from "@/lib/utils";
import { MagneticButton } from "@/components/motion/magnetic-button";

interface OpeningProps {
  onOpen: () => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function Opening({ onOpen }: OpeningProps) {
  const birthday = useContent();
  return (
    <motion.section
      className="fixed inset-0 z-[80] overflow-y-auto overflow-x-hidden overscroll-contain"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: "blur(10px)", transition: { duration: 0.8, ease: EASE } }}
    >
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_0%,rgba(201,167,255,0.16)_0%,transparent_55%),radial-gradient(140%_140%_at_50%_100%,rgba(245,201,232,0.12)_0%,transparent_58%),linear-gradient(180deg,#140a22_0%,#11081d_55%,#0d0617_100%)]" />
        <GlowOrbs />
        <StarField count={32} />
        <PetalField count={16} />
      </div>

      <div className="relative mx-auto flex min-h-dvh w-full max-w-6xl flex-col justify-center px-6 py-10 text-center sm:px-10 sm:py-12">
        <div className="flex flex-col items-center gap-8 lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:text-left">
          <div className="flex flex-col items-center gap-6 lg:items-start lg:gap-7">
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: EASE }}
              className="flex flex-col items-center gap-4 lg:flex-row lg:gap-4"
            >
              <Orchid
                className="h-14 w-14 shrink-0 text-orchid/90 lg:h-12 lg:w-12"
                bloom
                strokeWidth={1.6}
              />
              <p className="font-sans text-[10px] uppercase tracking-[0.4em] text-orchid/75 sm:text-xs">
                {birthday.opening.overline}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.1, delay: 0.1, ease: EASE }}
              className="relative"
            >
              <div className="absolute -inset-x-10 -inset-y-8 rounded-full bg-[radial-gradient(circle,rgba(233,224,255,0.16)_0%,transparent_70%)] blur-3xl" />
              <h1 className="relative text-gradient font-serif text-[2.8rem] leading-[0.98] font-light sm:text-7xl md:text-[6.5rem] lg:text-[7.5rem]">
                {birthday.name}
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.22, ease: EASE }}
              className="flex max-w-xl flex-col items-center gap-3 lg:items-start"
            >
              <p className="font-script text-2xl text-lavender sm:text-4xl md:text-[2.6rem]">
                {birthday.opening.greeting}
              </p>
              <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                {birthday.opening.subtitle}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.34, ease: EASE }}
              className="flex flex-col items-center gap-4 lg:items-start"
            >
              <MagneticButton>
                <button
                  onClick={onOpen}
                className={cn(
                  "group relative overflow-hidden rounded-full px-8 py-3 text-sm font-medium tracking-wide text-plum",
                  "bg-linear-to-r from-lavender via-white to-petal",
                  "shadow-[0_20px_60px_-20px_rgba(200,160,255,0.9)] transition-all duration-500",
                  "hover:shadow-[0_24px_70px_-18px_rgba(230,210,255,0.95)]",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lavender focus-visible:ring-offset-2 focus-visible:ring-offset-deep"
                )}
              >
                <span className="relative z-10 flex items-center gap-2">
                  {birthday.opening.cta}
                  <ArrowDown className="h-4 w-4 transition-transform duration-500 group-hover:translate-y-1" />
                </span>
                <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-[1400ms] group-hover:translate-x-full" />
              </button>
              </MagneticButton>
              <p className="text-xs text-muted-foreground">{birthday.opening.hint}</p>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.42, ease: EASE }}
            className="flex w-full justify-center lg:justify-self-center"
          >
            <PortraitFrame
              src={birthday.portrait.src}
              alt={birthday.portrait.alt}
              caption={birthday.portrait.caption}
              placeholder={birthday.portrait.placeholder}
              preload
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
