"use client";

import Image from "next/image";
import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useState, useRef, useEffect } from "react";
import { Camera } from "lucide-react";
import { useContent } from "@/components/content/content-context";
import type { Memory } from "@/data/birthday";
import { SectionHeading } from "@/components/ui/section-heading";
import { Lightbox, type LightboxItem } from "@/components/ui/lightbox";
import { TiltCard } from "@/components/motion/tilt-card";
import { cn } from "@/lib/utils";

const ASPECTS = {
  portrait: "aspect-4/5",
  square: "aspect-square",
  landscape: "aspect-4/3",
} as const;

const ROTATIONS = [-2.4, 1.8, -1.4, 2.6, -1.9, 1.2];

function scattered(i: number, mobile: boolean) {
  const r = ((i * 9301 + 49297) % 233280) / 233280;
  const r2 = ((i * 4733 + 19937) % 233280) / 233280;
  const range = mobile ? 90 : 240;
  return {
    x: (r - 0.5) * range * 2,
    y: (r2 - 0.5) * range * 1.4,
    rotate: (r - 0.5) * (mobile ? 16 : 30),
    scale: 0.72 + r * 0.2,
  };
}

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return mobile;
}

interface MemoryCardProps {
  item: Memory;
  itemIndex: number;
  mobile: boolean;
  progress: MotionValue<number>;
  onOpen: () => void;
}

function MemoryCard({ item, itemIndex, mobile, progress, onOpen }: MemoryCardProps) {
  const off = scattered(itemIndex, mobile);
  const x = useTransform(progress, [0, 1], [off.x, 0]);
  const y = useTransform(progress, [0, 1], [off.y, 0]);
  const rotate = useTransform(progress, [0, 1], [off.rotate, 0]);
  const scale = useTransform(progress, [0, 1], [off.scale, 1]);
  const opacity = useTransform(progress, [0, 0.15, 1], [0.55, 0.85, 1]) as MotionValue<number>;

  return (
    <div className="mb-5 break-inside-avoid">
      <motion.div style={{ x, y, rotate, scale, opacity }} className="will-change-transform">
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{
            duration: 4 + (itemIndex % 3),
            repeat: Infinity,
            ease: "easeInOut",
            delay: itemIndex * 0.3,
          }}
        >
          <TiltCard max={5}>
            <motion.button
              type="button"
              onClick={onOpen}
              aria-label={`Buka foto: ${item.caption}`}
              whileHover={{ y: -8, rotate: 0, scale: 1.015 }}
              transition={{ type: "spring", stiffness: 260, damping: 22 }}
              style={{ rotate: ROTATIONS[itemIndex % ROTATIONS.length] }}
              className="group relative block w-full text-left"
            >
              <span className="absolute -top-2.5 left-1/2 z-10 h-5 w-16 -translate-x-1/2 rotate-[-2deg] rounded-[2px] bg-lavender/35 shadow-sm backdrop-blur-sm" />

              <span className="polaroid block rounded-[10px] p-3 pb-2">
                <span
                  className={cn(
                    "relative block overflow-hidden rounded-[4px] bg-[#150b24]",
                    ASPECTS[item.aspect ?? "portrait"]
                  )}
                >
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 92vw, (max-width: 1024px) 45vw, 30vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <span className="absolute inset-0 ring-1 ring-inset ring-black/10" />
                  {item.placeholder ? (
                    <span className="absolute right-2 top-2 rounded-full bg-[#2a1740]/70 px-2 py-0.5 text-[8px] uppercase tracking-[0.2em] text-lavender">
                      placeholder
                    </span>
                  ) : null}
                </span>

                <span className="block px-1 pb-1 pt-3">
                  <span className="block font-script text-[1.35rem] leading-tight text-[#3a1f57]">
                    {item.caption}
                  </span>
                  {item.date ? (
                    <span className="mt-1 block font-sans text-[9px] uppercase tracking-[0.22em] text-[#7a5a9c]">
                      {item.date}
                    </span>
                  ) : null}
                </span>
              </span>

              <span className="pointer-events-none absolute -right-2 -top-2 grid h-9 w-9 place-items-center rounded-full bg-deep/80 text-lavender opacity-0 ring-1 ring-white/20 transition group-hover:opacity-100">
                <Camera className="h-4 w-4" />
              </span>
            </motion.button>
          </TiltCard>
        </motion.div>
      </motion.div>
    </div>
  );
}

export function MemoriesSection() {
  const birthday = useContent();
  const [index, setIndex] = useState<number | null>(null);
  const { items } = birthday.memories;
  const mobile = useIsMobile();
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 24, restDelta: 0.001 });

  const lightboxItems: LightboxItem[] = items.map((item) => ({
    src: item.src,
    alt: item.alt,
    title: item.caption,
    meta: item.date,
    caption: item.placeholder
      ? "Foto contoh — ganti dengan fotomu di folder public/images/memories/."
      : undefined,
  }));

  return (
    <section
      ref={sectionRef}
      id="kenangan"
      aria-label="Galeri kenangan"
      className="relative scroll-mt-24 px-5 py-24 sm:px-8 md:py-32"
      style={{ minHeight: "230vh" }}
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={birthday.memories.eyebrow}
          title={birthday.memories.title}
          description={birthday.memories.description}
        />
      </div>

      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-6xl px-5 sm:px-8">
          <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [column-fill:balance]">
            {items.map((item, itemIndex) => (
              <MemoryCard
                key={item.id}
                item={item}
                itemIndex={itemIndex}
                mobile={mobile}
                progress={progress}
                onOpen={() => setIndex(itemIndex)}
              />
            ))}
          </div>
        </div>
      </div>

      <Lightbox
        items={lightboxItems}
        index={index}
        onClose={() => setIndex(null)}
        onNavigate={setIndex}
      />
    </section>
  );
}
