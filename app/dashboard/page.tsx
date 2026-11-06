"use client";

import { useState, type ChangeEvent } from "react";
import { birthday, type MemoryConfig, type Memory, type IconName } from "@/data/birthday";

const ICONS: IconName[] = ["sparkles", "heart", "flower", "star", "moon"];
const ASPECTS: Memory["aspect"][] = ["portrait", "square", "landscape"];

async function uploadFile(file: File, folder: string): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  return data.path as string;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender placeholder:text-muted-foreground/60 focus:border-orchid/40 focus:outline-none ${props.className ?? ""}`}
    />
  );
}

function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender placeholder:text-muted-foreground/60 focus:border-orchid/40 focus:outline-none ${props.className ?? ""}`}
    />
  );
}

function ImageField({ label, value, folder, onChange }: { label: string; value: string; folder: string; onChange: (v: string) => void }) {
  return (
    <Field label={label}>
      <div className="flex items-center gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="/images/..." />
        <label className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-lavender hover:bg-white/10">
          Upload
          <input
            type="file"
            accept="image/*,audio/*"
            className="hidden"
            onChange={async (e: ChangeEvent<HTMLInputElement>) => {
              const f = e.target.files?.[0];
              if (!f) return;
              try {
                const p = await uploadFile(f, folder);
                onChange(p);
              } catch (err) {
                alert((err as Error).message);
              }
              e.target.value = "";
            }}
          />
        </label>
      </div>
      {value ? (
        <div className="relative mt-2 h-20 w-20 overflow-hidden rounded-lg bg-white/5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" className="h-full w-full object-cover" />
        </div>
      ) : null}
    </Field>
  );
}

