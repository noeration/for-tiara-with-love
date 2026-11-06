import Image from "next/image";

interface PortraitFrameProps {
  src: string;
  alt: string;
  caption: string;
  placeholder?: boolean;
  /** Preload only for the image above the fold. */
  preload?: boolean;
}

/** Portrait frame with a soft orchid glow. */
export function PortraitFrame({ src, alt, caption, placeholder, preload }: PortraitFrameProps) {
  return (
    <figure className="relative mx-auto w-full max-w-[min(64vw,300px)] sm:max-w-[340px]">
      <div className="absolute -inset-6 rounded-[3rem] bg-[radial-gradient(circle,rgba(233,224,255,0.18)_0%,transparent_70%)] blur-2xl" />
      <div className="glass glow relative overflow-hidden rounded-[2.4rem] p-px">
        <div className="relative aspect-4/5 overflow-hidden rounded-[2.38rem]">
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 640px) 78vw, 340px"
            className="object-cover"
            preload={preload}
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-deep/90 to-transparent" />
          {placeholder ? (
            <div className="absolute right-3 top-3 rounded-full bg-background/60 px-2.5 py-1 text-[9px] uppercase tracking-[0.28em] text-lavender/80">
              placeholder
            </div>
          ) : null}
        </div>
      </div>
      <figcaption className="mt-4 text-center font-script text-xl text-lavender/90">
        {caption}
      </figcaption>
    </figure>
  );
}
