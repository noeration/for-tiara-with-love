import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export async function POST(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Upload is dev-only." }, { status: 403 });
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") || "images").replace(/[^a-zA-Z0-9/_-]/g, "");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_").toLowerCase();
    const targetDir = path.join(process.cwd(), "public", folder);
    await mkdir(targetDir, { recursive: true });
    const targetPath = path.join(targetDir, safeName);
    await writeFile(targetPath, buffer);
    const publicPath = "/" + folder.replace(/^\/+/, "") + "/" + safeName;
    return NextResponse.json({ path: publicPath });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
