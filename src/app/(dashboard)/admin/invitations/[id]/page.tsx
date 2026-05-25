import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseAdmin } from "@/lib/supabase/admin";
import { Card } from "@/components/ui/Card";
import { PayloadEditor } from "./_components/PayloadEditor";
import { RsvpsSection } from "./_components/RsvpsSection";
import { UcapanSection } from "./_components/UcapanSection";
import { DeleteInvitationButton } from "./_components/DeleteInvitationButton";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

function fmtDate(s: string): string {
  try {
    return new Date(s).toLocaleString();
  } catch {
    return s;
  }
}

export default async function AdminInvitationDetailPage({ params }: PageProps) {
  const { id } = await params;

  const sb = await createSupabaseAdmin();
  const { data, error } = await sb
    .from("invitations")
    .select("id, slug, template_id, payload, created_at")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-rose-600">Failed to load: {error.message}</p>
        <Link
          href="/admin/invitations"
          className="text-sm text-indigo-700 hover:underline"
        >
          ← Back to list
        </Link>
      </div>
    );
  }
  if (!data) notFound();

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <Link
          href="/admin/invitations"
          className="text-sm text-indigo-700 hover:underline"
        >
          ← All invitations
        </Link>
        <h1 className="text-2xl font-semibold text-neutral-900 font-mono">
          {data.slug}
        </h1>
        <div className="text-xs text-neutral-500 flex flex-wrap gap-x-4 gap-y-1">
          <span>
            ID: <span className="font-mono">{data.id}</span>
          </span>
          <span>Template: {data.template_id}</span>
          <span>Created {fmtDate(data.created_at)}</span>
          <a
            href={`/undang/${data.slug}?published=1`}
            target="_blank"
            rel="noreferrer"
            className="text-indigo-700 hover:underline"
          >
            Open live ↗
          </a>
        </div>
      </header>

      <Card className="bg-white border border-neutral-200 p-5">
        <PayloadEditor invitationId={data.id} initialPayload={data.payload} />
      </Card>

      <Card className="bg-white border border-neutral-200 p-5">
        <RsvpsSection invitationId={data.id} />
      </Card>

      <Card className="bg-white border border-neutral-200 p-5">
        <UcapanSection invitationId={data.id} />
      </Card>

      <Card className="bg-white border border-rose-200 p-5">
        <DeleteInvitationButton invitationId={data.id} slug={data.slug} />
      </Card>
    </div>
  );
}
