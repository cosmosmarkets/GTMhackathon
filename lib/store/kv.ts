import { Redis } from "@upstash/redis";
import type { LeadRow } from "@/lib/types";

// Shared Vercel KV / Upstash Redis store for captured leads.
//
// Vercel's "Upstash for Redis" (KV) integration injects KV_REST_API_URL and
// KV_REST_API_TOKEN into the project. When those are present, every capture
// persists here and the /champions table reads it back — which is what makes
// live submissions show up. Without them, callers fall back to their other
// stores (Supabase → forward URL → local file), so nothing here hard-fails.

export const LEADS_KEY = "leads";

let client: Redis | null = null;

export function getKv(): Redis | null {
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  if (!client) client = new Redis({ url, token });
  return client;
}

// LPUSH so the newest capture sits at the head of the list; returns the new
// total length. Throws if KV isn't configured so the caller can fall through.
export async function kvPushLead(row: LeadRow): Promise<number> {
  const kv = getKv();
  if (!kv) throw new Error("KV not configured");
  return kv.lpush(LEADS_KEY, JSON.stringify(row));
}

// Newest-first (LRANGE 0 -1 over an LPUSH list == created_at desc). Upstash may
// auto-deserialize JSON values, so accept either a string or an already-parsed
// object.
export async function kvReadLeads(): Promise<LeadRow[]> {
  const kv = getKv();
  if (!kv) return [];
  const raw = await kv.lrange<string | LeadRow>(LEADS_KEY, 0, -1);
  return raw.map((r) => (typeof r === "string" ? (JSON.parse(r) as LeadRow) : r));
}
