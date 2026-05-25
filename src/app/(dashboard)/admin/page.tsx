import Link from "next/link";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { Card } from "@/components/ui/Card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";

export const dynamic = "force-dynamic";

interface StatTileProps {
  label: string;
  value: number;
}

function StatTile({ label, value }: StatTileProps) {
  return (
    <Card className="bg-white border border-neutral-200 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold text-neutral-900 tabular-nums">
        {value.toLocaleString()}
      </p>
    </Card>
  );
}

function fmtDate(s: string): string {
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}

export default async function AdminOverviewPage() {
  const sb = await createSupabaseAdmin();
  const [invitations, rsvps, ucapan, recent] = await Promise.all([
    sb.from("invitations").select("id", { count: "exact", head: true }),
    sb.from("rsvps").select("id", { count: "exact", head: true }),
    sb.from("ucapan").select("id", { count: "exact", head: true }),
    sb
      .from("invitations")
      .select("id, slug, template_id, created_at")
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold text-neutral-900">Overview</h1>
        <p className="text-sm text-neutral-600">
          Live counts and recent invitations across all guests.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatTile label="Invitations" value={invitations.count ?? 0} />
        <StatTile label="RSVPs" value={rsvps.count ?? 0} />
        <StatTile label="Ucapan" value={ucapan.count ?? 0} />
      </div>

      <Card className="bg-white border border-neutral-200">
        <div className="px-5 py-4 border-b border-neutral-200 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-neutral-900">
            Recent invitations
          </h2>
          <Link
            href="/admin/invitations"
            className="text-sm text-indigo-700 hover:underline"
          >
            View all →
          </Link>
        </div>
        <Table>
          <THead>
            <TR>
              <TH>Slug</TH>
              <TH>Template</TH>
              <TH>Created</TH>
            </TR>
          </THead>
          <TBody>
            {(recent.data ?? []).map((row) => (
              <TR key={row.id}>
                <TD>
                  <Link
                    href={`/admin/invitations/${row.id}`}
                    className="text-indigo-700 hover:underline font-mono"
                  >
                    {row.slug}
                  </Link>
                </TD>
                <TD className="text-neutral-700">{row.template_id}</TD>
                <TD className="text-neutral-500 tabular-nums">
                  {fmtDate(row.created_at)}
                </TD>
              </TR>
            ))}
            {recent.data?.length === 0 && (
              <TR>
                <TD className="text-neutral-500 italic py-6" colSpan={3}>
                  No invitations yet.
                </TD>
              </TR>
            )}
          </TBody>
        </Table>
      </Card>
    </div>
  );
}
