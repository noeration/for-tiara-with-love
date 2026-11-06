"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

interface Piece {
  id: number;
  left: number;
  drift: number;
  delay: number;
  duration: number;
  color: string;
  width: number;
  height: number;
  radius: number;
}

const COLORS = ["#d8b4fe", "#f5c9e8", "#c4b5fd", "#ffffff", "#a78bfa", "#f0abfc"];

/** DOM confetti burst. Trigger by incrementing `fireKey`. */
export function Confetti({ fireKey }: { fireKey: number }) {
  const reduce = useReducedMotion();
  const [pieces, setPieces] = useState<Piece[]>([]);

  useEffect(() => {
    if (!fireKey) return;

    let timer: number | undefined;

    const frame = requestAnimationFrame(() => {
      const next: Piece[] = Array.from({ length: 80 }).map((_, i) => ({
        id: fireKey * 1000 + i,
        left: Math.random() * 100,
        drift: (Math.random() - 0.5) * 260,
        delay: Math.random() * 0.8,
        duration: 3.2 + Math.random() * 2.2,
        color: COLORS[i % COLORS.length],
        width: 10 + Math.random() * 12,
        height: 16 + Math.random() * 18,
        radius: Math.random() > 0.45 ? 999 : 2,
      }));

      setPieces(next);
      timer = window.setTimeout(() => setPieces([]), 7000);
    });

    return () => {
      cancelAnimationFrame(frame);
      if (timer) window.clearTimeout(timer);
    };
  }, [fireKey, reduce]);

  if (pieces.length === 0) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[100] overflow-hidden">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            width: piece.width,
            height: piece.height,
            borderRadius: piece.radius,
            background: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: `${piece.duration}s`,
            ["--drift" as string]: `${piece.drift}px`,
          }}
        />
      ))}
    </div>
  );
}
