import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const guard = await requireAdmin();
  if (guard) return guard;

  const sb = await createSupabaseAdmin();

  const [invitationsCount, rsvpsCount, ucapanCount, recent] = await Promise.all([
    sb.from("invitations").select("id", { count: "exact", head: true }),
    sb.from("rsvps").select("id", { count: "exact", head: true }),
    sb.from("ucapan").select("id", { count: "exact", head: true }),
    sb
      .from("invitations")
      .select("id, slug, template_id, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  return NextResponse.json({
    totalInvitations: invitationsCount.count ?? 0,
    totalRsvps: rsvpsCount.count ?? 0,
    totalUcapan: ucapanCount.count ?? 0,
    recentInvitations: recent.data ?? [],
  });
}
