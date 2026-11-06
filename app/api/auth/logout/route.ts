import { createServerClient } from "@/lib/supabase-server";
import { redirect } from "next/navigation";

export async function POST() {
  try {
    const supabase = await createServerClient();
    await supabase.auth.signOut();
  } catch {
    // Auth may be unconfigured in local development; nothing to sign out of.
  }
  return redirect("/admin/login");
}
