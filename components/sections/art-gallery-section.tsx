"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { useState, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useContent } from "@/components/content/content-context";
import type { Artwork } from "@/data/birthday";
import { SectionHeading } from "@/components/ui/section-heading";
import { Lightbox, type LightboxItem } from "@/components/ui/lightbox";
import { TiltCard } from "@/components/motion/tilt-card";
import { cn } from "@/lib/utils";

interface ArtworkFrameProps {
  artwork: Artwork;
  flipped: boolean;
  onOpen: () => void;
}

function ArtworkFrame({ artwork, flipped, onOpen }: ArtworkFrameProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 22, restDelta: 0.001 });
  const rotateY = useTransform(progress, [0, 1], [flipped ? -18 : 18, 0]);
  const rotateX = useTransform(progress, [0, 1], [8, 0]);
  const scale = useTransform(progress, [0, 1], [0.88, 1]);
  const opacity = useTransform(progress, [0, 0.4, 1], [0.3, 0.85, 1]);
  const z = useTransform(progress, [0, 1], [-60, 0]);

  return (
    <motion.article
      ref={ref}
      style={{ rotateY, rotateX, scale, opacity, z, transformPerspective: 1200, transformStyle: "preserve-3d" }}
      className="grid items-center gap-8 md:grid-cols-2 md:gap-14 will-change-transform"
    >
      <TiltCard max={6} className={cn(flipped && "md:order-2")}>
        <button
          type="button"
          onClick={onOpen}
          aria-label={`Lihat karya ${artwork.title} dalam ukuran besar`}
          className="group relative block w-full"
        >
          <span className="absolute -inset-5 rounded-[3rem] bg-[radial-gradient(circle,rgba(201,167,255,0.16)_0%,transparent_70%)] opacity-70 blur-2xl transition group-hover:opacity-100" />

          <span className="glass relative block overflow-hidden rounded-3xl p-2 transition duration-500 group-hover:border-orchid/30 sm:p-3">
            <span
              className="relative block overflow-hidden rounded-2xl bg-[#0f0719]"
              style={{ aspectRatio: artwork.aspect ?? 4 / 3 }}
            >
              <Image
                src={artwork.src}
                alt={artwork.alt}
                fill
                sizes="(max-width: 768px) 92vw, 46vw"
                className="object-contain transition-transform duration-700 group-hover:scale-[1.015]"
              />
              <span className="absolute inset-0 ring-1 ring-inset ring-white/10" />
            </span>

            {artwork.placeholder ? (
              <span className="absolute right-5 top-5 rounded-full bg-deep/65 px-2.5 py-1 text-[8px] uppercase tracking-[0.22em] text-lavender/90 backdrop-blur">
                placeholder
              </span>
            ) : null}

            <span className="pointer-events-none absolute bottom-6 right-6 hidden items-center gap-1.5 rounded-full bg-deep/70 px-3.5 py-2 text-[10px] uppercase tracking-[0.22em] text-lavender opacity-0 backdrop-blur transition group-hover:opacity-100 sm:flex">
              Lihat karya <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </span>
        </button>
      </TiltCard>

      <div className={cn(flipped && "md:order-1")}>
        <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-orchid/70">
          {[artwork.year, artwork.medium].filter(Boolean).join(" · ") || "karya"}
        </p>
        <h3 className="mt-3 font-serif text-3xl leading-tight text-lavender sm:text-4xl">
          {artwork.title}
        </h3>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
          {artwork.description}
        </p>
        <button
          type="button"
          onClick={onOpen}
          className="mt-6 inline-flex items-center gap-2 font-sans text-sm text-orchid transition hover:text-lavender"
        >
          Lihat lebih dekat
          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </motion.article>
  );
}

export function ArtGallerySection() {
  const birthday = useContent();
  const [index, setIndex] = useState<number | null>(null);
  const items = birthday.artworks.items.slice(0, 1);

  const lightboxItems: LightboxItem[] = items.map((item) => ({
    src: item.src,
    alt: item.alt,
    title: item.title,
    meta: [item.year, item.medium].filter(Boolean).join(" · "),
    description: item.description,
    caption: item.placeholder
      ? "Karya contoh — ganti dengan gambar asli di folder public/images/artworks/."
      : undefined,
  }));

  return (
    <section
      id="karya"
      aria-label={`Galeri karya ${birthday.name}`}
      className="relative scroll-mt-24 overflow-x-clip px-5 py-24 sm:px-8 md:py-32"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-orchid/25 to-transparent"
      />

      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={birthday.artworks.eyebrow}
          title={birthday.artworks.title}
          description={birthday.artworks.description}
        />

        <div className="mt-16 space-y-16 md:space-y-24" style={{ perspective: "1400px" }}>
          {items.map((artwork, artworkIndex) => (
            <ArtworkFrame
              key={artwork.id}
              artwork={artwork}
              flipped={artworkIndex % 2 === 1}
              onOpen={() => setIndex(artworkIndex)}
            />
          ))}
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
