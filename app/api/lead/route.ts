import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { LeadRow } from "@/lib/types";

// POST /api/lead
// Receives the capture-gate submission and persists the LOCKED row shape
// (see lib/types.ts → LeadRow):
//   { id, email, role, handle, writing_sample, voiceprint_json, created_at }
//
// Three persistence paths, tried in order — the first one configured wins,
// and every path degrades gracefully so capture NEVER hard-fails in a demo:
//   1. Supabase  — set SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (B's table).
//   2. Forward   — set LEAD_FORWARD_URL to a B-owned endpoint that inserts.
//   3. Local     — /data/leads.json (dev only; not writable on Vercel).
//
// HANDOFF FOR B: the agreed row maps 1:1 to columns. See HANDOFF-A-to-B.md
// for the ready-to-run `create table` and the exact JSON A sends.

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "leads.json");
const SUPABASE_TABLE = process.env.SUPABASE_LEADS_TABLE || "leads";

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

// Insert the row into B's Supabase table via PostgREST (no SDK dependency).
// Returns { rank, total } best-effort; throws on insert failure so the caller
// can fall through to the next persistence path.
async function insertToSupabase(
  url: string,
  key: string,
  row: LeadRow,
): Promise<{ rank: number | null; total: number | null }> {
  const base = url.replace(/\/$/, "");
  const res = await fetch(`${base}/rest/v1/${SUPABASE_TABLE}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(row),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`Supabase insert ${res.status}: ${detail.slice(0, 200)}`);
  }

  // Best-effort total via an exact count (HEAD-style range request).
  let total: number | null = null;
  try {
    const countRes = await fetch(`${base}/rest/v1/${SUPABASE_TABLE}?select=id`, {
      method: "GET",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: "count=exact",
        Range: "0-0",
      },
    });
    const contentRange = countRes.headers.get("content-range"); // e.g. "0-0/42"
    const parsed = contentRange?.split("/")?.[1];
    if (parsed && parsed !== "*") total = parseInt(parsed, 10);
  } catch {
    /* count is cosmetic — ignore */
  }
  return { rank: total, total };
}

export async function POST(req: Request) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const { email, role, handle, writing_sample, voiceprint_json } = body ?? {};

  if (!isNonEmptyString(email) || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return NextResponse.json({ error: "A valid email is required." }, { status: 422 });
  }
  if (!isNonEmptyString(role)) {
    return NextResponse.json({ error: "Role is required." }, { status: 422 });
  }
  if (!isNonEmptyString(handle)) {
    return NextResponse.json({ error: "Handle is required." }, { status: 422 });
  }

  const row: LeadRow = {
    id:
      globalThis.crypto?.randomUUID?.() ??
      `lead_${Date.now()}_${Math.round(Math.random() * 1e6)}`,
    email: email.trim(),
    role: role.trim(),
    handle: handle.trim().replace(/^@+/, ""),
    writing_sample: isNonEmptyString(writing_sample) ? writing_sample : "",
    voiceprint_json: voiceprint_json ?? null,
    created_at: new Date().toISOString(),
  };

  // 1) Supabase (B's table) — preferred.
  const supaUrl = process.env.SUPABASE_URL;
  const supaKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  if (supaUrl && supaKey) {
    try {
      const { rank, total } = await insertToSupabase(supaUrl, supaKey, row);
      return NextResponse.json({ ok: true, id: row.id, store: "supabase", rank, total });
    } catch (err) {
      console.error("[lead] supabase insert failed, falling back:", err);
    }
  }

  // 2) Forward to a B-owned endpoint.
  const forwardUrl = process.env.LEAD_FORWARD_URL;
  if (forwardUrl) {
    try {
      const res = await fetch(forwardUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.LEAD_FORWARD_KEY
            ? { Authorization: `Bearer ${process.env.LEAD_FORWARD_KEY}` }
            : {}),
        },
        body: JSON.stringify(row),
      });
      if (!res.ok) throw new Error(`Forward failed: ${res.status}`);
      let extra: Record<string, unknown> = {};
      try {
        extra = await res.json();
      } catch {
        /* B may return empty body */
      }
      return NextResponse.json({ ok: true, id: row.id, store: "forward", ...extra });
    } catch (err) {
      console.error("[lead] forward failed, persisting locally:", err);
    }
  }

  // 3) Local fallback (dev only).
  let total = 1;
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    let rows: LeadRow[] = [];
    try {
      rows = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
    } catch {
      rows = [];
    }
    rows.push(row);
    total = rows.length;
    await fs.writeFile(DATA_FILE, JSON.stringify(rows, null, 2), "utf8");
  } catch (err) {
    console.error("[lead] local persist failed:", err);
  }

  return NextResponse.json({ ok: true, id: row.id, store: "local", rank: total, total });
}
