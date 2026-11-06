import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase-server";
import { requireAdmin } from "@/lib/admin-auth";

const ALLOWED_FOLDERS = new Set(["memories", "artworks", "audio", "images"]);

function hasSupabaseAdmin() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST(request: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") || "images");
    if (!ALLOWED_FOLDERS.has(folder)) {
      return NextResponse.json({ error: "Invalid folder" }, { status: 400 });
    }
    if (!(file instanceof File) || file.size === 0) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json({ error: "File is larger than 15 MB" }, { status: 400 });
    }

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").toLowerCase();
    const filename = `${Date.now()}-${safeName}`;
    const bytes = await file.arrayBuffer();

    if (hasSupabaseAdmin()) {
      const supabase = createServiceClient();
      const { error } = await supabase.storage
        .from(folder)
        .upload(filename, bytes, {
          contentType: file.type || "application/octet-stream",
          upsert: false,
        });
      if (error) {
        return NextResponse.json(
          { error: `Storage upload failed: ${error.message}. Create the "${folder}" bucket in Supabase Storage.` },
          { status: 500 }
        );
      }
      const {
        data: { publicUrl },
      } = supabase.storage.from(folder).getPublicUrl(filename);
      return NextResponse.json({ url: publicUrl, path: filename });
    }

    // Local development fallback so uploads work before Supabase is configured.
    const dir = path.join(process.cwd(), "public", "uploads", folder);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, filename), Buffer.from(bytes));
    return NextResponse.json({ url: `/uploads/${folder}/${filename}`, path: filename });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
