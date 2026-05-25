import { NextResponse } from "next/server";
import { invitationSchema } from "@cinematic/schema";
import { requireAdmin } from "@/lib/admin/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import type { Json } from "@/types/database";

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
    .from("invitations")
    .select("id, slug, template_id, payload, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(req: Request, { params }: Ctx) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const { id } = await params;

  let body: { payload?: unknown; template_id?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const update: { payload?: Json; template_id?: string } = {};
  if (body.payload !== undefined) {
    const parsed = invitationSchema.safeParse(body.payload);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "invalid_payload", details: parsed.error.flatten() },
        { status: 400 },
      );
    }
    update.payload = parsed.data as unknown as Json;
  }
  if (typeof body.template_id === "string" && body.template_id.length > 0) {
    update.template_id = body.template_id;
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "no_changes" }, { status: 400 });
  }

  const sb = await createSupabaseAdmin();
  const { data, error } = await sb
    .from("invitations")
    .update(update)
    .eq("id", id)
    .select("id, slug, template_id, payload, created_at")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(data);
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const { id } = await params;

  const sb = await createSupabaseAdmin();
  // Cascade explicitly: children first, then parent.
  const u = await sb.from("ucapan").delete().eq("invitation_id", id);
  if (u.error) return NextResponse.json({ error: `ucapan: ${u.error.message}` }, { status: 500 });
  const r = await sb.from("rsvps").delete().eq("invitation_id", id);
  if (r.error) return NextResponse.json({ error: `rsvps: ${r.error.message}` }, { status: 500 });
  const i = await sb.from("invitations").delete().eq("id", id);
  if (i.error) return NextResponse.json({ error: `invitations: ${i.error.message}` }, { status: 500 });
  return new NextResponse(null, { status: 204 });
}
