import type { ChampionScore } from "@/lib/types";
import { getAnthropic, MODEL } from "@/lib/llm/anthropic";

// ===========================================================================
// ROLE D DELIVERABLE #2 — the champion-scoring prompt (hand to B).
//
// SCOPE NOTE: this is the BACK OFFICE. Ranking leads for champion-fit is
// exactly its job — it is NOT the user-facing mirror. It never shows a score
// to the person who wrote the text. B calls this on submit and stores the
// result so the champion table renders instantly.
//
// Input: a lead row (writing_sample + role + handle + email).
// Output: 0–100 + a breakdown across the three champion signals.
// ===========================================================================

export interface ScoreInput {
  email?: string;
  role?: string;
  handle?: string;
  writing_sample?: string;
}

export const CHAMPION_SYSTEM = `You score how strong a "champion" a person is for Lightfern — an AI writing tool whose promise is "AI outreach that still sounds like YOU" (it preserves a writer's authentic voice; the opposite of generic AI slop).

A champion is someone who (a) cares about authentic writing voice and writes a lot, (b) sends or owns a high volume of outbound/relationship email, and (c) has audience or network reach so their advocacy compounds. Score each lead 0–100 overall, built from three signals:

1. MISSION FIT (do they care about voice + write with craft?) — read the writing_sample: distinctive voice, opinions, evident care for how they write all raise this. Judge the WRITING, not the topic.
2. EMAIL-VOLUME (does their role imply high outbound?) — founders, GTM/sales, BD, recruiters, agency owners, creators-with-a-newsletter score high; roles with little outbound score low. Infer from role (and email domain if telling).
3. NETWORK-EFFECT (reach) — ESTIMATE from role + whether they gave a real, public-looking handle. A real handle on a public platform suggests an audience. Do NOT claim follower counts you don't have — estimate conservatively and say it's an estimate. Never scrape.

Be decisive and honest — this is internal ranking, so a low score is fine and useful. Each breakdown reason is one short sentence. "headline" is one line a teammate can skim to decide whether to reach out. Return the structured object only.`;

export const CHAMPION_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    score: { type: "integer" },
    breakdown: {
      type: "object",
      additionalProperties: false,
      properties: {
        mission_fit: {
          type: "object",
          additionalProperties: false,
          properties: { score: { type: "integer" }, reason: { type: "string" } },
          required: ["score", "reason"],
        },
        email_volume: {
          type: "object",
          additionalProperties: false,
          properties: { score: { type: "integer" }, reason: { type: "string" } },
          required: ["score", "reason"],
        },
        network_effect: {
          type: "object",
          additionalProperties: false,
          properties: { score: { type: "integer" }, reason: { type: "string" } },
          required: ["score", "reason"],
        },
      },
      required: ["mission_fit", "email_volume", "network_effect"],
    },
    headline: { type: "string" },
  },
  required: ["score", "breakdown", "headline"],
} as const;

// Reference implementation B can call on submit. Returns null on failure.
export async function scoreChampion(lead: ScoreInput): Promise<ChampionScore | null> {
  const client = getAnthropic();
  if (!client) return null;

  const profile = [
    `role: ${lead.role || "(unknown)"}`,
    `handle: ${lead.handle || "(none given)"}`,
    `email: ${lead.email || "(none)"}`,
    `writing_sample:\n${lead.writing_sample || "(none provided)"}`,
  ].join("\n");

  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 3072, // headroom: adaptive thinking spends tokens before the JSON
      thinking: { type: "adaptive" },
      system: [
        { type: "text", text: CHAMPION_SYSTEM, cache_control: { type: "ephemeral" } },
      ],
      output_config: { format: { type: "json_schema", schema: CHAMPION_SCHEMA } },
      messages: [{ role: "user", content: `Score this lead.\n\n${profile}` }],
    } as any);

    if ((res as any).stop_reason === "refusal") return null;
    const block = (res.content as any[]).find((b) => b.type === "text");
    if (!block?.text) return null;
    return JSON.parse(block.text) as ChampionScore;
  } catch (err) {
    console.error("[champion-score] LLM call failed:", err);
    return null;
  }
}
