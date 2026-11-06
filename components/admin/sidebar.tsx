"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Image, Music2, FileText, Palette,
  Settings, LogOut, Shield, Lock, ArrowRight,
} from "lucide-react";

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Content Editor", href: "/admin/content", icon: FileText },
  { name: "Memories", href: "/admin/memories", icon: Image },
  { name: "Artwork", href: "/admin/artworks", icon: Image },
  { name: "Music", href: "/admin/music", icon: Music2 },
  { name: "Appearance", href: "/admin/appearance", icon: Palette },
  { name: "Publish", href: "/admin/publish", icon: Shield },
];

export function Sidebar({ email }: { email: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={`flex-shrink-0 bg-lilac/10 border-r border-white/10 backdrop-blur-xl px-3 py-6 h-full fixed lg:static h-[calc(100vh-1rem)] lg:h-auto top-1 lg:top-0 left-0 lg:left-0 rounded-2xl lg:rounded-none lg:border-r-0 border-b-0 lg:border-b border-t-0 lg:border-t w-[250px] lg:w-auto ${collapsed ? "w-16" : ""}`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-2 right-2 lg:hidden p-2 rounded-lg bg-white/5 hover:bg-white/10 text-lavender"
        aria-label={collapsed ? "Expand menu" : "Collapse menu"}
      >
        <ArrowRight className="h-4 w-4" />
      </button>

      <nav className="mt-4 space-y-1 px-2 lg:px-0">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? "bg-white/20 text-white shadow-lg"
                  : "text-lavender/80 hover:bg-white/10 hover:text-white"
              } ${collapsed ? "justify-center px-1" : ""}`}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon className={`h-5 w-5 ${isActive ? "text-white" : "text-orchid/60"}`} />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 px-3 lg:px-0 space-y-2">
        <div className="px-2 pt-2 pb-1 border-t border-white/10">
          <p className={`text-xs text-lavender/60 ${collapsed ? "hidden" : "block"}`}>
            Signed in as
          </p>
          <div className={`flex items-center gap-2 ${collapsed ? "justify-center" : ""}`}>
            <Lock className={`h-4 w-4 ${collapsed ? "text-orchid/60" : "text-orchid/50"}`} />
            <span className={`text-xs font-medium ${collapsed ? "hidden" : "block"} text-lavender`}>{email.split("@")[0]}…</span>
          </div>
        </div>
        <button
          onClick={() => {}}
          className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium text-orchid hover:bg-white/5 transition ${collapsed ? "justify-center px-1" : ""}`}
          form="logout-form"
        >
          <LogOut className="h-4 w-4" />
          <span className={`${collapsed ? "hidden" : "block"}`}>Sign out</span>
        </button>
        <form id="logout-form" action="/api/auth/logout" method="POST" className="hidden">
          <button type="submit">Sign out</button>
        </form>
      </div>
    </aside>
  );
}