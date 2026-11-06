"use client";

const RAND = [0.12, 0.28, 0.43, 0.57, 0.72, 0.86, 0.19, 0.64, 0.37, 0.81, 0.26, 0.51];

export function PetalField({ count = 14, className }: { count?: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      {Array.from({ length: count }).map((_, i) => {
        const r = RAND[i % RAND.length];
        const size = 18 + r * 28;

        return (
          <span
            key={i}
            className="petal"
            style={{
              left: `${(r * 100).toFixed(2)}%`,
              width: `${size}px`,
              height: `${size * 1.6}px`,
              animationDelay: `${(r * 14).toFixed(2)}s`,
              animationDuration: `${(16 + r * 12).toFixed(2)}s`,
              opacity: (0.7 + r * 0.3).toFixed(3),
            }}
          />
        );
      })}
    </div>
  );
}

export function StarField({ count = 28, className }: { count?: number; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className ?? ""}`}
    >
      {Array.from({ length: count }).map((_, i) => {
        const r = RAND[(i * 3) % RAND.length];
        const size = 1 + r * 2;

        return (
          <span
            key={i}
            className="star"
            style={{
              left: `${(r * 100).toFixed(2)}%`,
              top: `${(((i * 17) % 100)).toFixed(2)}%`,
              width: `${size}px`,
              height: `${size}px`,
              animationDelay: `${(r * 6).toFixed(2)}s`,
              animationDuration: `${(3 + r * 3).toFixed(2)}s`,
            }}
          />
        );
      })}
    </div>
  );
}

export function GlowOrbs({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${className ?? ""}`}>
      <div className="absolute -left-[18%] top-[12%] h-[48vh] w-[48vh] rounded-full bg-[radial-gradient(circle,rgba(201,167,255,0.18)_0%,transparent_70%)] blur-3xl" />
      <div className="absolute -right-[22%] top-[6%] h-[56vh] w-[56vh] rounded-full bg-[radial-gradient(circle,rgba(245,201,232,0.14)_0%,transparent_72%)] blur-3xl" />
      <div className="absolute bottom-[-24%] left-[12%] h-[60vh] w-[60vh] rounded-full bg-[radial-gradient(circle,rgba(176,132,255,0.16)_0%,transparent_74%)] blur-3xl" />
    </div>
  );
}
