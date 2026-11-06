import Link from "next/link";
import { Orchid } from "@/components/ui/orchid";
import { birthday } from "@/data/birthday";

export default function NotFound() {
  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-6 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_20%,rgba(201,167,255,0.14)_0%,transparent_60%)]"
      />
      <div className="relative flex flex-col items-center">
        <Orchid className="h-24 w-24 text-orchid/80" bloom strokeWidth={1.2} />
        <p className="mt-8 font-sans text-[10px] uppercase tracking-[0.4em] text-orchid/75">
          halaman ini tidak ada
        </p>
        <h1 className="mt-4 font-serif text-4xl font-light text-lavender sm:text-5xl">
          Sepertinya kamu tersesat di taman yang salah
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
          Bunga yang kamu cari tidak tumbuh di sini. Kembali ke awal, ya.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-full bg-linear-to-r from-lavender via-white to-petal px-7 py-3 font-sans text-sm font-medium text-plum shadow-[0_20px_60px_-20px_rgba(200,160,255,0.9)] transition hover:scale-[1.02] active:scale-95"
        >
          Kembali ke hadiah {birthday.name}
        </Link>
      </div>
    </main>
  );
}
