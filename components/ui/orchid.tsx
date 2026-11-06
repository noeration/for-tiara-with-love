import { cn } from "@/lib/utils";

interface OrchidProps {
  className?: string;
  /** Animate petals opening (CSS, respects prefers-reduced-motion). */
  bloom?: boolean;
  strokeWidth?: number;
}

/**
 * Stylized line-art orchid drawn with currentColor.
 * Decorative only — always rendered aria-hidden.
 */
export function Orchid({ className, bloom = false, strokeWidth = 1.4 }: OrchidProps) {
  const petals = [0, 72, 144, 216, 288];

  return (
    <svg
      viewBox="0 0 200 240"
      fill="none"
      aria-hidden="true"
      className={cn("overflow-visible", className)}
    >
      <g stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round">
        {/* stem */}
        <path d="M100 100 C100 150 96 185 100 228" opacity="0.45" />
        <path d="M100 168 C84 158 66 160 54 172 C68 184 88 182 100 172Z" opacity="0.35" />
        <path d="M100 196 C116 186 136 188 148 200 C132 212 112 210 100 200Z" opacity="0.3" />

        {petals.map((angle, i) => (
          <g
            key={angle}
            className={bloom ? "orchid-petal" : undefined}
            style={
              bloom
                ? {
                    animation: "bloom 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) both",
                    animationDelay: `${i * 110}ms`,
                  }
                : undefined
            }
          >
            <ellipse
              cx="100"
              cy="40"
              rx="29"
              ry="47"
              transform={`rotate(${angle} 100 94)`}
              fill="currentColor"
              fillOpacity="0.1"
            />
          </g>
        ))}

        {/* lip / center */}
        <path
          d="M100 78 C111 86 116 100 108 112 C104 118 96 118 92 112 C84 100 89 86 100 78Z"
          fill="currentColor"
          fillOpacity="0.22"
        />
        <circle cx="100" cy="97" r="5.5" fill="currentColor" fillOpacity="0.55" />
        <circle cx="93" cy="88" r="1.8" fill="currentColor" fillOpacity="0.65" />
        <circle cx="107" cy="88" r="1.8" fill="currentColor" fillOpacity="0.65" />
      </g>
    </svg>
  );
}

/** Small decorative divider: hairline — orchid — hairline. */
export function OrchidDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center gap-3", className)} aria-hidden="true">
      <span className="hairline w-16 sm:w-24" />
      <Orchid className="h-7 w-7 text-orchid/80" strokeWidth={1.8} />
      <span className="hairline w-16 sm:w-24" />
    </div>
  );
}
