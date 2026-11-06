import { NextResponse } from "next/server";
import { getDraft, saveDraft } from "@/lib/content-store";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { config } = await getDraft();
    return NextResponse.json({ items: config.memories.items });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = await request.json();
    const items = body?.items;
    if (!Array.isArray(items)) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }
    const { config } = await getDraft();
    const stored = await saveDraft({
      ...config,
      memories: { ...config.memories, items },
    });
    return NextResponse.json({ ok: true, items: stored.config.memories.items });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
