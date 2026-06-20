import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { LeadRow } from "@/lib/types";

// POST /api/lead
// Receives the capture-gate submission and persists the LOCKED row shape:
//   { id, email, role, handle, writing_sample, voiceprint_json, created_at }
//
// NOTE FOR B: this is a local stub so Role A is demoable solo. To hand the
// pipeline to your store, set LEAD_FORWARD_URL to your Supabase function /
// capture endpoint and this route will POST the same row to you. Until then
// rows accumulate in /data/leads.json.
const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "leads.json");

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
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

  // Forward to B's store if configured.
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
      // pass through B's rank/total if they return it
      let extra: Record<string, unknown> = {};
      try {
        extra = await res.json();
      } catch {
        /* B may return empty body */
      }
      return NextResponse.json({ ok: true, id: row.id, forwarded: true, ...extra });
    } catch (err) {
      // fall through to local persistence so we never lose a lead in the demo
      console.error("[lead] forward failed, persisting locally:", err);
    }
  }

  // Local fallback persistence.
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
    // still return ok — the demo should never hard-fail on capture
  }

  // Local stub "rank": newest on the board. B's real champion rank replaces this.
  return NextResponse.json({ ok: true, id: row.id, forwarded: false, rank: total, total });
}
