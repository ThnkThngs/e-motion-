"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { Modal } from "@/components/ui/Modal";

interface UcapanRow {
  id: string;
  guest_name: string;
  message: string;
  created_at: string;
}

interface UcapanSectionProps {
  invitationId: string;
}

function fmtDate(s: string): string {
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}

export function UcapanSection({ invitationId }: UcapanSectionProps) {
  const [items, setItems] = useState<UcapanRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<UcapanRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/invitations/${invitationId}/ucapan`);
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

  async function performDelete() {
    if (!confirm) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/ucapan/${confirm.id}`, {
        method: "DELETE",
      });
      if (res.status === 204) {
        setItems((prev) => prev.filter((u) => u.id !== confirm.id));
        setConfirm(null);
      } else {
        const body = await res.json().catch(() => null);
        setError(body?.error ?? `HTTP ${res.status}`);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">
          Ucapan ({items.length})
        </h2>
        <Button
          type="button"
          variant="tertiary"
          size="sm"
          onClick={() => void load()}
          disabled={loading}
        >
          Refresh
        </Button>
      </div>

      <div className="border border-neutral-200 rounded-lg divide-y divide-neutral-200 bg-white">
        {loading && (
          <div className="p-6 text-center">
            <Spinner size="sm" className="inline-block" />
          </div>
        )}
        {!loading &&
          items.map((row) => (
            <article
              key={row.id}
              className="px-4 py-3 flex items-start justify-between gap-3"
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-neutral-900">
                  {row.guest_name}
                  <span className="ml-2 text-xs font-normal text-neutral-500 tabular-nums">
                    {fmtDate(row.created_at)}
                  </span>
                </p>
                <p className="text-sm text-neutral-700 whitespace-pre-wrap mt-1">
                  {row.message}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfirm(row)}
                className="shrink-0 text-xs font-medium text-rose-600 hover:text-rose-800"
              >
                Delete
              </button>
            </article>
          ))}
        {!loading && items.length === 0 && (
          <p className="p-6 italic text-neutral-500 text-sm">No ucapan yet.</p>
        )}
      </div>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      <Modal
        isOpen={confirm !== null}
        onClose={() => (deleting ? undefined : setConfirm(null))}
        title="Delete this ucapan?"
        size="sm"
      >
        <p className="text-sm text-neutral-700">
          From <strong>{confirm?.guest_name}</strong>:
        </p>
        <p className="mt-2 text-sm italic text-neutral-600 whitespace-pre-wrap">
          “{confirm?.message}”
        </p>
        <p className="mt-3 text-xs text-rose-600">This cannot be undone.</p>
        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            onClick={() => setConfirm(null)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={performDelete}
            isLoading={deleting}
            disabled={deleting}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </section>
  );
}
