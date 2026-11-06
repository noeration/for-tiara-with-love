"use client";

import { useEffect, useState, useRef } from "react";
import type { Track } from "@/data/birthday";

type Status = { kind: "ok" | "err"; text: string } | null;

export default function MusicPage() {
  const [track, setTrack] = useState<Track | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingAudio, setUploadingAudio] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [status, setStatus] = useState<Status>(null);
  const audioFileInput = useRef<HTMLInputElement | null>(null);
  const coverFileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/admin/music", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
        if (!cancelled) setTrack(data.track ?? null);
      } catch (err) {
        if (!cancelled) {
          setStatus({ kind: "err", text: `Could not load music: ${String(err)}` });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  function updateField<K extends keyof Track>(key: K, val: Track[K]) {
    setTrack((prev) => (prev ? { ...prev, [key]: val } : null));
  }

  async function uploadAudio(file: File) {
    setUploadingAudio(true);
    setStatus(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "audio");
      const res = await fetch("/api/admin/storage", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Upload failed (${res.status})`);
      updateField("src", data.url);
      setStatus({ kind: "ok", text: "Audio uploaded. Click Save Draft to keep it." });
    } catch (err) {
      setStatus({ kind: "err", text: `Upload failed: ${String(err)}` });
    } finally {
      setUploadingAudio(false);
    }
  }

  async function uploadCover(file: File) {
    setUploadingCover(true);
    setStatus(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "images");
      const res = await fetch("/api/admin/storage", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Upload failed (${res.status})`);
      updateField("cover", data.url);
      setStatus({ kind: "ok", text: "Cover uploaded. Click Save Draft to keep it." });
    } catch (err) {
      setStatus({ kind: "err", text: `Upload failed: ${String(err)}` });
    } finally {
      setUploadingCover(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/music", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ track }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Save failed (${res.status})`);
      setStatus({ kind: "ok", text: "Music saved. Publish to show it on the public site." });
    } catch (err) {
      setStatus({ kind: "err", text: `Save failed: ${String(err)}` });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-muted-foreground">Loading…</div>;
  if (!track) return <div className="text-muted-foreground">No track configured.</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="font-serif text-3xl sm:text-4xl text-lavender">Music</h1>
      {status && (
        <p className={`text-sm ${status.kind === "ok" ? "text-green-400" : "text-rose"}`}>
          {status.text}
        </p>
      )}

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Track Title</label>
            <input
              value={track.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Artist</label>
            <input
              value={track.artist}
              onChange={(e) => updateField("artist", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Audio URL</label>
            <input
              value={track.src}
              onChange={(e) => updateField("src", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
            />
            <input
              ref={audioFileInput}
              type="file"
              accept="audio/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadAudio(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={uploadingAudio}
              onClick={() => audioFileInput.current?.click()}
              className="mt-2 w-full rounded-lg border border-orchid/30 bg-orchid/10 px-3 py-2 text-xs text-orchid hover:bg-orchid/20 disabled:opacity-60"
            >
              {uploadingAudio ? "Uploading…" : track.src ? "Replace audio" : "Upload audio"}
            </button>
          </div>
          <div>
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Cover URL</label>
            <input
              value={track.cover}
              onChange={(e) => updateField("cover", e.target.value)}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
            />
            <input
              ref={coverFileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) uploadCover(file);
                e.target.value = "";
              }}
            />
            <button
              type="button"
              disabled={uploadingCover}
              onClick={() => coverFileInput.current?.click()}
              className="mt-2 w-full rounded-lg border border-orchid/30 bg-orchid/10 px-3 py-2 text-xs text-orchid hover:bg-orchid/20 disabled:opacity-60"
            >
              {uploadingCover ? "Uploading…" : track.cover ? "Replace cover" : "Upload cover"}
            </button>
            {track.cover && (
              <a href={track.cover} target="_blank" rel="noopener noreferrer" className="mt-1 block text-xs text-orchid">
                Open cover image
              </a>
            )}
          </div>
        </div>
        <label className="mt-4 block text-xs uppercase tracking-[0.2em] text-muted-foreground">Note</label>
        <textarea
          rows={3}
          value={track.note}
          onChange={(e) => updateField("note", e.target.value)}
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
        />
      </section>

      {track.src && <audio controls className="w-full" src={track.src} preload="none" />}

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
