import { requireAdmin } from "@/lib/admin/auth";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Ctx {
  params: Promise<{ id: string }>;
}

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function GET(_req: Request, { params }: Ctx) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const { id } = await params;

  const sb = await createSupabaseAdmin();
  const inv = await sb
    .from("invitations")
    .select("slug")
    .eq("id", id)
    .maybeSingle();
  if (inv.error || !inv.data) {
    return new Response("not_found", { status: 404 });
  }

  const { data, error } = await sb
    .from("rsvps")
    .select("created_at, guest_name, attendance, pax, phone, note")
    .eq("invitation_id", id)
    .order("created_at", { ascending: false });
  if (error) return new Response(error.message, { status: 500 });

  const header = ["created_at", "guest_name", "attendance", "pax", "phone", "note"];
  const lines = [header.join(",")];
  for (const row of data ?? []) {
    lines.push(
      [
        csvEscape(row.created_at),
        csvEscape(row.guest_name),
        csvEscape(row.attendance),
        csvEscape(row.pax),
        csvEscape(row.phone),
        csvEscape(row.note),
      ].join(","),
    );
  }
  const body = lines.join("\n") + "\n";

  const today = new Date().toISOString().slice(0, 10);
  const filename = `rsvps-${inv.data.slug}-${today}.csv`;

  return new Response(body, {
    status: 200,
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="${filename}"`,
      "cache-control": "no-store",
    },
  });
}
