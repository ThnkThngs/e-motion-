import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { createSupabaseServer } from "@/lib/supabase/server";
import { invitationSchema } from "@cinematic/schema";
import type { ThemeId } from "@cinematic/themes";
import { InvitationScroll } from "@/components/scroll/InvitationScroll";
import { CopyLinkButton } from "./CopyLinkButton";
import { siteConfig } from "@/config/site";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ published?: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createSupabaseServer();
  const { data } = await supabase
    .from("invitations")
    .select("payload")
    .eq("slug", slug)
    .single();

  const payload = data?.payload as Record<string, unknown> | null;
  const bride = String(payload?.brideName ?? payload?.brideShort ?? "").trim();
  const groom = String(payload?.groomName ?? payload?.groomShort ?? "").trim();
  const names = bride && groom ? `${bride} & ${groom}` : "Majlis Perkahwinan";
  const title = `${names} — Jemputan Perkahwinan`;
  const description = `Anda dijemput hadir ke majlis perkahwinan ${names}. Sah kehadiran anda sekarang.`;
  const url = `${siteConfig.baseUrl}/undang/${slug}`;
  const ogImage = `${siteConfig.baseUrl}/api/og?slug=${encodeURIComponent(slug)}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: names }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function UndangPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { published } = await searchParams;
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("invitations")
    .select("template_id, payload")
    .eq("slug", slug)
    .single();

  if (error || !data) notFound();

  const parsed = invitationSchema.safeParse(data.payload);
  if (!parsed.success) notFound();

  return (
    <>
      <InvitationScroll
        templateId={data.template_id as ThemeId}
        payload={parsed.data}
        slug={slug}
      />
      {published === "1" && (
        <div
          style={{
            position: "fixed",
            top: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 100,
            padding: "10px 16px",
            borderRadius: 999,
            background: "rgba(31,24,18,0.95)",
            color: "#FAF6E3",
            fontSize: 13,
            boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
            border: "1px solid rgba(185,137,65,0.4)",
            display: "flex",
            gap: 12,
            alignItems: "center",
          }}
        >
          <span>Live — /undang/{slug}</span>
          <CopyLinkButton slug={slug} />
        </div>
      )}
    </>
  );
}
