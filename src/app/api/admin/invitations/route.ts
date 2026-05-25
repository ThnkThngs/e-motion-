import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_LIMIT = 100;
const DEFAULT_LIMIT = 25;

export async function GET(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim();
  const template = url.searchParams.get("template")?.trim();
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const cursor = url.searchParams.get("cursor");
  const limitRaw = Number(url.searchParams.get("limit") ?? DEFAULT_LIMIT);
  const limit = Math.min(Math.max(1, Number.isFinite(limitRaw) ? limitRaw : DEFAULT_LIMIT), MAX_LIMIT);

  const sb = await createSupabaseAdmin();
  let query = sb
    .from("invitations")
    .select("id, slug, template_id, created_at")
    .order("created_at", { ascending: false })
    .limit(limit + 1); // one extra to detect next page

  if (q) query = query.ilike("slug", `%${q}%`);
  if (template) query = query.eq("template_id", template);
  if (from) query = query.gte("created_at", from);
  if (to) query = query.lte("created_at", to);
  if (cursor) query = query.lt("created_at", cursor);

  const { data, error } = await query;
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const rows = data ?? [];
  let nextCursor: string | null = null;
  let items = rows;
  if (rows.length > limit) {
    items = rows.slice(0, limit);
    nextCursor = items[items.length - 1]?.created_at ?? null;
  }

  return NextResponse.json({ items, nextCursor });
}
