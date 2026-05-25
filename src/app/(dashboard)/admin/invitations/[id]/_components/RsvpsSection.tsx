"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";

interface Rsvp {
  id: string;
  guest_name: string;
  attendance: string;
  pax: number;
  phone: string | null;
  note: string | null;
  created_at: string;
}

interface RsvpsSectionProps {
  invitationId: string;
}

function fmtDate(s: string): string {
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}

const attendanceLabel: Record<string, string> = {
  hadir: "Attending",
  tidak: "Not attending",
  mungkin: "Maybe",
};

export function RsvpsSection({ invitationId }: RsvpsSectionProps) {
  const [items, setItems] = useState<Rsvp[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/invitations/${invitationId}/rsvps`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      setItems(body.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "load failed");
    } finally {
      setLoading(false);
    }
  }, [invitationId]);

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">
          RSVPs ({items.length})
        </h2>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            onClick={() => void load()}
            disabled={loading}
          >
            Refresh
          </Button>
          <a
            href={`/api/admin/invitations/${invitationId}/rsvps/csv`}
            className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
          >
            Export CSV
          </a>
        </div>
      </div>

      <div className="border border-neutral-200 rounded-lg overflow-hidden">
        <Table>
          <THead>
            <TR>
              <TH>Guest</TH>
              <TH>Attendance</TH>
              <TH>Pax</TH>
              <TH>Phone</TH>
              <TH>Note</TH>
              <TH>Submitted</TH>
            </TR>
          </THead>
          <TBody>
            {loading && (
              <TR>
                <TD colSpan={6} className="py-6 text-center">
                  <Spinner size="sm" className="inline-block" />
                </TD>
              </TR>
            )}
            {!loading &&
              items.map((row) => (
                <TR key={row.id}>
                  <TD className="font-medium">{row.guest_name}</TD>
                  <TD>{attendanceLabel[row.attendance] ?? row.attendance}</TD>
                  <TD className="tabular-nums">{row.pax}</TD>
                  <TD className="text-neutral-700">{row.phone ?? "—"}</TD>
                  <TD className="text-neutral-700 max-w-xs whitespace-pre-wrap">
                    {row.note ?? "—"}
                  </TD>
                  <TD className="text-neutral-500 tabular-nums whitespace-nowrap">
                    {fmtDate(row.created_at)}
                  </TD>
                </TR>
              ))}
            {!loading && items.length === 0 && (
              <TR>
                <TD colSpan={6} className="py-6 italic text-neutral-500">
                  No RSVPs yet.
                </TD>
              </TR>
            )}
          </TBody>
        </Table>
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}
    </section>
  );
}
