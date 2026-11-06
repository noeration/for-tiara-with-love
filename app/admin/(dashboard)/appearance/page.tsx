"use client";

import { useEffect, useState } from "react";
import type { MemoryConfig } from "@/data/birthday";

type Settings = MemoryConfig["appearance"];
type Status = { kind: "ok" | "err"; text: string } | null;

const DEFAULTS: Settings = {
  background: "#140a22",
  accent: "#d8b4fe",
  typography: "serif",
  effects: true,
};

export default function AppearancePage() {
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<Status>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch("/api/admin/appearance", { cache: "no-store" });
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
        if (!cancelled) setSettings({ ...DEFAULTS, ...(data.settings ?? {}) });
      } catch (err) {
        if (!cancelled) {
          setStatus({ kind: "err", text: `Could not load appearance: ${String(err)}` });
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

  function setSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSave() {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch("/api/admin/appearance", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || `Save failed (${res.status})`);
      setSettings({ ...DEFAULTS, ...(data.settings ?? {}) });
      setStatus({ kind: "ok", text: "Appearance saved. Publish to show it on the public site." });
    } catch (err) {
      setStatus({ kind: "err", text: `Save failed: ${String(err)}` });
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="text-muted-foreground">Loading…</div>;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="font-serif text-3xl sm:text-4xl text-lavender">Appearance</h1>
      {status && (
        <p className={`text-sm ${status.kind === "ok" ? "text-green-400" : "text-rose"}`}>
          {status.text}
        </p>
      )}

      <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-6">
        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground block mb-2">Background Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={settings.background}
              onChange={(e) => setSetting("background", e.target.value)}
              className="w-10 h-10 rounded-lg border border-white/10 p-0 bg-transparent"
            />
            <span className="text-sm font-mono">{settings.background}</span>
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground block mb-2">Accent Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={settings.accent}
              onChange={(e) => setSetting("accent", e.target.value)}
              className="w-10 h-10 rounded-lg border border-white/10 p-0 bg-transparent"
            />
            <span className="text-sm font-mono">{settings.accent}</span>
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-[0.2em] text-muted-foreground block mb-2">Typography</label>
          <select
            value={settings.typography}
            onChange={(e) => setSetting("typography", e.target.value as Settings["typography"])}
            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender w-full"
          >
            <option value="serif">Serif (Elegant / Editorial)</option>
            <option value="sans">Sans (Modern / Clean)</option>
          </select>
        </div>

        <label className="flex items-center gap-3 text-sm text-lavender">
          <input
            type="checkbox"
            checked={settings.effects}
            onChange={(e) => setSetting("effects", e.target.checked)}
            className="h-4 w-4 accent-orchid"
          />
          Ambient effects (glow, petals, stars)
        </label>
      </section>

      <button
        type="button"
        disabled={saving}
        onClick={handleSave}
        className="rounded-full bg-gradient-to-r from-orchid/80 to-violet-400/80 px-6 py-2.5 text-sm font-medium text-white shadow-lg disabled:opacity-60 transition"
      >
        {saving ? "Saving…" : "Save Appearance"}
      </button>
    </div>
  );
}
