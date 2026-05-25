"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/Table";
import { Spinner } from "@/components/ui/Spinner";

interface InvitationRow {
  id: string;
  slug: string;
  template_id: string;
  created_at: string;
}

interface ListResponse {
  items: InvitationRow[];
  nextCursor: string | null;
}

function fmtDate(s: string): string {
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}

export default function AdminInvitationsPage() {
  const [items, setItems] = useState<InvitationRow[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);
  const [q, setQ] = useState("");
  const [pendingQ, setPendingQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPage = useCallback(
    async (search: string, c: string | null, append: boolean) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (search) params.set("q", search);
        if (c) params.set("cursor", c);
        params.set("limit", "25");
        const res = await fetch(`/api/admin/invitations?${params.toString()}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ListResponse = await res.json();
        setItems((prev) => (append ? [...prev, ...data.items] : data.items));
        setCursor(data.nextCursor);
        setHasMore(data.nextCursor !== null);
      } catch (e) {
        setError(e instanceof Error ? e.message : "load failed");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchPage(q, null, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onSearch(e: React.FormEvent) {
    e.preventDefault();
    setQ(pendingQ);
    fetchPage(pendingQ, null, false);
  }

  function loadMore() {
    if (cursor) fetchPage(q, cursor, true);
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-900">
            Invitations
          </h1>
          <p className="text-sm text-neutral-600">
            Search by slug. Click a row to view details.
          </p>
        </div>
        <form onSubmit={onSearch} className="flex items-end gap-2">
          <Input
            label="Search"
            value={pendingQ}
            onChange={(e) => setPendingQ(e.target.value)}
            placeholder="slug…"
            className="w-64"
          />
          <Button type="submit" variant="secondary" size="md">
            Search
          </Button>
        </form>
      </header>

      <Card className="bg-white border border-neutral-200">
        <Table>
          <THead>
            <TR>
              <TH>Slug</TH>
              <TH>Template</TH>
              <TH>Created</TH>
              <TH></TH>
            </TR>
          </THead>
          <TBody>
            {items.map((row) => (
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
                <TD className="text-right">
                  <Link
                    href={`/admin/invitations/${row.id}`}
                    className="text-sm text-indigo-700 hover:underline"
                  >
                    View
                  </Link>
                </TD>
              </TR>
            ))}
            {!loading && items.length === 0 && (
              <TR>
                <TD className="text-neutral-500 italic py-6" colSpan={4}>
                  No invitations found.
                </TD>
              </TR>
            )}
          </TBody>
        </Table>
        <div className="px-3 py-3 flex items-center justify-between border-t border-neutral-200">
          <div className="text-xs text-neutral-500">
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <Spinner size="sm" /> Loading…
              </span>
            ) : (
              <>Showing {items.length}</>
            )}
            {error && (
              <span className="text-rose-600 ml-2">· {error}</span>
            )}
          </div>
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            onClick={loadMore}
            disabled={!hasMore || loading}
          >
            {hasMore ? "Load more" : "End of list"}
          </Button>
        </div>
      </Card>
    </div>
  );
}
