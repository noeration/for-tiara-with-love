import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createServerClient } from "@/lib/supabase-server";
import { Sidebar } from "@/components/admin/sidebar";

export const instant = false;

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const devBypass =
    process.env.ADMIN_DEV_BYPASS === "true" && process.env.NODE_ENV !== "production";

  let email = "local-admin";

  if (!devBypass) {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect("/admin/login");
    email = user.email ?? "";
  }

  return (
    <div className="flex min-h-screen bg-deep text-lavender">
      <Sidebar email={email} />
      <main className="flex-1 overflow-x-clip px-4 py-6 sm:px-8 lg:px-10">{children}</main>
    </div>
  );
}
