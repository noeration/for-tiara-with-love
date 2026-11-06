"use client";

import { motion, useScroll, useTransform } from "motion/react";
import { useEffect } from "react";
import { PetalField, StarField } from "@/components/effects/petal-field";

/**
 * Fixed dreamy backdrop: scroll-linked parallax glows, hue shift, stars & petals.
 * Purely decorative. Reduced motion handled in CSS.
 */
export function AmbientBackground() {
  const { scrollYProgress } = useScroll();
  const yLeft = useTransform(scrollYProgress, [0, 1], [0, -160]);
  const yRight = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const yCenter = useTransform(scrollYProgress, [0, 1], [0, -90]);
  const hue = useTransform(scrollYProgress, [0, 0.5, 1], [270, 285, 300]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.34, 0.40, 0.30]);

  useEffect(() => {
    const onVis = () => {
      document.documentElement.toggleAttribute("data-tab-hidden", document.hidden);
    };
    document.addEventListener("visibilitychange", onVis);
    onVis();
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0">
      <div className="nebula absolute -inset-[8%] bg-[radial-gradient(ellipse_at_30%_20%,rgba(176,132,255,0.45)_0%,transparent_55%),radial-gradient(ellipse_at_70%_80%,rgba(245,201,232,0.32)_0%,transparent_60%)] blur-2xl" />
      <div className="mist absolute inset-0 bg-[linear-gradient(120deg,rgba(201,167,255,0.18),rgba(245,201,232,0.11),rgba(176,132,255,0.18))] opacity-[0.9]" />

      <motion.div
        className="absolute inset-0"
        style={{
          background: useTransform(hue, (h) => `radial-gradient(ellipse at top, hsl(${h} 40% 22%) 0%, #160b26 46%, #0d0617 100%)`),
        }}
      />

      <motion.div style={{ y: yLeft }} className="parallax absolute -left-[22%] top-[6%] h-[60vh] w-[60vh] rounded-full bg-[radial-gradient(circle,rgba(201,167,255,0.40)_0%,transparent_70%)] blur-5xl" />
      <motion.div style={{ y: yRight }} className="parallax absolute -right-[26%] top-[18%] h-[70vh] w-[70vh] rounded-full bg-[radial-gradient(circle,rgba(245,201,232,0.34)_0%,transparent_72%)] blur-5xl" />
      <motion.div style={{ y: yCenter }} className="parallax absolute bottom-[-26%] left-[16%] h-[68vh] w-[68vh] rounded-full bg-[radial-gradient(circle,rgba(176,132,255,0.36)_0%,transparent_74%)] blur-5xl" />

      <StarField count={48} />
      <PetalField count={24} />

      <motion.div
        aria-hidden="true"
        style={{ opacity: glowOpacity }}
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(8,3,15,0.55)_100%)]"
      />
    </div>
  );
}
