import { promises as fs } from "fs";
import path from "path";
import type { ChampionScore, LeadRow } from "@/lib/types";
import { scoreChampion } from "@/lib/prompts/champion-score";
import { getAnthropic } from "@/lib/llm/anthropic";
import seedData from "@/data/champions.seed.json";

// ===========================================================================
// ROLE B — step 4: the champion table. Reads every source (hand-seeds + live
// captures), scores each for champion-fit, ranks them, flags the top N.
//
// Scoring: D's Claude prompt when ANTHROPIC_API_KEY is set; a deterministic
// heuristic otherwise — so the table always ranks, even with no key today.
// ===========================================================================

const TOP_N = 10; // flagged as the outreach list

export interface ChampionRow {
  id: string;
  source: "seed" | "live";
  name: string;
  role: string;
  handle: string;
  link?: string;
  archetype?: string;
  why?: string;
  writingPreview?: string;
  score: number;
  breakdown: ChampionScore["breakdown"];
  headline: string;
  scoredBy: "llm" | "heuristic";
  isChampion: boolean;
  rank: number;
  createdAt?: string;
}

interface Seed {
  name: string;
  role: string;
  handle: string;
  link: string;
  why: string;
  archetype_tag: string;
}

// --- Heuristic scorer (no key needed) -------------------------------------

const HIGH_VOLUME_ROLE = [
  "founder", "ceo", "co-found", "cofound", "gtm", "sales", "sdr", "bdr",
  "account exec", "revenue", "growth", "marketing", "partner", "recruit",
  "agency", "creator", "writer", "author", "newsletter", "content", "ghostwrit",
  "coach", "consult", "vp", "chief", "head of",
];

function clamp(n: number, lo = 0, hi = 100): number {
  return Math.max(lo, Math.min(hi, Math.round(n)));
}

function looksLikeRealHandle(handle: string): boolean {
  const h = handle.trim();
  if (!h) return false;
  return /@/.test(h) || /\./.test(h) || h.length >= 3;
}

function heuristicScore(input: {
  writing_sample?: string;
  role?: string;
  handle?: string;
  archetypeTag?: string;
}): ChampionScore {
  const role = (input.role || "").toLowerCase();
  const matches = HIGH_VOLUME_ROLE.filter((k) => role.includes(k)).length;
  const emailVol = role ? clamp(42 + matches * 16, 42, 92) : 40;
  const emailReason = matches
    ? `Role "${input.role}" implies regular outbound/relationship email.`
    : `Role gives a weak signal for outbound volume.`;

  let mission: number;
  let missionReason: string;
  const sample = (input.writing_sample || "").trim();
  if (sample) {
    const words = (sample.match(/\S+/g) || []).length;
    mission = clamp(48 + Math.min(words / 12, 38));
    missionReason = `Pasted ${words} words of their own writing — real voice to preserve.`;
  } else {
    const tag = input.archetypeTag || "";
    const base =
      tag === "craft-writer" || tag === "ai-educator"
        ? 82
        : tag === "vc-writer"
          ? 78
          : tag === "gtm-leader"
            ? 74
            : 66;
    mission = base;
    missionReason = `Hand-vetted ${tag || "champion"} — known for voice-led writing.`;
  }

  const handle = input.handle || "";
  const network = handle
    ? looksLikeRealHandle(handle)
      ? 72
      : 56
    : 34;
  const networkReason = handle
    ? `Public handle given (${handle}) — estimable reach.`
    : `No public handle — reach unknown.`;

  const score = clamp(0.4 * mission + 0.35 * emailVol + 0.25 * network);
  return {
    score,
    breakdown: {
      mission_fit: { score: clamp(mission), reason: missionReason },
      email_volume: { score: emailVol, reason: emailReason },
      network_effect: { score: network, reason: networkReason },
    },
    headline:
      score >= 75
        ? "Strong champion — prioritise for outreach."
        : score >= 55
          ? "Solid fit — worth a personal note."
          : "Lower priority for now.",
  };
}

// --- Store readers ---------------------------------------------------------

