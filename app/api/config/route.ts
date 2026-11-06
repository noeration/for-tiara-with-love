import { NextResponse } from "next/server";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const CONFIG_PATH = path.join(process.cwd(), "data", "birthday.ts");
const MARKER = "/*  KONTEN — ubah bagian ini                                                  */";

export async function GET() {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Config API is dev-only." }, { status: 403 });
  }
  try {
    const content = await readFile(CONFIG_PATH, "utf8");
    return NextResponse.json({ content });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Config API is dev-only." }, { status: 403 });
  }
  try {
    const body = await request.json();
    const config = body?.config;
    if (!config || typeof config !== "object") {
      return NextResponse.json({ error: "Missing config" }, { status: 400 });
    }
    const current = await readFile(CONFIG_PATH, "utf8");
    const idx = current.indexOf(MARKER);
    if (idx === -1) {
      return NextResponse.json({ error: "Marker not found in birthday.ts" }, { status: 500 });
    }
    const head = current.slice(0, idx + MARKER.length);
    const tail = "\n\nexport const birthday: MemoryConfig = " + JSON.stringify(config, null, 2) + ";\n";
    await writeFile(CONFIG_PATH, head + tail, "utf8");
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