export default function DashboardPage() {
  const [cfg, setCfg] = useState<MemoryConfig>(() => structuredClone(birthday));
  const [status, setStatus] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config: cfg }),
      });
      if (!res.ok) throw new Error(await res.text());
      setStatus("Saved. Dev server will hot-reload the site.");
    } catch (err) {
      setStatus("Error: " + (err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  function set<K extends keyof MemoryConfig>(key: K, value: MemoryConfig[K]) {
    setCfg((c) => ({ ...c, [key]: value }));
  }

  return (
    <main className="mx-auto max-w-5xl px-5 py-10 text-lavender">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-orchid/70">setup dashboard</p>
          <h1 className="font-serif text-3xl sm:text-4xl">For Tiara, With Love</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Edit konten di sini, lalu tekan Save. File <code className="text-orchid">data/birthday.ts</code> akan diperbarui (hanya di mode dev).
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="rounded-full bg-linear-to-r from-lavender via-white to-petal px-6 py-2.5 text-sm font-medium text-plum shadow-[0_12px_40px_-16px_rgba(200,160,255,0.9)] disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {process.env.NODE_ENV !== "development" ? (
        <p className="mb-6 rounded-lg border border-rose/30 bg-rose/10 px-4 py-3 text-sm text-rose">
          Dashboard editing only works in dev mode. Run <code>npm run dev</code> locally to enable Save/upload.
        </p>
      ) : null}
      {status ? <p className="mb-6 text-sm text-orchid">{status}</p> : null}

      <div className="space-y-8">
        {/* Identity */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 font-serif text-xl">Identitas</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Nama penerima">
              <Input value={cfg.name} onChange={(e) => set("name", e.target.value)} />
            </Field>
            <Field label="Judul tab browser">
              <Input value={cfg.site.title} onChange={(e) => set("site", { ...cfg.site, title: e.target.value })} />
            </Field>
            <Field label="Deskripsi">
              <Input value={cfg.site.description} onChange={(e) => set("site", { ...cfg.site, description: e.target.value })} />
            </Field>
            <Field label="URL publik (setelah deploy)">
              <Input value={cfg.site.url} onChange={(e) => set("site", { ...cfg.site, url: e.target.value })} placeholder="https://..." />
            </Field>
          </div>
        </section>

        {/* Opening */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 font-serif text-xl">Pembuka</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Overline">
              <Input value={cfg.opening.overline} onChange={(e) => set("opening", { ...cfg.opening, overline: e.target.value })} />
            </Field>
            <Field label="Greeting">
              <Input value={cfg.opening.greeting} onChange={(e) => set("opening", { ...cfg.opening, greeting: e.target.value })} />
            </Field>
            <Field label="Subtitle">
              <Textarea rows={3} value={cfg.opening.subtitle} onChange={(e) => set("opening", { ...cfg.opening, subtitle: e.target.value })} />
            </Field>
            <Field label="Teks tombol">
              <Input value={cfg.opening.cta} onChange={(e) => set("opening", { ...cfg.opening, cta: e.target.value })} />
            </Field>
            <Field label="Hint">
              <Input value={cfg.opening.hint} onChange={(e) => set("opening", { ...cfg.opening, hint: e.target.value })} />
            </Field>
            <ImageField label="Potret" value={cfg.portrait.src} folder="images/tiara" onChange={(v) => set("portrait", { ...cfg.portrait, src: v })} />
            <Field label="Alt potret">
              <Input value={cfg.portrait.alt} onChange={(e) => set("portrait", { ...cfg.portrait, alt: e.target.value })} />
            </Field>
            <Field label="Caption potret">
              <Input value={cfg.portrait.caption} onChange={(e) => set("portrait", { ...cfg.portrait, caption: e.target.value })} />
            </Field>
          </div>
        </section>

        {/* Message */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 font-serif text-xl">Pesan Ulang Tahun</h2>
          <div className="grid gap-4">
            <Field label="Eyebrow">
              <Input value={cfg.message.eyebrow} onChange={(e) => set("message", { ...cfg.message, eyebrow: e.target.value })} />
            </Field>
            <Field label="Judul">
              <Input value={cfg.message.title} onChange={(e) => set("message", { ...cfg.message, title: e.target.value })} />
            </Field>
            <Field label="Paragraf (satu per kotak)">
              {cfg.message.paragraphs.map((p, i) => (
                <div key={i} className="mb-2 flex gap-2">
                  <Textarea rows={3} value={p} onChange={(e) => {
                    const next = [...cfg.message.paragraphs];
                    next[i] = e.target.value;
                    set("message", { ...cfg.message, paragraphs: next });
                  }} />
                  <button className="text-xs text-rose" onClick={() => {
                    const next = cfg.message.paragraphs.filter((_, j) => j !== i);
                    set("message", { ...cfg.message, paragraphs: next });
                  }}>✕</button>
                </div>
              ))}
              <button className="text-xs text-orchid" onClick={() => set("message", { ...cfg.message, paragraphs: [...cfg.message.paragraphs, ""] })}>+ paragraf</button>
            </Field>
            <Field label="Harapan (wishes)">
              {cfg.message.wishes.map((w, i) => (
                <div key={i} className="mb-3 rounded-lg border border-white/10 p-3">
                  <div className="grid gap-2 sm:grid-cols-2">
                    <select
                      value={w.icon}
                      onChange={(e) => {
                        const next = [...cfg.message.wishes];
                        next[i] = { ...w, icon: e.target.value as IconName };
                        set("message", { ...cfg.message, wishes: next });
                      }}
                      className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    >
                      {ICONS.map((ic) => <option key={ic} value={ic}>{ic}</option>)}
                    </select>
                    <Input value={w.title} placeholder="Judul" onChange={(e) => {
                      const next = [...cfg.message.wishes];
                      next[i] = { ...w, title: e.target.value };
                      set("message", { ...cfg.message, wishes: next });
                    }} />
                  </div>
                  <Textarea className="mt-2" rows={2} value={w.text} placeholder="Teks" onChange={(e) => {
                    const next = [...cfg.message.wishes];
                    next[i] = { ...w, text: e.target.value };
                    set("message", { ...cfg.message, wishes: next });
                  }} />
                  <button className="mt-2 text-xs text-rose" onClick={() => {
                    const next = cfg.message.wishes.filter((_, j) => j !== i);
                    set("message", { ...cfg.message, wishes: next });
                  }}>hapus</button>
                </div>
              ))}
              <button className="text-xs text-orchid" onClick={() => set("message", { ...cfg.message, wishes: [...cfg.message.wishes, { icon: "heart", title: "", text: "" }] })}>+ harapan</button>
            </Field>
          </div>
        </section>

        {/* Memories */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 font-serif text-xl">Kenangan</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Eyebrow"><Input value={cfg.memories.eyebrow} onChange={(e) => set("memories", { ...cfg.memories, eyebrow: e.target.value })} /></Field>
            <Field label="Judul"><Input value={cfg.memories.title} onChange={(e) => set("memories", { ...cfg.memories, title: e.target.value })} /></Field>
            <Field label="Deskripsi"><Textarea rows={2} value={cfg.memories.description} onChange={(e) => set("memories", { ...cfg.memories, description: e.target.value })} /></Field>
          </div>
          <div className="mt-4 space-y-3">
            {cfg.memories.items.map((m, i) => (
              <div key={m.id} className="rounded-lg border border-white/10 p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ImageField label="Foto" value={m.src} folder="images/memories" onChange={(v) => {
                    const next = [...cfg.memories.items];
                    next[i] = { ...m, src: v };
                    set("memories", { ...cfg.memories, items: next });
                  }} />
                  <div className="space-y-2">
                    <Field label="ID"><Input value={m.id} onChange={(e) => { const next=[...cfg.memories.items]; next[i]={...m,id:e.target.value}; set("memories",{...cfg.memories,items:next}); }} /></Field>
                    <Field label="Alt"><Input value={m.alt} onChange={(e) => { const next=[...cfg.memories.items]; next[i]={...m,alt:e.target.value}; set("memories",{...cfg.memories,items:next}); }} /></Field>
                    <Field label="Caption"><Input value={m.caption} onChange={(e) => { const next=[...cfg.memories.items]; next[i]={...m,caption:e.target.value}; set("memories",{...cfg.memories,items:next}); }} /></Field>
                    <Field label="Tanggal"><Input value={m.date ?? ""} onChange={(e) => { const next=[...cfg.memories.items]; next[i]={...m,date:e.target.value}; set("memories",{...cfg.memories,items:next}); }} /></Field>
                    <Field label="Aspect">
                      <select value={m.aspect ?? "portrait"} onChange={(e) => { const next=[...cfg.memories.items]; next[i]={...m,aspect:e.target.value as Memory["aspect"]}; set("memories",{...cfg.memories,items:next}); }} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm">
                        {ASPECTS.map((a) => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </Field>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={!!m.placeholder} onChange={(e) => { const next=[...cfg.memories.items]; next[i]={...m,placeholder:e.target.checked}; set("memories",{...cfg.memories,items:next}); }} />
                    placeholder
                  </label>
                  <button className="text-xs text-rose" onClick={() => {
                    const next = cfg.memories.items.filter((_, j) => j !== i);
                    set("memories", { ...cfg.memories, items: next });
                  }}>hapus</button>
                </div>
              </div>
            ))}
            <button className="text-xs text-orchid" onClick={() => set("memories", { ...cfg.memories, items: [...cfg.memories.items, { id: `memory-${cfg.memories.items.length + 1}`, src: "", alt: "", caption: "", aspect: "portrait", placeholder: true }] })}>+ kenangan</button>
          </div>
        </section>

        {/* Artworks */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 font-serif text-xl">Karya Seni</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Eyebrow"><Input value={cfg.artworks.eyebrow} onChange={(e) => set("artworks", { ...cfg.artworks, eyebrow: e.target.value })} /></Field>
            <Field label="Judul"><Input value={cfg.artworks.title} onChange={(e) => set("artworks", { ...cfg.artworks, title: e.target.value })} /></Field>
            <Field label="Deskripsi"><Textarea rows={2} value={cfg.artworks.description} onChange={(e) => set("artworks", { ...cfg.artworks, description: e.target.value })} /></Field>
          </div>
          <div className="mt-4 space-y-3">
            {cfg.artworks.items.map((a, i) => (
              <div key={a.id} className="rounded-lg border border-white/10 p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <ImageField label="Gambar" value={a.src} folder="images/artworks" onChange={(v) => {
                    const next = [...cfg.artworks.items];
                    next[i] = { ...a, src: v };
                    set("artworks", { ...cfg.artworks, items: next });
                  }} />
                  <div className="space-y-2">
                    <Field label="ID"><Input value={a.id} onChange={(e) => { const next=[...cfg.artworks.items]; next[i]={...a,id:e.target.value}; set("artworks",{...cfg.artworks,items:next}); }} /></Field>
                    <Field label="Judul"><Input value={a.title} onChange={(e) => { const next=[...cfg.artworks.items]; next[i]={...a,title:e.target.value}; set("artworks",{...cfg.artworks,items:next}); }} /></Field>
                    <Field label="Alt"><Input value={a.alt} onChange={(e) => { const next=[...cfg.artworks.items]; next[i]={...a,alt:e.target.value}; set("artworks",{...cfg.artworks,items:next}); }} /></Field>
                    <Field label="Tahun"><Input value={a.year ?? ""} onChange={(e) => { const next=[...cfg.artworks.items]; next[i]={...a,year:e.target.value}; set("artworks",{...cfg.artworks,items:next}); }} /></Field>
                    <Field label="Media"><Input value={a.medium ?? ""} onChange={(e) => { const next=[...cfg.artworks.items]; next[i]={...a,medium:e.target.value}; set("artworks",{...cfg.artworks,items:next}); }} /></Field>
                    <Field label="Aspect (w/h)"><Input type="number" step="0.01" value={a.aspect ?? 1.4} onChange={(e) => { const next=[...cfg.artworks.items]; next[i]={...a,aspect:Number(e.target.value)}; set("artworks",{...cfg.artworks,items:next}); }} /></Field>
                    <Field label="Deskripsi"><Textarea rows={3} value={a.description} onChange={(e) => { const next=[...cfg.artworks.items]; next[i]={...a,description:e.target.value}; set("artworks",{...cfg.artworks,items:next}); }} /></Field>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs">
                    <input type="checkbox" checked={!!a.placeholder} onChange={(e) => { const next=[...cfg.artworks.items]; next[i]={...a,placeholder:e.target.checked}; set("artworks",{...cfg.artworks,items:next}); }} />
                    placeholder
                  </label>
                  <button className="text-xs text-rose" onClick={() => {
                    const next = cfg.artworks.items.filter((_, j) => j !== i);
                    set("artworks", { ...cfg.artworks, items: next });
                  }}>hapus</button>
                </div>
              </div>
            ))}
            <button className="text-xs text-orchid" onClick={() => set("artworks", { ...cfg.artworks, items: [...cfg.artworks.items, { id: `artwork-${cfg.artworks.items.length + 1}`, src: "", alt: "", title: "", year: "", medium: "", description: "", aspect: 1.4, placeholder: true }] })}>+ karya</button>
          </div>
        </section>

        {/* Letter */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 font-serif text-xl">Surat & Puisi</h2>
          <div className="grid gap-4">
            <Field label="Eyebrow"><Input value={cfg.letter.eyebrow} onChange={(e) => set("letter", { ...cfg.letter, eyebrow: e.target.value })} /></Field>
            <Field label="Judul"><Input value={cfg.letter.title} onChange={(e) => set("letter", { ...cfg.letter, title: e.target.value })} /></Field>
            <Field label="Hint"><Input value={cfg.letter.hint} onChange={(e) => set("letter", { ...cfg.letter, hint: e.target.value })} /></Field>
            <Field label="Salam pembuka">
              <Input value={cfg.letter.content.greeting} onChange={(e) => set("letter", { ...cfg.letter, content: { ...cfg.letter.content, greeting: e.target.value } })} />
            </Field>
            <Field label="Paragraf surat">
              {cfg.letter.content.paragraphs.map((p, i) => (
                <div key={i} className="mb-2 flex gap-2">
                  <Textarea rows={3} value={p} onChange={(e) => {
                    const next = [...cfg.letter.content.paragraphs];
                    next[i] = e.target.value;
                    set("letter", { ...cfg.letter, content: { ...cfg.letter.content, paragraphs: next } });
                  }} />
                  <button className="text-xs text-rose" onClick={() => {
                    const next = cfg.letter.content.paragraphs.filter((_, j) => j !== i);
                    set("letter", { ...cfg.letter, content: { ...cfg.letter.content, paragraphs: next } });
                  }}>✕</button>
                </div>
              ))}
              <button className="text-xs text-orchid" onClick={() => set("letter", { ...cfg.letter, content: { ...cfg.letter.content, paragraphs: [...cfg.letter.content.paragraphs, ""] } })}>+ paragraf</button>
            </Field>
            <Field label="Judul puisi">
              <Input value={cfg.letter.content.poem.title} onChange={(e) => set("letter", { ...cfg.letter, content: { ...cfg.letter.content, poem: { ...cfg.letter.content.poem, title: e.target.value } } })} />
            </Field>
            <Field label="Baris puisi">
              {cfg.letter.content.poem.lines.map((l, i) => (
                <div key={i} className="mb-2 flex gap-2">
                  <Input value={l} onChange={(e) => {
                    const next = [...cfg.letter.content.poem.lines];
                    next[i] = e.target.value;
                    set("letter", { ...cfg.letter, content: { ...cfg.letter.content, poem: { ...cfg.letter.content.poem, lines: next } } });
                  }} />
                  <button className="text-xs text-rose" onClick={() => {
                    const next = cfg.letter.content.poem.lines.filter((_, j) => j !== i);
                    set("letter", { ...cfg.letter, content: { ...cfg.letter.content, poem: { ...cfg.letter.content.poem, lines: next } } });
                  }}>✕</button>
                </div>
              ))}
              <button className="text-xs text-orchid" onClick={() => set("letter", { ...cfg.letter, content: { ...cfg.letter.content, poem: { ...cfg.letter.content.poem, lines: [...cfg.letter.content.poem.lines, ""] } } })}>+ baris</button>
            </Field>
            <Field label="Penutup surat">
              <Input value={cfg.letter.content.closing} onChange={(e) => set("letter", { ...cfg.letter, content: { ...cfg.letter.content, closing: e.target.value } })} />
            </Field>
            <Field label="Tanda tangan">
              <Input value={cfg.letter.content.signature} onChange={(e) => set("letter", { ...cfg.letter, content: { ...cfg.letter.content, signature: e.target.value } })} />
            </Field>
            <Field label="Dari">
              <Input value={cfg.letter.content.from} onChange={(e) => set("letter", { ...cfg.letter, content: { ...cfg.letter.content, from: e.target.value } })} />
            </Field>
          </div>
        </section>

        {/* Song */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 font-serif text-xl">Lagu</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Eyebrow"><Input value={cfg.song.eyebrow} onChange={(e) => set("song", { ...cfg.song, eyebrow: e.target.value })} /></Field>
            <Field label="Judul section"><Input value={cfg.song.title} onChange={(e) => set("song", { ...cfg.song, title: e.target.value })} /></Field>
            <Field label="Deskripsi"><Textarea rows={2} value={cfg.song.description} onChange={(e) => set("song", { ...cfg.song, description: e.target.value })} /></Field>
            <Field label="Judul lagu"><Input value={cfg.song.track.title} onChange={(e) => set("song", { ...cfg.song, track: { ...cfg.song.track, title: e.target.value } })} /></Field>
            <Field label="Penyanyi"><Input value={cfg.song.track.artist} onChange={(e) => set("song", { ...cfg.song, track: { ...cfg.song.track, artist: e.target.value } })} /></Field>
            <ImageField label="Cover lagu" value={cfg.song.track.cover} folder="images/tiara" onChange={(v) => set("song", { ...cfg.song, track: { ...cfg.song.track, cover: v } })} />
            <Field label="File audio">
              <div className="flex items-center gap-2">
                <Input value={cfg.song.track.src} onChange={(e) => set("song", { ...cfg.song, track: { ...cfg.song.track, src: e.target.value } })} />
                <label className="cursor-pointer rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-lavender hover:bg-white/10">
                  Upload
                  <input type="file" accept="audio/*" className="hidden" onChange={async (e) => {
                    const f = e.target.files?.[0]; if (!f) return;
                    try { const p = await uploadFile(f, "audio"); set("song", { ...cfg.song, track: { ...cfg.song.track, src: p } }); } catch (err) { alert((err as Error).message); }
                    e.target.value = "";
                  }} />
                </label>
              </div>
            </Field>
            <Field label="Catatan">
              <Textarea rows={3} value={cfg.song.track.note} onChange={(e) => set("song", { ...cfg.song, track: { ...cfg.song.track, note: e.target.value } })} />
            </Field>
          </div>
        </section>

        {/* Finale */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 font-serif text-xl">Penutup</h2>
          <div className="grid gap-4">
            <Field label="Eyebrow"><Input value={cfg.finale.eyebrow} onChange={(e) => set("finale", { ...cfg.finale, eyebrow: e.target.value })} /></Field>
            <Field label="Judul"><Input value={cfg.finale.title} onChange={(e) => set("finale", { ...cfg.finale, title: e.target.value })} /></Field>
            <Field label="Pesan">
              {cfg.finale.message.map((p, i) => (
                <div key={i} className="mb-2 flex gap-2">
                  <Textarea rows={2} value={p} onChange={(e) => {
                    const next = [...cfg.finale.message];
                    next[i] = e.target.value;
                    set("finale", { ...cfg.finale, message: next });
                  }} />
                  <button className="text-xs text-rose" onClick={() => {
                    const next = cfg.finale.message.filter((_, j) => j !== i);
                    set("finale", { ...cfg.finale, message: next });
                  }}>✕</button>
                </div>
              ))}
              <button className="text-xs text-orchid" onClick={() => set("finale", { ...cfg.finale, message: [...cfg.finale.message, ""] })}>+ pesan</button>
            </Field>
            <Field label="Closing"><Input value={cfg.finale.closing} onChange={(e) => set("finale", { ...cfg.finale, closing: e.target.value })} /></Field>
            <Field label="Signature"><Input value={cfg.finale.signature} onChange={(e) => set("finale", { ...cfg.finale, signature: e.target.value })} /></Field>
            <Field label="Teks tombol rayakan"><Input value={cfg.finale.celebrate} onChange={(e) => set("finale", { ...cfg.finale, celebrate: e.target.value })} /></Field>
            <Field label="Teks tombol kembali"><Input value={cfg.finale.replay} onChange={(e) => set("finale", { ...cfg.finale, replay: e.target.value })} /></Field>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            onClick={save}
            disabled={saving}
            className="rounded-full bg-linear-to-r from-lavender via-white to-petal px-6 py-2.5 text-sm font-medium text-plum shadow-[0_12px_40px_-16px_rgba(200,160,255,0.9)] disabled:opacity-60"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </main>
  );
}
