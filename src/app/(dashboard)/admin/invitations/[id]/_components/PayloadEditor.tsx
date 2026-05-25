"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";

interface PayloadEditorProps {
  invitationId: string;
  initialPayload: unknown;
}

export function PayloadEditor({ invitationId, initialPayload }: PayloadEditorProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string>(() =>
    JSON.stringify(initialPayload, null, 2),
  );
  const [saved, setSaved] = useState<unknown>(initialPayload);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSave() {
    setError(null);
    setSuccess(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(draft);
    } catch (e) {
      setError(`Invalid JSON: ${e instanceof Error ? e.message : "parse error"}`);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`/api/admin/invitations/${invitationId}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ payload: parsed }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) {
        setError(
          body?.error
            ? typeof body.error === "string"
              ? body.error
              : JSON.stringify(body.error)
            : `HTTP ${res.status}`,
        );
        return;
      }
      setSaved(body?.payload ?? parsed);
      setDraft(JSON.stringify(body?.payload ?? parsed, null, 2));
      setEditing(false);
      setSuccess("Saved.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setSaving(false);
    }
  }

  function onCancel() {
    setDraft(JSON.stringify(saved, null, 2));
    setEditing(false);
    setError(null);
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-neutral-900">
          Invitation payload
        </h2>
        {!editing ? (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => {
              setEditing(true);
              setSuccess(null);
            }}
          >
            Edit
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="tertiary"
              size="sm"
              onClick={onCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onSave}
              isLoading={saving}
              disabled={saving}
            >
              Save
            </Button>
          </div>
        )}
      </div>

      {editing ? (
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          spellCheck={false}
          className="w-full font-mono text-xs leading-relaxed h-96 px-3 py-2 border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-700"
        />
      ) : (
        <pre className="text-xs leading-relaxed bg-neutral-50 border border-neutral-200 rounded-lg p-3 overflow-x-auto max-h-96">
          {JSON.stringify(saved, null, 2)}
        </pre>
      )}

      {error && <p className="text-sm text-rose-600">{error}</p>}
      {success && !editing && (
        <p className="text-sm text-emerald-600">{success}</p>
      )}
    </section>
  );
}
