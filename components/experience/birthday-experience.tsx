"use client";

import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AmbientBackground } from "@/components/layout/ambient-background";
import { ScrollProgress } from "@/components/layout/scroll-progress";
import { SiteNav } from "@/components/layout/site-nav";
import { CustomCursor } from "@/components/effects/custom-cursor";
import { Opening } from "@/components/sections/opening";
import { MessageSection } from "@/components/sections/message-section";
import { MemoriesSection } from "@/components/sections/memories-section";
import { ArtGallerySection } from "@/components/sections/art-gallery-section";
import { LetterSection } from "@/components/sections/letter-section";
import { SongSection } from "@/components/sections/song-section";
import { FinaleSection } from "@/components/sections/finale-section";
import { MusicProvider } from "@/components/music/music-context";
import { MusicDock } from "@/components/music/music-dock";
import { ContentProvider } from "@/components/content/content-context";
import type { MemoryConfig } from "@/data/birthday";

export function BirthdayExperience({ content }: { content: MemoryConfig }) {
  const [opened, setOpened] = useState(false);
  const mainRef = useRef<HTMLElement | null>(null);
  const appearance = content.appearance;

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--background", appearance.background);
    root.style.setProperty("--deep", appearance.background);
    root.style.setProperty("--orchid", appearance.accent);
    if (appearance.typography === "sans") {
      root.style.setProperty(
        "--font-serif",
        "var(--font-jakarta), ui-sans-serif, system-ui, sans-serif"
      );
    } else {
      root.style.removeProperty("--font-serif");
    }
    return () => {
      root.style.removeProperty("--background");
      root.style.removeProperty("--deep");
      root.style.removeProperty("--orchid");
      root.style.removeProperty("--font-serif");
    };
  }, [appearance.background, appearance.accent, appearance.typography]);

  useEffect(() => {
    document.body.style.overflow = opened ? "" : "hidden";
    if (opened) window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    return () => {
      document.body.style.overflow = "";
    };
  }, [opened]);

  useEffect(() => {
    if (!opened) return;
    mainRef.current?.focus({ preventScroll: true });
  }, [opened]);

  return (
    <ContentProvider content={content}>
    <MotionConfig reducedMotion="user">
      <MusicProvider>
        {appearance.effects !== false && <AmbientBackground />}

        <AnimatePresence>
          {!opened ? <Opening key="opening" onOpen={() => setOpened(true)} /> : null}
        </AnimatePresence>

        {opened ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, delay: 0.25 }}
          >
            <ScrollProgress />
            <SiteNav />

            <main id="konten" ref={mainRef} tabIndex={-1} className="outline-none">
              <MessageSection />
              <MemoriesSection />
              <ArtGallerySection />
              <LetterSection />
              <SongSection />
              <FinaleSection />
            </main>

            <MusicDock />
            <CustomCursor />
          </motion.div>
        ) : null}
      </MusicProvider>
    </MotionConfig>
    </ContentProvider>
  );
}
