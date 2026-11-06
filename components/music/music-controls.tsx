"use client";

import type { CSSProperties } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { formatTime } from "@/lib/format";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  className?: string;
}

export function ProgressBar({ currentTime, duration, onSeek, className }: ProgressBarProps) {
  const max = duration > 0 ? duration : 0;
  const percent = max > 0 ? (Math.min(currentTime, max) / max) * 100 : 0;

  return (
    <div className={cn("w-full", className)}>
      <input
        type="range"
        min={0}
        max={max || 1}
        step={0.1}
        value={Math.min(currentTime, max || 1)}
        disabled={max === 0}
        onChange={(event) => onSeek(Number(event.target.value))}
        aria-label="Posisi lagu"
        className="range disabled:cursor-not-allowed disabled:opacity-40"
        style={{ "--progress": `${percent}%` } as CSSProperties}
      />
      <div className="mt-1.5 flex justify-between font-sans text-[10px] tabular-nums text-muted-foreground">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(max)}</span>
      </div>
    </div>
  );
}

interface VolumeControlProps {
  volume: number;
  muted: boolean;
  onChange: (volume: number) => void;
  onToggleMute: () => void;
  className?: string;
}

export function VolumeControl({
  volume,
  muted,
  onChange,
  onToggleMute,
  className,
}: VolumeControlProps) {
  const effective = muted ? 0 : volume;

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={onToggleMute}
        aria-label={muted ? "Nyalakan suara" : "Matikan suara"}
        className="grid h-10 w-10 place-items-center rounded-full text-lavender/80 transition hover:bg-white/10 hover:text-white"
      >
        {muted || volume === 0 ? (
          <VolumeX className="h-4 w-4" />
        ) : (
          <Volume2 className="h-4 w-4" />
        )}
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={effective}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label="Volume"
        className="range w-20 sm:w-24"
        style={{ "--progress": `${effective * 100}%` } as CSSProperties}
      />
    </div>
  );
}
