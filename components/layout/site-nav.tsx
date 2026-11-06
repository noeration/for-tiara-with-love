"use client";

import { motion } from "motion/react";
import {
  Heart,
  Images,
  Mail,
  Music2,
  Palette,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useContent } from "@/components/content/content-context";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  pesan: Heart,
  kenangan: Images,
  karya: Palette,
  surat: Mail,
  lagu: Music2,
  penutup: Sparkles,
};

export function SiteNav() {
  const birthday = useContent();
  const [active, setActive] = useState(birthday.nav[0]?.id ?? "");

  useEffect(() => {
    const update = () => {
      const marker = window.innerHeight * 0.38;
      let current = birthday.nav[0]?.id ?? "";

      for (const item of birthday.nav) {
        const element = document.getElementById(item.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= marker) current = item.id;
      }

      setActive(current);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <nav
      aria-label="Navigasi bagian"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-1/2 z-50 w-fit max-w-[calc(100vw-1.5rem)] -translate-x-1/2"
    >
      <ul className="glass-strong flex items-center gap-0.5 rounded-full p-1.5 shadow-[0_18px_50px_-20px_rgba(0,0,0,0.9)]">
        {birthday.nav.map((item) => {
          const Icon = ICONS[item.id] ?? Sparkles;
          const isActive = active === item.id;

          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                onClick={() => setActive(item.id)}
                aria-current={isActive ? "true" : undefined}
                aria-label={item.label}
                className={cn(
                  "relative flex h-10 items-center gap-2 rounded-full px-3 text-[11px] tracking-wide transition-colors duration-300",
                  isActive ? "text-white" : "text-lavender/60 hover:text-lavender"
                )}
              >
                {isActive ? (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-0 rounded-full bg-white/10 ring-1 ring-orchid/25"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                ) : null}
                <Icon className="relative z-10 h-4 w-4 shrink-0" strokeWidth={1.7} />
                <span className="relative z-10 hidden lg:inline">{item.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
