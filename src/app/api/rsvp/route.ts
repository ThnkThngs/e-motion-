import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { checkRateLimit, getIp, RATE_LIMIT_RESPONSE } from "@/lib/rateLimit";

const ATTENDANCE = new Set(["hadir", "tidak", "mungkin"]);

export async function POST(req: NextRequest) {
  if (!checkRateLimit(getIp(req), 10, 60_000)) {
    return NextResponse.json(RATE_LIMIT_RESPONSE, { status: 429 });
  }
  try {
    const { slug, guestName, attendance, pax, phone, note } = await req.json();
    if (!slug || !guestName || !attendance) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    if (!ATTENDANCE.has(attendance)) {
      return NextResponse.json({ error: "Invalid attendance value" }, { status: 400 });
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

    const { error } = await supabase.from("rsvps").insert({
      invitation_id: inv.id,
      guest_name: String(guestName).slice(0, 120),
      attendance,
      pax: Math.max(0, Math.min(20, Number(pax) || 1)),
      phone: phone ? String(phone).slice(0, 40) : null,
      note: note ? String(note).slice(0, 500) : null,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 },
    );
  }
}
