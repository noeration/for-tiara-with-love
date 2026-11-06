"use client";

import Image from "next/image";
import { Pause, Play, Music2, Disc3 } from "lucide-react";
import { useContent } from "@/components/content/content-context";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { useMusic } from "@/components/music/music-context";
import { ProgressBar, VolumeControl } from "@/components/music/music-controls";
import { cn } from "@/lib/utils";

export function SongSection() {
  const birthday = useContent();
  const { isPlaying, currentTime, duration, volume, muted, error, toggle, seek, setVolume, toggleMute } =
    useMusic();
  const { song } = birthday;
  const { track } = song;

  return (
    <section
      id="lagu"
      aria-label={`Lagu untuk ${birthday.name}`}
      className="relative scroll-mt-24 overflow-x-clip px-5 py-24 sm:px-8 md:py-32"
    >
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={song.eyebrow}
          title={song.title}
          description={song.description}
        />

        <div className="mt-14 grid items-center gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:gap-16">
          <Reveal>
            <div className="relative mx-auto aspect-square w-full max-w-[380px]">
              <div className="absolute -inset-8 rounded-full bg-[radial-gradient(circle,rgba(201,167,255,0.25)_0%,transparent_70%)] blur-2xl" />

              <div className="relative h-full w-full rounded-full bg-[#120a1e] p-3 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.95)] ring-1 ring-white/10">
                <div
                  className={cn(
                    "relative h-full w-full overflow-hidden rounded-full",
                    isPlaying && "animate-spin-slow"
                  )}
                >
                  <Image
                    src={track.cover}
                    alt={`Cover lagu ${track.title}`}
                    fill
                    sizes="(max-width: 1024px) 80vw, 380px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,transparent_42%,rgba(13,6,23,0.45)_100%)]" />
                  <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-white/15" />
                  <div className="absolute inset-6 rounded-full border border-white/10" />
                  <div className="absolute inset-12 rounded-full border border-white/10" />
                </div>

                <div className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/20 bg-deep/80 backdrop-blur">
                  <span className="h-3 w-3 rounded-full bg-lavender/70" />
                </div>
              </div>

              <span className="absolute -right-2 top-4 grid h-11 w-11 place-items-center rounded-full bg-deep/80 text-orchid ring-1 ring-white/15 backdrop-blur sm:-right-4">
                <Disc3 className={cn("h-5 w-5", isPlaying && "animate-spin-slow")} />
              </span>
            </div>
          </Reveal>

          <div>
            <Reveal delay={0.05}>
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-orchid/70">
                now playing · {song.eyebrow}
              </p>
              <h3 className="mt-3 font-serif text-3xl leading-tight text-lavender sm:text-4xl">
                {track.title}
              </h3>
              <p className="mt-1.5 font-sans text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
                {track.artist}
              </p>
            </Reveal>

            <Reveal delay={0.1}>
              <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground">
                {track.note}
              </p>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="glass mt-7 rounded-2xl p-5">
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={toggle}
                    aria-label={isPlaying ? "Jeda lagu" : "Putar lagu"}
                    className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-linear-to-br from-lavender to-petal text-plum shadow-[0_16px_40px_-14px_rgba(233,224,255,0.85)] transition hover:scale-[1.04] active:scale-95"
                  >
                    {isPlaying ? (
                      <Pause className="h-5 w-5" />
                    ) : (
                      <Play className="ml-0.5 h-5 w-5" />
                    )}
                  </button>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-3">
                      <span className="truncate font-serif text-lg text-lavender">
                        {track.title}
                      </span>
                      <span className="flex h-4 items-end gap-0.5" aria-hidden="true">
                        {[0, 1, 2, 3].map((bar) => (
                          <span
                            key={bar}
                            className="w-0.5 origin-bottom rounded-full bg-orchid"
                            style={{
                              height: `${6 + bar * 3}px`,
                              animation: isPlaying
                                ? `equalize ${820 + bar * 90}ms ${bar * 90}ms ease-in-out infinite`
                                : undefined,
                              opacity: isPlaying ? 0.9 : 0.35,
                            }}
                          />
                        ))}
                      </span>
                    </div>
                    <div className="mt-2 flex h-8 items-end gap-0.5" aria-hidden="true">
                      {Array.from({ length: 24 }).map((_, i) => (
                        <span
                          key={i}
                          className="w-1 rounded-full bg-orchid/70"
                          style={{
                            height: `${6 + ((i * 7) % 18)}px`,
                            animation: isPlaying
                              ? `equalize ${700 + (i % 5) * 120}ms ${i * 40}ms ease-in-out infinite`
                              : undefined,
                            opacity: isPlaying ? 0.9 : 0.3,
                          }}
                        />
                      ))}
                    </div>
                    <ProgressBar
                      currentTime={currentTime}
                      duration={duration}
                      onSeek={seek}
                      className="mt-2"
                    />
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                  <VolumeControl
                    volume={volume}
                    muted={muted}
                    onChange={setVolume}
                    onToggleMute={toggleMute}
                  />
                  <span className="flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    <Music2 className="h-3.5 w-3.5" />
                    {isPlaying ? "playing" : "paused"}
                  </span>
                </div>

                {error ? (
                  <p role="status" className="mt-3 text-xs leading-relaxed text-rose">
                    {error}
                  </p>
                ) : null}
              </div>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="mt-4 text-xs text-muted-foreground/80">
                Musik tidak akan berhenti saat kamu berpindah bagian — pemutarnya menetap di
                sudut halaman.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
