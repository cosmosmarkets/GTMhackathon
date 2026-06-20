import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Browser Supabase client built from public env vars.
 * Uses the anon key — safe for the browser because RLS only allows
 * INSERT into `submissions` and SELECT from the limited `voice_wall` view.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  if (!url || !anonKey) return null;
  if (!client) {
    client = createClient(url, anonKey, {
      auth: { persistSession: false },
    });
  }
  return client;
}

export const isSupabaseConfigured = Boolean(url && anonKey);
