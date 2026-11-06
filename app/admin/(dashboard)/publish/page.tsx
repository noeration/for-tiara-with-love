"use client";

import { useState, useEffect } from "react";

export default function PublishPage() {
  const [publishedAt, setPublishedAt] = useState<string | null>(null);
  const [draftAt, setDraftAt] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  async function load() {
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      setPublishedAt(data.publishedAt ?? null);
      setDraftAt(data.draftAt ?? null);
    } catch {}
  }

  useEffect(() => { load(); }, []);

  async function handlePublish() {
    if (!confirm("Publish all draft changes to the public website? This cannot be undone.")) return;
    setPublishing(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/publish", { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      setStatus("Changes published successfully. Public website now shows the latest content.");
      await load();
    } catch (err) {
      setStatus("Publish failed: " + String(err));
    } finally {
      setPublishing(false);
    }
  }

  async function handleSaveDraft() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ config: null }) });
      if (!res.ok) throw new Error(await res.text());
      setStatus("Draft saved.");
    } catch (err) {
      setStatus("Save failed: " + String(err));
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="font-serif text-3xl sm:text-4xl text-lavender">Publish</h1>
      {status && <p className={`text-sm ${status.startsWith("Changes published") ? "text-green-400" : status.startsWith("Draft saved") ? "text-amber-300" : "text-rose"}`}>{status}</p>}

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Published at</p>
          <p className="text-sm text-lavender">{publishedAt ? new Date(publishedAt).toLocaleString() : "Not yet published"}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-1">Last draft saved</p>
          <p className="text-sm text-lavender">{draftAt ? new Date(draftAt).toLocaleString() : "No draft yet"}</p>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          disabled={publishing}
          onClick={handlePublish}
          className="rounded-full bg-gradient-to-r from-green-400/80 to-emerald-500/80 px-6 py-2.5 text-sm font-medium text-white shadow-lg disabled:opacity-60 transition"
        >
          {publishing ? "Publishing…" : "Publish Changes"}
        </button>
        <button
          disabled={saving}
          onClick={handleSaveDraft}
          className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-medium text-lavender hover:bg-white/5 disabled:opacity-60 transition"
        >
          {saving ? "Saving…" : "Save Draft"}
        </button>
        <a href="/" target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/10 px-6 py-2.5 text-sm font-medium text-lavender hover:bg-white/5 transition">
          View Public Site
        </a>
      </div>
    </div>
  );
}