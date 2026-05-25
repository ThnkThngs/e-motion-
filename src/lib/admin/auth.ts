import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

/**
 * Admin session = HMAC-signed cookie carrying only `{ exp }`.
 * Single shared password (ADMIN_PASSWORD); HMAC secret (ADMIN_SESSION_SECRET) rotates sessions.
 */

export const ADMIN_COOKIE = "admin_session";
export const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

interface SessionPayload {
  exp: number; // unix seconds
}

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "ADMIN_SESSION_SECRET is missing or too short (need 16+ chars)",
    );
  }
  return secret;
}

function b64urlEncode(buf: Buffer | string): string {
  const b = typeof buf === "string" ? Buffer.from(buf) : buf;
  return b.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const normalized = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(normalized, "base64");
}

export function signSession(payload: SessionPayload): string {
  const body = b64urlEncode(JSON.stringify(payload));
  const sig = createHmac("sha256", getSecret()).update(body).digest();
  return `${body}.${b64urlEncode(sig)}`;
}

export type VerifyResult =
  | { ok: true; exp: number }
  | { ok: false; reason: "malformed" | "bad-signature" | "expired" };

export function verifySession(token: string | undefined | null): VerifyResult {
  if (!token || typeof token !== "string" || !token.includes(".")) {
    return { ok: false, reason: "malformed" };
  }
  const [body, sig] = token.split(".");
  if (!body || !sig) return { ok: false, reason: "malformed" };

  const expectedSig = createHmac("sha256", getSecret()).update(body).digest();
  let providedSig: Buffer;
  try {
    providedSig = b64urlDecode(sig);
  } catch {
    return { ok: false, reason: "malformed" };
  }
  if (
    providedSig.length !== expectedSig.length ||
    !timingSafeEqual(providedSig, expectedSig)
  ) {
    return { ok: false, reason: "bad-signature" };
  }

  let parsed: SessionPayload;
  try {
    parsed = JSON.parse(b64urlDecode(body).toString("utf8"));
  } catch {
    return { ok: false, reason: "malformed" };
  }
  if (typeof parsed?.exp !== "number") return { ok: false, reason: "malformed" };
  if (parsed.exp < Math.floor(Date.now() / 1000)) {
    return { ok: false, reason: "expired" };
  }
  return { ok: true, exp: parsed.exp };
}

/**
 * Checks the admin_session cookie and returns a 401 Response on failure.
 * Returns null on success — caller continues normally.
 *
 * Use at the top of every /api/admin/* route handler.
 */
export async function requireAdmin(): Promise<Response | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  const result = verifySession(token);
  if (!result.ok) {
    return new Response(JSON.stringify({ error: "unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }
  return null;
}

/**
 * Constant-time password compare. Returns true if the supplied password
 * matches ADMIN_PASSWORD env var.
 */
export function checkPassword(supplied: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(supplied);
  const b = Buffer.from(expected);
  if (a.length !== b.length) {
    // still do one compare to keep timing roughly constant
    const dummy = Buffer.alloc(b.length);
    timingSafeEqual(dummy, b);
    return false;
  }
  return timingSafeEqual(a, b);
}