async function readLeads(): Promise<LeadRow[]> {
  // 1) Supabase (B's store)
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
  const table = process.env.SUPABASE_LEADS_TABLE || "leads";
  if (url && key) {
    try {
      const res = await fetch(
        `${url.replace(/\/$/, "")}/rest/v1/${table}?select=*&order=created_at.desc`,
        { headers: { apikey: key, Authorization: `Bearer ${key}` }, cache: "no-store" },
      );
      if (res.ok) return (await res.json()) as LeadRow[];
    } catch (err) {
      console.error("[champions] supabase read failed:", err);
    }
  }
  // 2) Local file (dev only)
  try {
    const file = path.join(process.cwd(), "data", "leads.json");
    return JSON.parse(await fs.readFile(file, "utf8")) as LeadRow[];
  } catch {
    return [];
  }
}

// --- Scoring orchestration -------------------------------------------------

// Cache live-lead LLM scores within a warm instance so we don't re-spend tokens
// on every page load. Keyed by a cheap content hash.
const scoreCache = new Map<string, ChampionScore>();
function hashKey(s: string): string {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return String(h);
}

function seedToRow(s: Seed): Omit<ChampionRow, "rank" | "isChampion"> {
  const h = heuristicScore({ role: s.role, handle: s.handle, archetypeTag: s.archetype_tag });
  return {
    id: `seed:${s.handle || s.name}`,
    source: "seed",
    name: s.name,
    role: s.role,
    handle: s.handle,
    link: s.link,
    archetype: s.archetype_tag,
    why: s.why,
    score: h.score,
    breakdown: h.breakdown,
    headline: h.headline,
    scoredBy: "heuristic",
  };
}

async function leadToRow(
  lead: LeadRow,
  useLLM: boolean,
): Promise<Omit<ChampionRow, "rank" | "isChampion">> {
  const name = lead.handle || lead.email?.split("@")[0] || "Anonymous";
  let scored: ChampionScore | null = null;
  let scoredBy: "llm" | "heuristic" = "heuristic";

  if (useLLM) {
    const cacheK = hashKey(`${lead.writing_sample}|${lead.role}|${lead.handle}`);
    scored = scoreCache.get(cacheK) ?? null;
    if (!scored) {
      scored = await scoreChampion({
        email: lead.email,
        role: lead.role,
        handle: lead.handle,
        writing_sample: lead.writing_sample,
      });
      if (scored) scoreCache.set(cacheK, scored);
    }
    if (scored) scoredBy = "llm";
  }
  if (!scored) {
    scored = heuristicScore({
      writing_sample: lead.writing_sample,
      role: lead.role,
      handle: lead.handle,
    });
  }

  return {
    id: `lead:${lead.id}`,
    source: "live",
    name,
    role: lead.role || "—",
    handle: lead.handle || "",
    archetype: (lead.voiceprint_json as any)?.archetype,
    writingPreview: lead.writing_sample
      ? lead.writing_sample.slice(0, 160) + (lead.writing_sample.length > 160 ? "…" : "")
      : undefined,
    score: scored.score,
    breakdown: scored.breakdown,
    headline: scored.headline,
    scoredBy,
    createdAt: lead.created_at,
  };
}

export interface ChampionTable {
  rows: ChampionRow[];
  meta: {
    total: number;
    seeds: number;
    live: number;
    topN: number;
    scoring: "llm" | "heuristic";
  };
}

export async function buildChampionTable(): Promise<ChampionTable> {
  const seeds = ((seedData as any).champions ?? []) as Seed[];
  const leads = await readLeads();
  const useLLM = !!getAnthropic();

  const seedRows = seeds.map(seedToRow);
  const leadRows = await Promise.all(leads.map((l) => leadToRow(l, useLLM)));

  const merged = [...leadRows, ...seedRows].sort((a, b) => b.score - a.score);
  const rows: ChampionRow[] = merged.map((r, i) => ({
    ...r,
    rank: i + 1,
    isChampion: i < TOP_N,
  }));

  return {
    rows,
    meta: {
      total: rows.length,
      seeds: seedRows.length,
      live: leadRows.length,
      topN: Math.min(TOP_N, rows.length),
      scoring: useLLM && leadRows.length > 0 ? "llm" : "heuristic",
    },
  };
}
