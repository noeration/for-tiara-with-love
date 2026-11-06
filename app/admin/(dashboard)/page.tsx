"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock, CheckCircle2 } from "lucide-react";

export default function AdminOverview() {
  const [status, setStatus] = useState<{ publishedAt: string | null; draftAt: string | null } | null>(null);

  useEffect(() => {
    fetch("/api/admin/content")
      .then(r => r.json())
      .then(d => setStatus({ publishedAt: d.publishedAt, draftAt: d.draftAt }))
      .catch(() => setStatus(null));
  }, []);

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="font-serif text-3xl sm:text-4xl text-lavender mb-2">Overview</h1>
      <p className="text-muted-foreground mb-8">Manage the public birthday experience for Tiara.</p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
        {[
          { title: "Content Editor", desc: "Birthday introduction, letter, wishes, finale", href: "/admin/content" },
          { title: "Memories", desc: "Photographs, captions, and ordering", href: "/admin/memories" },
          { title: "Artwork", desc: "Single artwork display and caption", href: "/admin/artworks" },
          { title: "Music", desc: "Audio track, title, and artist", href: "/admin/music" },
          { title: "Appearance", desc: "Palette, fonts, and effects", href: "/admin/appearance" },
          { title: "Publish", desc: "Save draft or publish changes", href: "/admin/publish" },
        ].map((card) => (
          <Link
            key={card.title}
            href={card.href}
            className="group rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:border-orchid/30 hover:bg-white/[0.08]"
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-serif text-xl text-lavender">{card.title}</h3>
              <ArrowUpRight className="h-5 w-5 text-orchid/60 group-hover:text-orchid transition" />
            </div>
            <p className="text-sm text-muted-foreground">{card.desc}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 mb-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-serif text-lg mb-3 text-lavender">Publication Status</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-4 w-4 text-green-400" />
              <span>Public website is live at <a href="/" className="underline text-orchid hover:text-white">/</a></span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Published: {status?.publishedAt ? new Date(status.publishedAt).toLocaleString() : "Not yet published"}</span>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h3 className="font-serif text-lg mb-3 text-lavender">Quick Actions</h3>
          <div className="flex gap-3 flex-wrap">
            <a href="/" target="_blank" rel="noopener noreferrer" className="rounded-full bg-gradient-to-r from-orchid/80 to-violet-400/80 px-5 py-2.5 text-sm font-medium text-white shadow-lg">Open Public Site</a>
            <a href="/admin/content" className="rounded-full border border-white/10 px-5 py-2.5 text-sm font-medium text-lavender hover:bg-white/5">Edit Content</a>
          </div>
        </div>
      </div>
    </div>
  );
}
