import { NextRequest, NextResponse } from "next/server";
import { customAlphabet } from "nanoid";
import { createSupabaseServer } from "@/lib/supabase/server";
import { checkRateLimit, getIp, RATE_LIMIT_RESPONSE } from "@/lib/rateLimit";

const slugId = customAlphabet("abcdefghijkmnpqrstuvwxyz23456789", 6);

const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 32) || "kad";

export async function POST(req: NextRequest) {
  if (!checkRateLimit(getIp(req), 5, 60_000)) {
    return NextResponse.json(RATE_LIMIT_RESPONSE, { status: 429 });
  }
  try {
    const body = await req.json();
    const { templateId, payload } = body ?? {};
    if (!templateId || !payload) {
      return NextResponse.json({ error: "Missing templateId or payload" }, { status: 400 });
    }

    const groomShort = String(payload.groomShort ?? "");
    const brideShort = String(payload.brideShort ?? "");
    const slug = `${slugify(brideShort)}-${slugify(groomShort)}-${slugId()}`;

    const supabase = await createSupabaseServer();
    const { error } = await supabase.from("invitations").insert({
      slug,
      template_id: String(templateId),
      payload,
    });
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ slug });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal error" },
      { status: 500 },
    );
  }
}
