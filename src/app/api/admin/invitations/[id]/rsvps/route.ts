import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Ctx {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, { params }: Ctx) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const { id } = await params;

  const sb = await createSupabaseAdmin();
  const { data, error } = await sb
    .from("rsvps")
    .select("id, guest_name, attendance, pax, phone, note, created_at")
    .eq("invitation_id", id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data ?? [] });
}
