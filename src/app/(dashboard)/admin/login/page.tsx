"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

function AdminLoginInner() {
  const router = useRouter();
  const sp = useSearchParams();
  const next = sp.get("next") || "/admin";

  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.status === 204) {
        router.replace(next);
        router.refresh();
        return;
      }
      setError(res.status === 401 ? "Incorrect password." : "Login failed.");
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-neutral-50 p-4">
      <Card className="w-full max-w-sm p-6">
        <h1 className="text-xl font-semibold text-neutral-900 mb-1">
          Admin sign in
        </h1>
        <p className="text-sm text-neutral-600 mb-4">
          Enter the admin password to manage invitations.
        </p>
        <form onSubmit={onSubmit} className="space-y-4">
          <Input
            type="password"
            label="Password"
            autoFocus
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          {error && (
            <p className="text-sm text-rose-600" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={busy}
            className="w-full"
            disabled={busy || password.length === 0}
          >
            Sign in
          </Button>
        </form>
      </Card>
    </main>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginInner />
    </Suspense>
  );
}
