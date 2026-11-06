"use client";

import { useContent } from "@/components/content/content-context";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { PortraitFrame } from "@/components/ui/portrait-frame";
import { Orchid } from "@/components/ui/orchid";
import { TextReveal } from "@/components/motion/text-reveal";
import { ParallaxLayer } from "@/components/motion/parallax-layer";
import { TiltCard } from "@/components/motion/tilt-card";
import { Flame } from "lucide-react";
import { CakeSection } from "@/components/sections/cake-section";

export function MessageSection() {
  const birthday = useContent();
  return (
    <section
      id="pesan"
      aria-label="Pesan ulang tahun"
      className="relative scroll-mt-24 overflow-x-clip px-5 py-24 sm:px-8 md:py-32"
    >
      <ParallaxLayer speed={40} className="pointer-events-none absolute -right-10 top-8 h-40 w-40 sm:h-56 sm:w-56">
        <Orchid
          className="h-full w-full text-orchid/10"
          strokeWidth={1}
        />
      </ParallaxLayer>

      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <div>
            <SectionHeading
              align="left"
              eyebrow={birthday.message.eyebrow}
              title={birthday.message.title}
            />

            <div className="mt-8 space-y-5">
              {birthday.message.paragraphs.map((paragraph, index) => (
                <Reveal key={paragraph.slice(0, 24)} delay={0.08 + index * 0.06}>
                  <p className="text-[15px] leading-8 text-lavender/80 sm:text-base">
                    <TextReveal text={paragraph} mode="words" />
                  </p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={0.12} className="order-first lg:order-none">
            <TiltCard>
              <PortraitFrame
                src={birthday.portrait.src}
                alt={birthday.portrait.alt}
                caption={birthday.portrait.caption}
                placeholder={birthday.portrait.placeholder}
              />
            </TiltCard>
          </Reveal>
        </div>

        </div>

      <CakeSection />
    </section>
  );
}
