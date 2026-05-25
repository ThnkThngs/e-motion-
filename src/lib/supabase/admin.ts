import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseServer } from "./server";
import type { Database } from "@/types/database";

/**
 * Server-only admin client.
 *
 * - When SUPABASE_SERVICE_ROLE_KEY is set, returns a client that bypasses RLS.
 *   This is the right setup if RLS blocks anon reads on rsvps / ucapan.
 * - Otherwise falls back to the cookie-bound server client using the anon key.
 *
 * NEVER import this from a client component. The service-role key MUST stay
 * on the server. Use only inside /api/admin/* route handlers and admin server
 * components.
 */
export async function createSupabaseAdmin(): Promise<SupabaseClient<Database>> {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;

  if (serviceKey && url) {
    return createClient<Database>(url, serviceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return await createSupabaseServer();
}
