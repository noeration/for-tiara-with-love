import { NextResponse } from "next/server";
import { getDraft, getPublished, saveDraft } from "@/lib/content-store";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const [draft, published] = await Promise.all([getDraft(), getPublished()]);
    return NextResponse.json({
      config: draft.config,
      draftAt: draft.updatedAt,
      publishedAt: published.updatedAt,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = await request.json();
    const config = body?.config;
    if (!config || typeof config !== "object") {
      return NextResponse.json({ error: "Missing config" }, { status: 400 });
    }
    const stored = await saveDraft(config);
    return NextResponse.json({ ok: true, draftAt: stored.updatedAt });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
