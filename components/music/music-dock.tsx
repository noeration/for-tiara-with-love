"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import { Music2, Pause, Play, X } from "lucide-react";
import { useState } from "react";
import { useContent } from "@/components/content/content-context";
import { useMusic } from "@/components/music/music-context";
import { ProgressBar, VolumeControl } from "@/components/music/music-controls";

const EASE = [0.22, 1, 0.36, 1] as const;

export function MusicDock() {
  const birthday = useContent();
  const [expanded, setExpanded] = useState(false);
  const { isPlaying, currentTime, duration, volume, muted, toggle, seek, setVolume, toggleMute } =
    useMusic();
  const { track } = birthday.song;

  return (
    <div className="fixed bottom-[calc(6.5rem+env(safe-area-inset-bottom))] right-4 z-40 md:bottom-[max(1.5rem,env(safe-area-inset-bottom))] md:right-6">
      <AnimatePresence mode="wait" initial={false}>
        {!expanded ? (
          <motion.div
            key="collapsed"
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="glass-strong flex items-center gap-1.5 rounded-full p-1.5 shadow-[0_20px_60px_-24px_rgba(0,0,0,0.9)]"
          >
            <button
              type="button"
              onClick={() => setExpanded(true)}
              aria-label="Buka pemutar musik"
              aria-expanded={false}
              className="flex items-center gap-2.5 rounded-full pr-1 text-left"
            >
              <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-white/20">
                <Image src={track.cover} alt="" fill sizes="40px" className="object-cover" />
                <span
                  className={`absolute inset-1 rounded-full border border-white/25 ${
                    isPlaying ? "animate-spin-slow" : ""
                  }`}
                />
              </span>
              <span className="hidden sm:block">
                <span className="block text-[9px] uppercase tracking-[0.26em] text-orchid/70">
                  our song
                </span>
                <span className="block max-w-36 truncate text-xs text-lavender/90">
                  {track.title}
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={toggle}
              aria-label={isPlaying ? "Jeda lagu" : "Putar lagu"}
              className="grid h-10 w-10 place-items-center rounded-full bg-lavender text-plum shadow-[0_10px_30px_-10px_rgba(233,224,255,0.8)] transition hover:bg-white"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="glass-strong w-[min(calc(100vw-2rem),20rem)] rounded-3xl p-4 shadow-[0_30px_90px_-30px_rgba(0,0,0,0.95)]"
          >
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 text-[10px] uppercase tracking-[0.26em] text-orchid/75">
                <Music2 className="h-3.5 w-3.5" /> our song
              </span>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                aria-label="Tutup pemutar musik"
                className="grid h-7 w-7 place-items-center rounded-full text-lavender/70 transition hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/15">
                <Image src={track.cover} alt="" fill sizes="56px" className="object-cover" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-serif text-lg leading-tight text-lavender">
                  {track.title}
                </p>
                <p className="truncate text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                  {track.artist}
                </p>
              </div>
              <button
                type="button"
                onClick={toggle}
                aria-label={isPlaying ? "Jeda lagu" : "Putar lagu"}
                className="ml-auto grid h-11 w-11 shrink-0 place-items-center rounded-full bg-lavender text-plum transition hover:bg-white"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
              </button>
            </div>

            <ProgressBar
              currentTime={currentTime}
              duration={duration}
              onSeek={seek}
              className="mt-3"
            />

            <div className="mt-2 flex items-center justify-between">
              <VolumeControl
                volume={volume}
                muted={muted}
                onChange={setVolume}
                onToggleMute={toggleMute}
              />
              <span className="text-[10px] text-muted-foreground">
                {isPlaying ? "playing" : "paused"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
