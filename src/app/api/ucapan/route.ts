import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { checkRateLimit, getIp, RATE_LIMIT_RESPONSE } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  if (!checkRateLimit(getIp(req), 10, 60_000)) {
    return NextResponse.json(RATE_LIMIT_RESPONSE, { status: 429 });
  }
  try {
    const { slug, guestName, message } = await req.json();
    if (!slug || !guestName || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createSupabaseServer();
    const { data: inv, error: invErr } = await supabase
      .from("invitations")
      .select("id")
      .eq("slug", slug)
      .single();
    if (invErr || !inv) {
      return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
    }

    const { data, error } = await supabase
      .from("ucapan")
      .insert({
        invitation_id: inv.id,
        guest_name: String(guestName).slice(0, 120),
        message: String(message).slice(0, 1000),
      })
      .select()
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true, ucapan: data });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const slug = req.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }
  const supabase = await createSupabaseServer();
  const { data: inv, error: invErr } = await supabase
    .from("invitations")
    .select("id")
    .eq("slug", slug)
    .single();
  if (invErr || !inv) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }
  const { data, error } = await supabase
    .from("ucapan")
    .select("id, guest_name, message, created_at")
    .eq("invitation_id", inv.id)
    .order("created_at", { ascending: false })
    .limit(200);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ items: data ?? [] });
}
