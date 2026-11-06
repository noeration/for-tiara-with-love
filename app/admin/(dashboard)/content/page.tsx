"use client";

import { useState, useEffect, useRef } from "react";
import type { MemoryConfig } from "@/data/birthday";

type FormError = { field: string; message: string };

export default function ContentEditor() {
  const [cfg, setCfg] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const portraitFileInput = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetch("/api/admin/content")
      .then(r => r.json())
      .then(d => { setCfg(d.config ?? null); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (!cfg) return <div className="text-muted-foreground">Loading…</div>;

  function updateField(key: string, val: any) {
    setCfg({ ...cfg, [key]: val });
  }

  async function uploadPortrait(file: File) {
    setUploading(true);
    setStatus(null);
    try {
      const body = new FormData();
      body.append("file", file);
      body.append("folder", "images");
      const res = await fetch("/api/admin/storage", { method: "POST", body });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Upload failed (${res.status})`);
      updateField("portrait", { ...cfg.portrait, src: data.url, placeholder: false });
      setStatus("Portrait uploaded. Click Save Draft to keep it.");
    } catch (err) {
      setStatus("Upload failed: " + String(err));
    } finally {
      setUploading(false);
    }
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ config: cfg }) });
      if (!res.ok) throw new Error(await res.text());
      setStatus("Draft saved. Changes will not appear publicly until you Publish.");
    } catch (err) {
      setStatus("Save failed: " + String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-start justify-between">
        <h1 className="font-serif text-3xl sm:text-4xl text-lavender mb-1">Content Editor</h1>
        <button
          form="content-form"
          disabled={saving}
          className="rounded-full bg-gradient-to-r from-orchid/80 to-violet-400/80 px-6 py-2.5 text-sm font-medium text-white shadow-lg disabled:opacity-60 transition"
        >
          {saving ? "Saving…" : "Save Draft"}
        </button>
      </div>
      {status && <p className={`text-sm ${status.startsWith("Save failed") ? "text-rose" : "text-orchid"}`}>{status}</p>}

      <form id="content-form" onSubmit={handleSave} className="space-y-8">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-serif text-xl mb-4 text-lavender">Birthday Introduction</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Section Title</label>
              <input
                value={cfg.message.title}
                onChange={e => updateField("message", { ...cfg.message, title: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Section Eyebrow</label>
              <input
                value={cfg.message.eyebrow}
                onChange={e => updateField("message", { ...cfg.message, eyebrow: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {cfg.message.paragraphs.map((p: string, i: number) => (
              <div key={i} className="flex gap-2">
                <textarea
                  rows={3}
                  value={p}
                  onChange={e => {
                    const next = [...cfg.message.paragraphs];
                    next[i] = e.target.value;
                    updateField("message", { ...cfg.message, paragraphs: next });
                  }}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
                />
                <button type="button" onClick={() => {
                  const next = cfg.message.paragraphs.filter((_: string, j: number) => j !== i);
                  updateField("message", { ...cfg.message, paragraphs: next });
                }} className="text-xs text-rose">✕</button>
              </div>
            ))}
            <button type="button" className="text-xs text-orchid" onClick={() => updateField("message", { ...cfg.message, paragraphs: [...cfg.message.paragraphs, ""] })}>+ Add paragraph</button>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-serif text-xl mb-4 text-lavender">Intro Image (portrait)</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Image URL</label>
              <input
                value={cfg.portrait.src}
                onChange={e => updateField("portrait", { ...cfg.portrait, src: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Upload image</label>
              <input
                ref={portraitFileInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) uploadPortrait(file);
                  e.target.value = "";
                }}
              />
              <button
                type="button"
                disabled={uploading}
                onClick={() => portraitFileInput.current?.click()}
                className="w-full rounded-lg border border-orchid/30 bg-orchid/10 px-3 py-2 text-xs text-orchid hover:bg-orchid/20 disabled:opacity-60"
              >
                {uploading ? "Uploading…" : cfg.portrait.src ? "Replace image" : "Upload image"}
              </button>
            </div>
            {cfg.portrait.src && (
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Preview</label>
                <div className="relative flex min-h-[96px] items-center justify-center overflow-hidden rounded-lg bg-black/30">
                  <img src={cfg.portrait.src} alt={cfg.portrait.alt} className="h-full max-h-48 w-full object-cover" />
                </div>
              </div>
            )}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Alt Text</label>
              <input
                value={cfg.portrait.alt}
                onChange={e => updateField("portrait", { ...cfg.portrait, alt: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Caption</label>
              <input
                value={cfg.portrait.caption}
                onChange={e => updateField("portrait", { ...cfg.portrait, caption: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
              />
            </div>
            <div className="space-y-2 flex items-end">
              <label className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <input
                  type="checkbox"
                  checked={cfg.portrait.placeholder === true}
                  onChange={e => updateField("portrait", { ...cfg.portrait, placeholder: e.target.checked })}
                  className="h-4 w-4 accent-orchid"
                />
                Placeholder mode
              </label>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-serif text-xl mb-4 text-lavender">Candle Wishes</h2>
          <div className="space-y-3">
            {cfg.message.wishes.map((w: any, i: number) => (
              <div key={i} className="rounded-lg border border-white/10 p-4">
                <div className="grid gap-2 sm:grid-cols-2">
                  <input
                    value={w.title}
                    onChange={e => {
                      const next = [...cfg.message.wishes];
                      next[i] = { ...w, title: e.target.value };
                      updateField("message", { ...cfg.message, wishes: next });
                    }}
                    placeholder="Wish title"
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
                  />
                  <button type="button" className="text-xs text-rose" onClick={() => {
                    const next = cfg.message.wishes.filter((_: any, j: number) => j !== i);
                    updateField("message", { ...cfg.message, wishes: next });
                  }}>Remove</button>
                </div>
                <textarea
                  rows={2}
                  value={w.text}
                  onChange={e => {
                    const next = [...cfg.message.wishes];
                    next[i] = { ...w, text: e.target.value };
                    updateField("message", { ...cfg.message, wishes: next });
                  }}
                  placeholder="Wish text"
                  className="w-full mt-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
                />
              </div>
            ))}
            <button type="button" className="text-xs text-orchid" onClick={() => updateField("message", { ...cfg.message, wishes: [...cfg.message.wishes, { title: "", text: "" }] })}>+ Add wish</button>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-serif text-xl mb-4 text-lavender">Artwork Caption</h2>
          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Caption</label>
            <textarea
              rows={2}
              value={cfg.artworks.items[0]?.description ?? ""}
              onChange={e => {
                const next = [...cfg.artworks.items];
                if (!next.length) next.push({ id: "artwork-01", src: "", alt: "", title: "", description: e.target.value, aspect: 1.4, placeholder: true });
                else next[0] = { ...next[0], description: e.target.value };
                updateField("artworks", { ...cfg.artworks, items: next });
              }}
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
            />
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-serif text-xl mb-4 text-lavender">Finale</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Main Heading</label>
              <input
                value={cfg.finale.title}
                onChange={e => updateField("finale", { ...cfg.finale, title: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Closing</label>
              <input
                value={cfg.finale.closing}
                onChange={e => updateField("finale", { ...cfg.finale, closing: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Signature</label>
              <input
                value={cfg.finale.signature}
                onChange={e => updateField("finale", { ...cfg.finale, signature: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Celebrate Button Text</label>
              <input
                value={cfg.finale.celebrate}
                onChange={e => updateField("finale", { ...cfg.finale, celebrate: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {cfg.finale.message.map((m: string, i: number) => (
              <div key={i} className="flex gap-2">
                <textarea
                  rows={2}
                  value={m}
                  onChange={e => {
                    const next = [...cfg.finale.message];
                    next[i] = e.target.value;
                    updateField("finale", { ...cfg.finale, message: next });
                  }}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
                />
                <button type="button" onClick={() => {
                  const next = cfg.finale.message.filter((_: string, j: number) => j !== i);
                  updateField("finale", { ...cfg.finale, message: next });
                }} className="text-xs text-rose">✕</button>
              </div>
            ))}
            <button type="button" className="text-xs text-orchid" onClick={() => updateField("finale", { ...cfg.finale, message: [...cfg.finale.message, ""] })}>+ Add message</button>
          </div>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="font-serif text-xl mb-4 text-lavender">Letter</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Letter Title</label>
              <input
                value={cfg.letter.title}
                onChange={e => updateField("letter", { ...cfg.letter, title: e.target.value })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Opening Greeting</label>
              <input
                value={cfg.letter.content.greeting}
                onChange={e => updateField("letter", { ...cfg.letter, content: { ...cfg.letter.content, greeting: e.target.value } })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Letter Closing</label>
              <input
                value={cfg.letter.content.closing}
                onChange={e => updateField("letter", { ...cfg.letter, content: { ...cfg.letter.content, closing: e.target.value } })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Signature</label>
              <input
                value={cfg.letter.content.signature}
                onChange={e => updateField("letter", { ...cfg.letter, content: { ...cfg.letter.content, signature: e.target.value } })}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
              />
            </div>
          </div>
          <div className="space-y-2 mt-4">
            <label className="block text-xs uppercase tracking-[0.2em] text-muted-foreground">Paragraphs</label>
            {cfg.letter.content.paragraphs.map((p: string, i: number) => (
              <div key={i} className="flex gap-2">
                <textarea
                  rows={3}
                  value={p}
                  onChange={e => {
                    const next = [...cfg.letter.content.paragraphs];
                    next[i] = e.target.value;
                    updateField("letter", { ...cfg.letter, content: { ...cfg.letter.content, paragraphs: next } });
                  }}
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
                />
                <button type="button" onClick={() => {
                  const next = cfg.letter.content.paragraphs.filter((_: string, j: number) => j !== i);
                  updateField("letter", { ...cfg.letter, content: { ...cfg.letter.content, paragraphs: next } });
                }} className="text-xs text-rose">✕</button>
              </div>
            ))}
            <button type="button" className="text-xs text-orchid" onClick={() => updateField("letter", { ...cfg.letter, content: { ...cfg.letter.content, paragraphs: [...cfg.letter.content.paragraphs, ""] } })}>+ Add paragraph</button>
          </div>
        </section>
      </form>
    </div>
  );
}
