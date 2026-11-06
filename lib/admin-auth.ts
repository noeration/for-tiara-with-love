import { NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";

/**
 * Returns a 401 response when the caller is not an authenticated admin.
 * Local development can bypass auth with ADMIN_DEV_BYPASS=true.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const devBypass =
    process.env.ADMIN_DEV_BYPASS === "true" && process.env.NODE_ENV !== "production";
  if (devBypass) return null;

  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return null;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
