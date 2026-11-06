import { NextResponse } from "next/server";
import { getDraft, saveDraft } from "@/lib/content-store";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const { config } = await getDraft();
    return NextResponse.json({ track: config.song.track });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const body = await request.json();
    const track = body?.track;
    if (!track || typeof track !== "object") {
      return NextResponse.json({ error: "No track" }, { status: 400 });
    }
    const { config } = await getDraft();
    const stored = await saveDraft({
      ...config,
      song: {
        ...config.song,
        track: {
          title: track.title ?? "",
          artist: track.artist ?? "",
          src: track.src ?? "",
          cover: track.cover ?? "",
          note: track.note ?? "",
        },
      },
    });
    return NextResponse.json({ ok: true, track: stored.config.song.track });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
