"use client";

// Phase 4 conversion of Stitch screen `undang-gift` — see
// .stitch/designs/undang-gift.html. Mobile visual target: an indigo section
// with a left-aligned header and a stack of glass bank-detail cards, each
// carrying a "Salin" (copy) action.
//
// Behavior: each card's account number copies to the clipboard on tap, with a
// transient "Disalin" confirmation. The cinematic InvitationProps schema does
// not (yet) carry digital-gift accounts, so this section takes an explicit
// `accounts` prop and renders nothing when the list is empty — mirroring the
// null-guard pattern in GallerySection / StorySection. When the schema gains
// a `features.gift` block, the orchestrator simply forwards it here.
//
// The Stitch `account_balance` / `content_copy` Material Symbols are replaced
// with inline SVG per the taste-design "no icon-font" rule.

import { useCallback, useState } from "react";
import { useScrollReveal } from "@/lib/hooks/useScrollReveal";
import { eyebrowStyle } from "./_shared";

export type GiftAccount = Readonly<{
  bank: string;
  holder: string;
  number: string;
}>;

type GiftProps = Readonly<{
  accounts: ReadonlyArray<GiftAccount>;
}>;

// Wallet ornament — replaces the Stitch `account_balance_wallet` Material
// Symbol. Module-level per react-best-practices (rerender-no-inline-components).
const WalletGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    width="22"
    height="22"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M3 7a2 2 0 0 1 2-2h12v4M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2H5" />
    <circle cx="16.5" cy="12.5" r="1.4" fill="currentColor" stroke="none" />
  </svg>
);

const CopyGlyph = () => (
  <svg
    viewBox="0 0 24 24"
    width="14"
    height="14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    focusable="false"
  >
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h10" />
  </svg>
);

// Single bank card. Module-level component so it is not re-created on each
// GiftSection render (react-best-practices rerender-no-inline-components).
const GiftCard = ({ account }: Readonly<{ account: GiftAccount }>) => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(() => {
    navigator.clipboard
      ?.writeText(account.number)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => {});
  }, [account.number]);

  return (
    <div
      data-stagger
      className="undang-gift-card"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        padding: 22,
        borderRadius: 14,
        border: "1px solid color-mix(in oklab, var(--gold) 28%, transparent)",
        background: "color-mix(in oklab, var(--gold) 6%, transparent)",
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 14, minWidth: 0 }}>
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            flexShrink: 0,
            borderRadius: 10,
            border: "1px solid color-mix(in oklab, var(--gold) 30%, transparent)",
            background: "color-mix(in oklab, var(--gold) 10%, transparent)",
            color: "var(--gold)",
          }}
        >
          <WalletGlyph />
        </span>
        <div style={{ minWidth: 0 }}>
          <p
            style={{
              margin: 0,
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "var(--muted)",
            }}
          >
            {account.bank}
          </p>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 13,
              color: "var(--ink)",
              textTransform: "uppercase",
              letterSpacing: 0.4,
            }}
          >
            {account.holder}
          </p>
          <p
            style={{
              margin: "4px 0 0",
              fontSize: 16,
              fontWeight: 600,
              letterSpacing: 1,
              color: "var(--gold)",
            }}
          >
            {account.number}
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={copy}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
          padding: "8px 14px",
          borderRadius: 999,
          border: 0,
          background: "var(--gold)",
          color: "var(--bg)",
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: 1.5,
          textTransform: "uppercase",
          cursor: "pointer",
        }}
      >
        {copied ? "Disalin" : "Salin"}
        <CopyGlyph />
      </button>
    </div>
  );
};

export const GiftSection = ({ accounts }: GiftProps) => {
  const ref = useScrollReveal<HTMLElement>({
    y: 40,
    stagger: 0.1,
    childSelector: "[data-stagger]",
  });

  if (accounts.length === 0) return null;

  return (
    <section
      ref={ref}
      className="undang-gift"
      style={{ padding: "100px 24px", minHeight: "100dvh" }}
    >
      <div
        className="undang-gift-inner"
        style={{ maxWidth: 600, margin: "0 auto", textAlign: "left" }}
      >
        <p data-stagger style={eyebrowStyle}>
          Hadiah Kasih
        </p>
        <h2
          data-stagger
          style={{
            fontFamily: "var(--font-script)",
            fontSize: "clamp(40px, 9vw, 64px)",
            color: "var(--gold)",
            margin: "8px 0 12px",
            fontWeight: 400,
            lineHeight: 1.1,
          }}
        >
          Salam Restu
        </h2>
        <p
          data-stagger
          style={{
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 15,
            lineHeight: 1.7,
            color: "var(--muted)",
            margin: "0 0 32px",
            maxWidth: 460,
          }}
        >
          Doa restu yang paling bermakna. Sekiranya ingin menghulurkan tanda
          kasih, kami amat menghargai.
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {accounts.map((account) => (
            // Bank + number together form a stable identity for the card.
            <GiftCard key={`${account.bank}-${account.number}`} account={account} />
          ))}
        </div>

        <p
          data-stagger
          style={{
            marginTop: 32,
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 13,
            lineHeight: 1.6,
            color: "var(--muted)",
            textAlign: "center",
          }}
        >
          Sila pastikan butiran pemindahan adalah betul. Terima kasih atas
          kemurahan hati.
        </p>
      </div>
    </section>
  );
};
