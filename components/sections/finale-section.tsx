"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "motion/react";
import { ArrowUp, Sparkles } from "lucide-react";
import { useContent } from "@/components/content/content-context";
import { Orchid } from "@/components/ui/orchid";
import { Reveal } from "@/components/ui/reveal";
import { Confetti } from "@/components/effects/confetti";
import { StarField } from "@/components/effects/petal-field";
import { TextReveal } from "@/components/motion/text-reveal";

export function FinaleSection() {
  const birthday = useContent();
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const inView = useInView(sectionRef, { once: true, amount: 0.35 });
  const [burst, setBurst] = useState(0);
  const celebrated = useRef(false);

  useEffect(() => {
    if (!inView || celebrated.current) return;
    celebrated.current = true;
    setBurst((value) => value + 1);
  }, [inView, reduce]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="penutup"
      aria-label="Penutup"
      className="relative scroll-mt-24 overflow-hidden px-5 pb-32 pt-24 sm:px-8 md:pb-40 md:pt-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(201,167,255,0.14)_0%,transparent_60%)]"
      />
      <StarField count={26} />
      <Confetti fireKey={burst} />

      <div className="relative mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <Orchid className="h-32 w-32 text-orchid/80 sm:h-40 sm:w-40" bloom strokeWidth={1.2} />
        </motion.div>

        <Reveal delay={0.05}>
          <p className="mt-6 font-sans text-[10px] uppercase tracking-[0.4em] text-orchid/75 sm:text-xs">
            {birthday.finale.eyebrow}
          </p>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mt-4 font-serif text-[2.2rem] leading-[1.05] font-light text-gradient sm:text-6xl md:text-7xl">
            {birthday.finale.title}
          </h2>
        </Reveal>

        <div className="mt-8 space-y-4">
          {birthday.finale.message.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 24)} delay={0.08 * index}>
              <p className="text-[15px] leading-8 text-lavender/80 sm:text-base">
                <TextReveal text={paragraph} mode="words" />
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <p className="mt-10 font-script text-4xl text-lavender sm:text-5xl">
            {birthday.finale.closing}
          </p>
          <p className="mt-2 font-serif text-lg text-muted-foreground italic">
            — {birthday.finale.signature}
          </p>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => setBurst((value) => value + 1)}
              className="group inline-flex items-center gap-2 rounded-full bg-linear-to-r from-lavender via-white to-petal px-7 py-3.5 font-sans text-sm font-medium text-plum shadow-[0_20px_60px_-20px_rgba(200,160,255,0.9)] transition hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              {birthday.finale.celebrate}
            </button>
            <button
              type="button"
              onClick={scrollToTop}
              className="glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 font-sans text-sm text-lavender transition hover:border-orchid/35 hover:text-white"
            >
              <ArrowUp className="h-4 w-4" />
              {birthday.finale.replay}
            </button>
          </div>
        </Reveal>

        <Reveal delay={0.25}>
          <div className="mt-16 flex flex-col items-center gap-3">
            <span className="hairline w-24" />
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground/70">
              dibuat dengan cinta, untuk {birthday.name}
            </p>
            <p className="font-script text-xl text-orchid/70">{birthday.site.title}</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
