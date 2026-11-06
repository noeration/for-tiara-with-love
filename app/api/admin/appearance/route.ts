import { NextResponse } from "next/server";
import { getDraft, saveDraft } from "@/lib/content-store";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { config } = await getDraft();
    return NextResponse.json({ settings: config.appearance });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = await request.json();
    const settings = body?.settings;
    if (!settings || typeof settings !== "object") {
      return NextResponse.json({ error: "No settings" }, { status: 400 });
    }
    const { config } = await getDraft();
    const stored = await saveDraft({
      ...config,
      appearance: {
        background: settings.background ?? config.appearance.background,
        accent: settings.accent ?? config.appearance.accent,
        typography:
          settings.typography === "sans" ? "sans" : "serif",
        effects:
          typeof settings.effects === "boolean"
            ? settings.effects
            : config.appearance.effects,
      },
    });
    return NextResponse.json({ ok: true, settings: stored.config.appearance });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
