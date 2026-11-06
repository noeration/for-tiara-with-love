"use client";

import { useEffect, useRef, useState } from "react";
import type { Memory } from "@/data/birthday";

type Status = { kind: "ok" | "err"; text: string } | null;

const EMPTY_MEMORY = (): Memory => ({
  id: `memory-${Date.now()}`,
  src: "",
  alt: "",
  caption: "New memory",
  date: "",
  aspect: "portrait",
  placeholder: true,
});

export default function MemoriesPage() {
  const [items, setItems] = useState<Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/admin/memories", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
        if (!cancelled) setItems(Array.isArray(data.items) ? data.items : []);
      } catch (err) {
        if (!cancelled) {
          setStatus({ kind: "err", text: `Could not load memories: ${String(err)}` });
          setItems([]);
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

  function update(i: number, patch: Partial<Memory>) {
    setItems((prev) => prev.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  function move(i: number, direction: -1 | 1) {
    setItems((prev) => {
      const target = i + direction;
      if (target < 0 || target >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[target]] = [next[target], next[i]];
      return next;
    });
  }

  async function upload(i: number, file: File) {
    setUploading(items[i]?.id ?? String(i));
    setStatus(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "memories");
      const res = await fetch("/api/admin/storage", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Upload failed (${res.status})`);
      update(i, { src: data.url, placeholder: false });
      setStatus({ kind: "ok", text: "Photo uploaded. Click Save Draft to keep it." });
    } catch (err) {
      setStatus({ kind: "err", text: `Upload failed: ${String(err)}` });
    } finally {
      setUploading(null);
    }
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/memories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Save failed (${res.status})`);
      setStatus({ kind: "ok", text: "Memories saved. Publish to show them on the public site." });
    } catch (err) {
      setStatus({ kind: "err", text: `Save failed: ${String(err)}` });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-serif text-3xl sm:text-4xl text-lavender">Memories</h1>
        <button
          type="button"
          onClick={() => setItems((prev) => [...prev, EMPTY_MEMORY()])}
          className="rounded-full border border-white/15 px-5 py-2 text-sm text-lavender hover:bg-white/5"
        >
          + Add memory
        </button>
      </div>

      {status && (
        <p className={`text-sm ${status.kind === "ok" ? "text-green-400" : "text-rose"}`}>
          {status.text}
        </p>
      )}

      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <div className="mb-4 text-sm text-muted-foreground">
          Upload a photo for each memory, then reorder with the arrows. Click Save Draft when done.
        </div>

        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={item.id} className="rounded-lg border border-white/10 bg-white/5 p-4">
              <div className="grid gap-3 sm:grid-cols-[12rem_1fr_auto]">
                <div className="space-y-2">
                  <div className="relative flex min-h-[96px] items-center justify-center overflow-hidden rounded-lg bg-black/30">
                    {item.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.src}
                        alt={item.alt || item.caption}
                        className="h-full max-h-48 w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-muted-foreground">No photo yet</span>
                    )}
                  </div>
                  <input
                    ref={(el) => {
                      fileInputs.current[item.id] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) upload(i, file);
                      e.target.value = "";
                    }}
                  />
                  <button
                    type="button"
                    disabled={uploading === item.id}
                    onClick={() => fileInputs.current[item.id]?.click()}
                    className="w-full rounded-lg border border-orchid/30 bg-orchid/10 px-3 py-2 text-xs text-orchid hover:bg-orchid/20 disabled:opacity-60"
                  >
                    {uploading === item.id ? "Uploading…" : item.src ? "Replace photo" : "Upload photo"}
                  </button>
                </div>

                <div className="min-w-0 space-y-2">
                  <input
                    value={item.caption ?? ""}
                    onChange={(e) => update(i, { caption: e.target.value })}
                    placeholder="Caption"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
                  />
                  <input
                    value={item.alt ?? ""}
                    onChange={(e) => update(i, { alt: e.target.value })}
                    placeholder="Alt text"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
                  />
                  <input
                    value={item.date ?? ""}
                    onChange={(e) => update(i, { date: e.target.value })}
                    placeholder="Date (optional)"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
                  />
                  <select
                    value={item.aspect ?? "portrait"}
                    onChange={(e) => update(i, { aspect: e.target.value as Memory["aspect"] })}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
                  >
                    <option value="portrait">Portrait 4:5</option>
                    <option value="square">Square 1:1</option>
                    <option value="landscape">Landscape 4:3</option>
                  </select>
                </div>

                <div className="flex flex-col gap-2">
                  <button
                    type="button"
                    onClick={() => move(i, -1)}
                    disabled={i === 0}
                    className="rounded-lg border border-white/10 px-3 py-1 text-xs text-lavender disabled:opacity-30"
                  >
                    ↑ Up
                  </button>
                  <button
                    type="button"
                    onClick={() => move(i, 1)}
                    disabled={i === items.length - 1}
                    className="rounded-lg border border-white/10 px-3 py-1 text-xs text-lavender disabled:opacity-30"
                  >
                    ↓ Down
                  </button>
                  <button
                    type="button"
                    onClick={() => setItems((prev) => prev.filter((_, idx) => idx !== i))}
                    className="rounded-lg border border-rose/30 px-3 py-1 text-xs text-rose hover:bg-rose/10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No memories yet. Click “Add memory” to create one.
            </p>
          )}
        </div>
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
