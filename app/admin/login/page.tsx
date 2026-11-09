import { createServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";
import { Lock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminLogin({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const configured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  if (configured) {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-deep px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-6 text-center">
          <Lock className="mx-auto h-12 w-12 text-orchid" />
          <h1 className="mt-4 font-serif text-2xl text-lavender">Admin Access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in with your administrator account to manage the birthday website.
          </p>
        </div>
        {error && (
          <p className="mb-4 rounded-lg border border-rose/30 bg-rose/10 px-3 py-2 text-sm text-rose">
            {error}
          </p>
        )}
        <form action="/api/auth/login" method="POST" className="space-y-4">
          <label className="block space-y-1.5">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Email</span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Password</span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-lavender focus:border-orchid/40 focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-full bg-gradient-to-r from-orchid/80 to-violet-400/80 px-6 py-2.5 text-sm font-medium text-white shadow-lg transition hover:brightness-110"
          >
            Sign In
          </button>
        </form>
        <p className="mt-5 text-center text-xs text-muted-foreground">
          Local development bypass is active when <code>ADMIN_DEV_BYPASS=true</code>.
        </p>
      </div>
    </main>
  );
}
