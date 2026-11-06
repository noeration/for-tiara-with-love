import { NextResponse } from "next/server";
import { publishDraft } from "@/lib/content-store";
import { requireAdmin } from "@/lib/admin-auth";

export async function POST() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const stored = await publishDraft();
    return NextResponse.json({ ok: true, publishedAt: stored.updatedAt });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
