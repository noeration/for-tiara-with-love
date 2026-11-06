"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";

export interface LightboxItem {
  src: string;
  alt: string;
  title?: string;
  caption?: string;
  description?: string;
  meta?: string;
}

interface LightboxProps {
  items: LightboxItem[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

const EASE = [0.22, 1, 0.36, 1] as const;

export function Lightbox({ items, index, onClose, onNavigate }: LightboxProps) {
  const open = index !== null;
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);

  const goNext = useCallback(() => {
    if (index === null || items.length === 0) return;
    onNavigate((index + 1) % items.length);
  }, [index, items.length, onNavigate]);

  const goPrev = useCallback(() => {
    if (index === null || items.length === 0) return;
    onNavigate((index - 1 + items.length) % items.length);
  }, [index, items.length, onNavigate]);

  useEffect(() => {
    if (!open) return;

    restoreRef.current = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const frame = requestAnimationFrame(() => closeRef.current?.focus());

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = previousOverflow;
      restoreRef.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") goNext();
      if (event.key === "ArrowLeft") goPrev();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose, goNext, goPrev]);

  const item = index !== null ? items[index] : null;

  return (
    <AnimatePresence>
      {open && item ? (
        <motion.div
          key="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={item.title ?? item.alt}
          className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="absolute inset-0 cursor-default bg-deep/85 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, y: 26, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="glass-strong relative z-10 flex max-h-[92dvh] w-full max-w-5xl flex-col overflow-hidden rounded-3xl md:grid md:grid-cols-[1.6fr_1fr]"
          >
            <div className="relative h-[44dvh] shrink-0 bg-black/45 md:h-[78dvh]">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 92vw, 60vw"
                className="object-contain p-3 sm:p-5"
              />

              <button
                type="button"
                onClick={goPrev}
                aria-label="Foto sebelumnya"
                className="absolute left-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-deep/60 text-lavender ring-1 ring-white/15 backdrop-blur transition hover:bg-deep/85 hover:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={goNext}
                aria-label="Foto berikutnya"
                className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-deep/60 text-lavender ring-1 ring-white/15 backdrop-blur transition hover:bg-deep/85 hover:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-deep/60 px-3 py-1 font-sans text-[10px] tracking-[0.2em] text-lavender/80 backdrop-blur">
                {index + 1} / {items.length}
              </span>
            </div>

            <div className="flex min-h-0 flex-col overflow-y-auto p-6 sm:p-8 md:h-[78dvh]">
              {item.meta ? (
                <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-orchid/75">
                  {item.meta}
                </p>
              ) : null}
              {item.title ? (
                <h3 className="mt-2 font-serif text-2xl leading-tight text-lavender sm:text-3xl">
                  {item.title}
                </h3>
              ) : null}
              {item.caption ? (
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {item.caption}
                </p>
              ) : null}
              {item.description ? (
                <p className="mt-4 font-serif text-lg leading-relaxed text-lavender/80 italic">
                  {item.description}
                </p>
              ) : null}

              <p className="mt-auto pt-8 font-sans text-[10px] uppercase tracking-[0.24em] text-muted-foreground/70">
                Esc untuk menutup · ← → untuk berpindah
              </p>
            </div>

            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="absolute right-3 top-3 z-20 grid h-10 w-10 place-items-center rounded-full bg-deep/60 text-lavender ring-1 ring-white/15 backdrop-blur transition hover:bg-deep/85 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
