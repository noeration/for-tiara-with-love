"use client";

import { useEffect, useRef, useState } from "react";
import type { Artwork } from "@/data/birthday";

type Status = { kind: "ok" | "err"; text: string } | null;

const EMPTY_ARTWORK: Artwork = {
  id: "artwork-01",
  src: "",
  alt: "",
  title: "",
  year: "",
  medium: "",
  description: "",
  aspect: 1.4,
  placeholder: true,
};

export default function ArtworksPage() {
  const [artwork, setArtwork] = useState<Artwork>(EMPTY_ARTWORK);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const fileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/admin/artworks", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
        if (!cancelled && Array.isArray(data.items) && data.items[0]) {
          setArtwork({ ...EMPTY_ARTWORK, ...data.items[0] });
        }
      } catch (err) {
        if (!cancelled) setStatus({ kind: "err", text: `Could not load artwork: ${String(err)}` });
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function update<K extends keyof Artwork>(key: K, value: Artwork[K]) {
    setArtwork((prev) => ({ ...prev, [key]: value }));
  }

  async function upload(file: File) {
    setUploading(true);
    setStatus(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "artworks");
      const res = await fetch("/api/admin/storage", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Upload failed (${res.status})`);
      setArtwork((prev) => ({ ...prev, src: data.url, placeholder: false }));
      setStatus({ kind: "ok", text: "Artwork uploaded. Click Save Draft to keep it." });
    } catch (err) {
      setStatus({ kind: "err", text: `Upload failed: ${String(err)}` });
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/artworks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: [artwork] }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Save failed (${res.status})`);
      setStatus({ kind: "ok", text: "Artwork saved. Publish to show it on the public site." });
    } catch (err) {
      setStatus({ kind: "err", text: `Save failed: ${String(err)}` });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl text-lavender">Artwork</h1>
        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-orchid/70">
          Exactly one artwork slot — Tiara’s single artwork is featured here.
        </p>
      </div>

      {status && (
        <p className={`text-sm ${status.kind === "ok" ? "text-green-400" : "text-rose"}`}>
          {status.text}
        </p>
      )}

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Artwork image</label>
            <div className="flex min-h-[12rem] items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-black/30">
              {artwork.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={artwork.src} alt={artwork.alt} className="h-48 w-48 object-cover" />
              ) : (
                <span className="text-xs text-muted-foreground">No image yet</span>
              )}
            </div>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) upload(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInput.current?.click()}
              className="rounded-lg border border-orchid/30 bg-orchid/10 px-3 py-2 text-xs text-orchid hover:bg-orchid/20 disabled:opacity-60"
            >
              {uploading ? "Uploading…" : artwork.src ? "Replace image" : "Upload image"}
            </button>
            <label className="mt-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">Image URL</label>
            <input
              value={artwork.src}
              onChange={(e) => update("src", e.target.value)}
              placeholder="/uploads/artworks/…"
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Alt Text</label>
            <input
              value={artwork.alt}
              onChange={(e) => update("alt", e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
            />
            <label className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Title</label>
            <input
              value={artwork.title}
              onChange={(e) => update("title", e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Year (optional)</label>
            <input
              value={artwork.year ?? ""}
              onChange={(e) => update("year", e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
            />
            <label className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Medium (optional)</label>
            <input
              value={artwork.medium ?? ""}
              onChange={(e) => update("medium", e.target.value)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
            />
            <label className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Aspect ratio</label>
            <input
              type="number"
              step="0.01"
              value={artwork.aspect ?? 1.4}
              onChange={(e) => update("aspect", Number(e.target.value) || 1.4)}
              className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <label className="mb-3 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Description</label>
        <textarea
          rows={4}
          value={artwork.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
        />
      </section>

      <button
        type="button"
        disabled={saving}
        onClick={handleSave}
        className="rounded-full bg-gradient-to-r from-orchid/80 to-violet-400/80 px-6 py-2.5 text-sm font-medium text-white shadow-lg disabled:opacity-60 transition"
      >
        {saving ? "Saving…" : "Save Draft"}
      </button>
    </div>
  );
}
