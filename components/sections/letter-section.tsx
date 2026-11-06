"use client";

import { AnimatePresence, motion } from "motion/react";
import { Heart, Mail, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useContent } from "@/components/content/content-context";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { Orchid } from "@/components/ui/orchid";
import { TextReveal } from "@/components/motion/text-reveal";
import { ParallaxLayer } from "@/components/motion/parallax-layer";

const EASE = [0.22, 1, 0.36, 1] as const;

const FADE_UP = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

const STAGGER = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

type Stage = "closed" | "opening" | "open";

export function LetterSection() {
  const birthday = useContent();
  const [stage, setStage] = useState<Stage>("closed");
  const timer = useRef<number | null>(null);
  const { letter } = birthday;
  const { content } = letter;

  useEffect(() => {
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, []);

  const openEnvelope = () => {
    if (stage !== "closed") return;
    setStage("opening");
    timer.current = window.setTimeout(() => setStage("open"), 720);
  };

  const closeEnvelope = () => {
    if (timer.current) window.clearTimeout(timer.current);
    setStage("closed");
  };

  return (
    <section
      id="surat"
      aria-label={`Surat untuk ${birthday.name}`}
      className="relative scroll-mt-24 overflow-x-clip px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading eyebrow={letter.eyebrow} title={letter.title} />

        <div className="mt-14 flex flex-col items-center">
          <AnimatePresence mode="wait" initial={false}>
            {stage !== "open" ? (
              <motion.div
                key="envelope"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.3 } }}
                transition={{ duration: 0.6, ease: EASE }}
                className="flex w-full flex-col items-center"
              >
                <motion.button
                  type="button"
                  onClick={openEnvelope}
                  aria-expanded={stage === "opening"}
                  aria-label="Buka surat"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="group relative block w-full max-w-md [perspective:1100px]"
                >
                  <span className="absolute -inset-8 rounded-[3rem] bg-[radial-gradient(circle,rgba(216,180,254,0.22)_0%,transparent_70%)] blur-2xl transition group-hover:opacity-100" />

                  <span className="relative block aspect-[1.55] w-full transition-transform duration-500 group-hover:-translate-y-1.5">
                    {/* envelope body */}
                    <span className="absolute inset-0 overflow-hidden rounded-2xl bg-linear-to-br from-[#d9c4f5] via-[#c2a3ea] to-[#9a72c6] shadow-[0_30px_70px_-25px_rgba(0,0,0,0.85)] ring-1 ring-white/25" style={{ transformStyle: "preserve-3d" }}>
                      {/* side folds */}
                      <span
                        className="absolute inset-0 bg-linear-to-br from-white/25 to-transparent"
                        style={{ clipPath: "polygon(0 0, 50% 56%, 0 100%)" }}
                      />
                      <span
                        className="absolute inset-0 bg-linear-to-bl from-white/20 to-transparent"
                        style={{ clipPath: "polygon(100% 0, 50% 56%, 100% 100%)" }}
                      />
                      <span
                        className="absolute inset-0 bg-linear-to-t from-[#b08ada]/60 to-transparent"
                        style={{ clipPath: "polygon(0 100%, 50% 48%, 100% 100%)" }}
                      />

                      {/* letter peeking out */}
                      <motion.span
                        aria-hidden="true"
                        animate={
                          stage === "opening"
                            ? { y: -46, opacity: 1 }
                            : { y: 0, opacity: 0 }
                        }
                        transition={{ duration: 0.6, ease: EASE }}
                        className="absolute inset-x-7 top-5 bottom-7 rounded-lg bg-linear-to-b from-white to-[#efe3ff] shadow-inner"
                      />

                      {/* top flap */}
                      <motion.span
                        aria-hidden="true"
                        animate={{ rotateX: stage === "closed" ? 0 : -172 }}
                        transition={{ duration: 0.7, ease: EASE }}
                        style={{ transformOrigin: "top center", transformStyle: "preserve-3d" }}
                        className="absolute inset-x-0 top-0 z-20 block h-[58%]"
                      >
                        <span
                          className="block h-full w-full bg-linear-to-b from-[#e6d6fb] to-[#b892e2] shadow-[0_2px_10px_rgba(50,20,80,0.25)]"
                          style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
                        />
                      </motion.span>

                      {/* wax seal */}
                      <motion.span
                        animate={{
                          opacity: stage === "closed" ? 1 : 0,
                          scale: stage === "closed" ? 1 : 0,
                          rotate: stage === "closed" ? 0 : 180,
                        }}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="absolute left-1/2 top-[54%] z-30 grid h-14 w-14 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-linear-to-br from-[#6d3fa4] to-[#3d1f63] text-lavender shadow-[0_10px_24px_-8px_rgba(0,0,0,0.9)] ring-2 ring-white/25"
                      >
                        <Heart className="h-5 w-5 fill-current" />
                      </motion.span>

                      {stage !== "closed" ? (
                        <motion.span
                          aria-hidden="true"
                          initial={{ opacity: 1, scale: 0.6 }}
                          animate={{ opacity: 0, scale: 2.2 }}
                          transition={{ duration: 0.7, ease: EASE }}
                          className="pointer-events-none absolute left-1/2 top-[54%] z-40 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(233,224,255,0.55)_0%,transparent_70%)]"
                        />
                      ) : null}
                    </span>
                  </span>
                </motion.button>

                <Reveal delay={0.15}>
                  <p className="mt-7 flex items-center justify-center gap-2 font-sans text-xs uppercase tracking-[0.24em] text-muted-foreground">
                    <Mail className="h-3.5 w-3.5" />
                    {letter.hint}
                  </p>
                </Reveal>
              </motion.div>
            ) : (
              <motion.div
                key="letter"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: EASE }}
                className="w-full max-w-2xl"
              >
                <motion.article
                  variants={STAGGER}
                  initial="hidden"
                  animate="show"
                  className="paper relative overflow-hidden rounded-3xl px-6 py-10 sm:px-12 sm:py-14"
                >
                  <ParallaxLayer speed={30} className="pointer-events-none absolute -right-10 -top-8 h-40 w-40">
                  <Orchid
                    className="h-full w-full text-[#7c4a9e]/15"
                    strokeWidth={1}
                  />
                </ParallaxLayer>

                  <motion.p
                    variants={FADE_UP}
                    className="font-serif text-xl text-[#4a2a6b] italic sm:text-2xl"
                  >
                    {content.greeting}
                  </motion.p>

                  <div className="mt-6 space-y-4">
                    {content.paragraphs.map((paragraph) => (
                      <motion.p
                        key={paragraph.slice(0, 24)}
                        variants={FADE_UP}
                        className="text-[15px] leading-8 text-[#3d2a52]/90 sm:text-base"
                      >
                        <TextReveal text={paragraph} mode="words" />
                      </motion.p>
                    ))}
                  </div>

                  <motion.div
                    variants={FADE_UP}
                    className="my-8 rounded-2xl border border-[#b58fe0]/40 bg-[#ede1ff]/70 px-5 py-6 sm:px-7"
                  >
                    <p className="text-center font-sans text-[10px] uppercase tracking-[0.3em] text-[#6b4a8c]">
                      {content.poem.title}
                    </p>
                    <div className="mt-4 space-y-1.5 text-center">
                      {content.poem.lines.map((line, index) => (
                        <p
                          key={`${index}-${line.slice(0, 12)}`}
                          className="font-serif text-lg leading-relaxed text-[#43285f] italic sm:text-xl"
                        >
                          <TextReveal text={line} mode="words" />
                        </p>
                      ))}
                    </div>
                  </motion.div>

                  <motion.p
                    variants={FADE_UP}
                    className="text-[15px] leading-8 text-[#3d2a52]/90 sm:text-base"
                  >
                    {content.closing}
                  </motion.p>

                  <motion.div variants={FADE_UP} className="mt-2">
                    <p className="font-script text-3xl text-[#4a2a6b] sm:text-4xl">
                      {content.signature}
                    </p>
                    <p className="mt-1 font-serif text-lg text-[#5c3d7d] italic">
                      — {content.from}
                    </p>
                  </motion.div>
                </motion.article>

                <div className="mt-6 text-center">
                  <button
                    type="button"
                    onClick={closeEnvelope}
                    className="inline-flex items-center gap-2 rounded-full px-4 py-2 font-sans text-xs text-muted-foreground transition hover:text-lavender"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Lipat kembali suratnya
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
