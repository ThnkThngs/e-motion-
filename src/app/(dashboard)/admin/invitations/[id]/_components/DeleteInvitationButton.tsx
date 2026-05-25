"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";

interface DeleteInvitationButtonProps {
  invitationId: string;
  slug: string;
}

export function DeleteInvitationButton({
  invitationId,
  slug,
}: DeleteInvitationButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function reset() {
    setTyped("");
    setError(null);
  }

  async function onConfirm() {
    if (typed !== slug) {
      setError("Slug does not match.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/invitations/${invitationId}`, {
        method: "DELETE",
      });
      if (res.status === 204) {
        router.push("/admin/invitations");
        router.refresh();
        return;
      }
      const body = await res.json().catch(() => null);
      setError(body?.error ?? `HTTP ${res.status}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "delete failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="border-t border-neutral-200 pt-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-rose-700">Danger zone</h2>
          <p className="text-xs text-neutral-600">
            Deleting will remove the invitation and all of its RSVPs and ucapan.
          </p>
        </div>
        <Button
          type="button"
          variant="danger"
          size="md"
          onClick={() => {
            reset();
            setOpen(true);
          }}
        >
          Delete invitation
        </Button>
      </div>

      <Modal
        isOpen={open}
        onClose={() => (busy ? undefined : setOpen(false))}
        title="Delete invitation?"
        size="md"
      >
        <p className="text-sm text-neutral-700">
          To confirm, type the slug{" "}
          <code className="px-1 py-0.5 bg-neutral-100 rounded text-rose-700 font-mono">
            {slug}
          </code>{" "}
          below.
        </p>
        <div className="mt-3">
          <Input
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={slug}
            autoFocus
          />
        </div>
        {error && <p className="mt-2 text-sm text-rose-600">{error}</p>}
        <div className="mt-4 flex justify-end gap-2">
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            onClick={() => setOpen(false)}
            disabled={busy}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={onConfirm}
            isLoading={busy}
            disabled={busy || typed !== slug}
          >
            Delete forever
          </Button>
        </div>
      </Modal>
    </section>
  );
}
