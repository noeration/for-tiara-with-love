import { promises as fs } from "fs";
import path from "path";
import { birthday, type MemoryConfig } from "@/data/birthday";
import { createServiceClient } from "@/lib/supabase-server";

const DATA_DIR = path.join(process.cwd(), "data");
const DRAFT_PATH = path.join(DATA_DIR, "draft.json");
const PUBLISHED_PATH = path.join(DATA_DIR, "published.json");
const ROW_ID = "00000000-0000-0000-0000-000000000001";

export interface StoredContent {
  config: MemoryConfig;
  updatedAt: string | null;
}

function hasSupabaseAdmin() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

function mergeConfig(patch: unknown): MemoryConfig {
  if (!patch || typeof patch !== "object") return birthday;
  const p = patch as Partial<MemoryConfig>;
  return {
    ...birthday,
    ...p,
    site: { ...birthday.site, ...(p.site ?? {}) },
    opening: { ...birthday.opening, ...(p.opening ?? {}) },
    portrait: { ...birthday.portrait, ...(p.portrait ?? {}) },
    appearance: { ...birthday.appearance, ...(p.appearance ?? {}) },
    message: {
      ...birthday.message,
      ...(p.message ?? {}),
      paragraphs: Array.isArray(p.message?.paragraphs)
        ? p.message.paragraphs
        : birthday.message.paragraphs,
      wishes: Array.isArray(p.message?.wishes)
        ? p.message.wishes
        : birthday.message.wishes,
    },
    cake: {
      ...birthday.cake,
      ...(p.cake ?? {}),
      wishes: Array.isArray(p.cake?.wishes)
        ? p.cake.wishes.slice(0, 3)
        : birthday.cake.wishes.slice(0, 3),
    },
    memories: {
      ...birthday.memories,
      ...(p.memories ?? {}),
      items: Array.isArray(p.memories?.items)
        ? p.memories.items
        : birthday.memories.items,
    },
    artworks: {
      ...birthday.artworks,
      ...(p.artworks ?? {}),
      // The public site always shows exactly one artwork.
      items: (
        Array.isArray(p.artworks?.items) && p.artworks.items.length
          ? p.artworks.items
          : birthday.artworks.items
      ).slice(0, 1),
    },
    letter: {
      ...birthday.letter,
      ...(p.letter ?? {}),
      content: { ...birthday.letter.content, ...(p.letter?.content ?? {}) },
    },
    song: {
      ...birthday.song,
      ...(p.song ?? {}),
      track: { ...birthday.song.track, ...(p.song?.track ?? {}) },
    },
    finale: { ...birthday.finale, ...(p.finale ?? {}) },
    nav: Array.isArray(p.nav) ? p.nav : birthday.nav,
  };
}

async function readLocal(file: string): Promise<StoredContent | null> {
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw);
    return {
      config: mergeConfig(parsed?.config ?? parsed),
      updatedAt: typeof parsed?.updatedAt === "string" ? parsed.updatedAt : null,
    };
  } catch {
    return null;
  }
}

async function writeLocal(file: string, stored: StoredContent) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(file, JSON.stringify(stored, null, 2), "utf8");
}

async function readSupabase(table: "draft_content" | "published_content") {
  if (!hasSupabaseAdmin()) return null;
  try {
    const supabase = createServiceClient();
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error || !data?.config) return null;
    return {
      config: mergeConfig(data.config),
      updatedAt: (data.updated_at as string | null) ?? null,
    } satisfies StoredContent;
  } catch {
    return null;
  }
}

async function writeSupabase(
  table: "draft_content" | "published_content",
  stored: StoredContent
) {
  if (!hasSupabaseAdmin()) return false;
  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from(table).upsert(
      { id: ROW_ID, config: stored.config, updated_at: stored.updatedAt },
      { onConflict: "id" }
    );
    return !error;
  } catch {
    return false;
  }
}

export async function getDraft(): Promise<StoredContent> {
  const remote = await readSupabase("draft_content");
  if (remote) return remote;
  const local = await readLocal(DRAFT_PATH);
  return local ?? { config: birthday, updatedAt: null };
}

export async function getPublished(): Promise<StoredContent> {
  const remote = await readSupabase("published_content");
  if (remote) return remote;
  const local = await readLocal(PUBLISHED_PATH);
  return local ?? { config: birthday, updatedAt: null };
}

export async function saveDraft(config: unknown): Promise<StoredContent> {
  const stored: StoredContent = {
    config: mergeConfig(config),
    updatedAt: new Date().toISOString(),
  };
  const remote = await writeSupabase("draft_content", stored);
  if (!remote) await writeLocal(DRAFT_PATH, stored);
  return stored;
}

export async function publishDraft(): Promise<StoredContent> {
  const draft = await getDraft();
  const stored: StoredContent = {
    config: draft.config,
    updatedAt: new Date().toISOString(),
  };
  const remote = await writeSupabase("published_content", stored);
  if (!remote) await writeLocal(PUBLISHED_PATH, stored);
  return stored;
}
