import { ImageResponse } from "next/og";
import { createSupabaseServer } from "@/lib/supabase/server";

export const runtime = "nodejs";

const DEFAULT_BG = "#1a2040";
const DEFAULT_GOLD = "#c9a24e";
const DEFAULT_INK = "#f8f0de";

// Palette-only lookup. We can't import the full themes module here because
// it loads Remotion Google Fonts via React context, which Next.js server
// routes cannot execute. Keep this in sync with remotion/src/themes.ts.
type TemplatePalette = { bg: string; gold: string; ink: string; label: string };
const TEMPLATE_PALETTES: Record<string, TemplatePalette> = {
  floral: { bg: "#FAF6E3", gold: "#9C7A3C", ink: "#2A1F18", label: "Floral Walimatul" },
  khat: { bg: "#F4ECD8", gold: "#B98941", ink: "#1F1812", label: "Khat Calligraphy" },
  modern: { bg: "#F6F1EA", gold: "#8FA08C", ink: "#2C3236", label: "Modern Geometric" },
  wildflower: { bg: "#0E1B2C", gold: "#E8B96A", ink: "#FCE8C8", label: "Wildflower Garden" },
  songket: { bg: "#0F0A1A", gold: "#F4D78A", ink: "#F4D78A", label: "Songket Heritage" },
  batik: { bg: "#FFFAF1", gold: "#D89A2C", ink: "#3A2410", label: "Batik Paisley" },
  "tenun-pahang": { bg: "#3A2F23", gold: "#C9954F", ink: "#F2E6C8", label: "Tenun Pahang Lipat" },
  mawar: { bg: "#F5E8E0", gold: "#BFA572", ink: "#3A2C2A", label: "Mawar Pastel" },
  andaman: { bg: "#0E2745", gold: "#D4A24A", ink: "#F4D78A", label: "Andaman Diraja" },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug") ?? "";
  const template = searchParams.get("template") ?? "";
  // Compact mode renders a monogram-style card with bigger margins and a
  // simpler ornament — designed to read as a card thumbnail when displayed
  // small (e.g. inline within the hero headline at ~50px).
  const compact = searchParams.get("compact") === "1";

  // Theme-driven palette (for template thumbnails) or brand default (for slug previews)
  let bg = DEFAULT_BG;
  let gold = DEFAULT_GOLD;
  let ink = DEFAULT_INK;

  if (template && template in TEMPLATE_PALETTES) {
    const p = TEMPLATE_PALETTES[template];
    bg = p.bg;
    gold = p.gold;
    ink = p.ink;
  }

  let bride = "";
  let groom = "";

  if (slug) {
    try {
      const supabase = await createSupabaseServer();
      const { data } = await supabase
        .from("invitations")
        .select("payload, template_id")
        .eq("slug", slug)
        .single();
      if (data?.payload) {
        const p = data.payload as Record<string, unknown>;
        bride = String(p.brideName ?? p.brideShort ?? "").trim();
        groom = String(p.groomName ?? p.groomShort ?? "").trim();
      }
      // Use the invitation's theme palette if it has one
      const tid = data?.template_id as string | undefined;
      if (tid && tid in TEMPLATE_PALETTES) {
        const p = TEMPLATE_PALETTES[tid];
        bg = p.bg;
        gold = p.gold;
        ink = p.ink;
      }
    } catch {
      // Fall through to default names + palette
    }
  } else if (template) {
    // Template thumbnail mode — show sample couple names
    bride = "Aisya";
    groom = "Hakim";
  }

  const names = bride && groom ? `${bride} & ${groom}` : "Majlis Perkahwinan";
  const themeLabel = template && template in TEMPLATE_PALETTES ? TEMPLATE_PALETTES[template].label : "";
  const mutedInk = `${ink}99`; // ~60% opacity hex

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: bg,
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        {/* Gold border frame */}
        <div
          style={{
            position: "absolute",
            inset: 28,
            border: `1px solid ${gold}73`,
            borderRadius: 10,
          }}
        />
        {/* Inner thin frame */}
        <div
          style={{
            position: "absolute",
            inset: 36,
            border: `1px solid ${gold}2E`,
            borderRadius: 6,
          }}
        />

        {/* Brand eyebrow — hidden in compact mode (unreadable at thumbnail size) */}
        {!compact && (
          <div
            style={{
              fontSize: 13,
              letterSpacing: 7,
              color: mutedInk,
              textTransform: "uppercase",
              marginBottom: 32,
              display: "flex",
            }}
          >
            {themeLabel ? `e-motion.my · ${themeLabel}` : "e-motion.my · Warisan Edition"}
          </div>
        )}

        {/* Top ornament — slightly larger in compact mode so it reads as a card glyph */}
        <div
          style={{
            fontSize: compact ? 64 : 20,
            color: gold,
            marginBottom: compact ? 32 : 16,
            letterSpacing: compact ? 4 : 12,
            display: "flex",
          }}
        >
          {compact ? "✦" : "✦ ✦ ✦"}
        </div>

        {/* Couple names — larger in compact mode so monogram reads when scaled small */}
        <div
          style={{
            fontSize: compact ? 140 : names.length > 30 ? 56 : 72,
            color: gold,
            fontStyle: "italic",
            lineHeight: 1.15,
            textAlign: "center",
            maxWidth: 960,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {names}
        </div>

        {/* Bottom ornament — hidden in compact mode for cleaner read */}
        {!compact && (
          <div
            style={{
              fontSize: 20,
              color: `${gold}99`,
              marginTop: 16,
              letterSpacing: 12,
              display: "flex",
            }}
          >
            ✦ ✦ ✦
          </div>
        )}

        {/* Subtitle — hidden in compact mode (unreadable at thumbnail size) */}
        {!compact && (
          <div
            style={{
              marginTop: 24,
              fontSize: 16,
              color: mutedInk,
              letterSpacing: 4,
              display: "flex",
            }}
          >
            Jemputan Perkahwinan
          </div>
        )}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    },
  );
}
