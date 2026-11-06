import { cn } from "@/lib/utils";
import { OrchidDivider } from "@/components/ui/orchid";
import { Reveal } from "@/components/ui/reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <div className={cn(centered ? "mx-auto max-w-2xl text-center" : "max-w-2xl", className)}>
      <Reveal delay={0.02}>
        <p className="font-sans text-[11px] uppercase tracking-[0.32em] text-orchid/75 sm:text-xs">
          {eyebrow}
        </p>
      </Reveal>

      <Reveal delay={0.08}>
        <h2 className="mt-4 font-serif text-[2.1rem] leading-[1.05] font-light text-lavender sm:text-5xl md:text-[3.4rem]">
          {title}
        </h2>
      </Reveal>

      {centered ? <OrchidDivider className="mt-6" /> : <span className="mt-6 block hairline w-24" />}

      {description ? (
        <Reveal delay={0.16}>
          <p className="mt-5 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {description}
          </p>
        </Reveal>
      ) : null}
    </div>
  );
}
