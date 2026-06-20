import type { LeadRow } from "@/lib/types";

// Vercel KV (Upstash Redis) via the REST API — no SDK, no schema.
// The Vercel "KV / Upstash for Redis" integration injects KV_REST_API_URL +
// KV_REST_API_TOKEN automatically; we also accept the UPSTASH_* names.
// This is the whole datastore: append a lead, list them back. No Supabase.

const KEY = "voiceprint:leads";

function creds(): { url: string; token: string } | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token =
    process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return { url: url.replace(/\/$/, ""), token };
  return null;
}

export function kvConfigured(): boolean {
  return creds() !== null;
}

// Send a single Redis command via the Upstash REST endpoint.
async function command(args: (string | number)[]): Promise<unknown> {
  const c = creds();
  if (!c) throw new Error("KV not configured");
  const res = await fetch(c.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${c.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`KV ${res.status}: ${await res.text().catch(() => "")}`);
  const json = (await res.json()) as { result?: unknown; error?: string };
  if (json.error) throw new Error(`KV error: ${json.error}`);
  return json.result;
}

// Append a lead; returns the new total count (used for rank/total).
export async function appendLead(row: LeadRow): Promise<number> {
  const len = await command(["RPUSH", KEY, JSON.stringify(row)]);
  return typeof len === "number" ? len : 0;
}

// Read every lead (oldest → newest).
export async function listLeads(): Promise<LeadRow[]> {
  const result = await command(["LRANGE", KEY, "0", "-1"]);
  if (!Array.isArray(result)) return [];
  const rows: LeadRow[] = [];
  for (const item of result) {
    try {
      rows.push(JSON.parse(item as string));
    } catch {
      /* skip a malformed entry */
    }
  }
  return rows;
}
