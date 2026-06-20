import type { Voiceprint } from "@/lib/types";
import { getAnthropic, MODEL } from "@/lib/llm/anthropic";

// ===========================================================================
// ROLE D DELIVERABLE #1 — the voiceprint prompt (hand to A).
//
// THE ONE RULE: a MIRROR, not a JUDGE. It describes how someone writes and
// hands them an archetype. It NEVER scores, ranks, grades, or says
// "generic/slop/AI". Find something interesting in EVERY voice.
//
// Output is the `Voiceprint` contract in lib/types.ts, so it drops straight
// into /api/voiceprint behind the same shape the local engine produces.
// ===========================================================================

// Stable → cacheable. Keep volatile content (the pasted text) in the user turn.
export const VOICEPRINT_SYSTEM = `You are Voiceprint, by Lightfern. You read a person's writing and reflect their voice back to them — vividly, warmly, and accurately.

THE ONE RULE: you are a MIRROR, not a JUDGE.
- Describe how they write; never evaluate whether it is good or bad.
- Never score, rank, or grade. Never say "generic", "slop", "basic", "AI", "could be improved", or anything a person would be hurt to read about their own writing.
- Find something genuinely interesting in EVERY voice — including plain, workmanlike, or sparse writing. Plainness is precision; brevity is discipline; repetition is motif. Reframe, never flatter falsely — everything you say must be true of the sample.
- Write to the person ("you"), in second person, like a perceptive friend who just read their work.

Choose the SINGLE best-fitting archetype from this set (use the exact label):
- "The Striker" — short, declarative, lands the point fast.
- "The Essayist" — long, considered sentences that hold a full thought.
- "The Cartographer" — structured and exact; lays out the ground clearly.
- "The Conversationalist" — warm, direct, talks to the reader.
- "The Storyteller" — varied rhythm that carries the reader along.
- "The Minimalist" — spare, plain, nothing wasted.
- "The Craftsman" — precise punctuation, wide vocabulary, visibly shaped.
- "The Spark" — energetic and quick, can't wait to get the idea out.

Base every observation on real evidence in THIS sample: sentence rhythm and length, punctuation habits (em-dashes, semicolons, parentheticals, questions), word choice and range, how they open and close, and any distinctive words they return to. Be specific — quote or paraphrase their own moves.

Return the structured object only. The "portrait" fields are 1–2 sentences each. "signature" is one quotable line (their voice in a sentence). "tagline" is a short teaser. "traits" are 3–4 lowercase adjectives — descriptive texture, never good/bad.`;

// JSON Schema for structured output — mirrors the Voiceprint interface.
// Only structured-output-supported constructs (no min/maxLength; objects close).
export const VOICEPRINT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    archetype: {
      type: "string",
      enum: [
        "The Striker",
        "The Essayist",
        "The Cartographer",
        "The Conversationalist",
        "The Storyteller",
        "The Minimalist",
        "The Craftsman",
        "The Spark",
      ],
    },
    signature: { type: "string" },
    tagline: { type: "string" },
    portrait: {
      type: "object",
      additionalProperties: false,
      properties: {
        rhythm: { type: "string" },
        tone: { type: "string" },
        signatureMoves: { type: "string" },
        lexicalCharacter: { type: "string" },
        structure: { type: "string" },
      },
      required: ["rhythm", "tone", "signatureMoves", "lexicalCharacter", "structure"],
    },
    traits: { type: "array", items: { type: "string" } },
  },
  required: ["archetype", "signature", "tagline", "portrait", "traits"],
} as const;

// Calls Claude with structured output. Returns null on any failure so the
// caller can fall back to the local analyzer — capture must never hard-fail.
export async function generateVoiceprintLLM(text: string): Promise<Voiceprint | null> {
  const client = getAnthropic();
  if (!client) return null;

  try {
    const res = await client.messages.create({
      model: MODEL,
      max_tokens: 4096, // headroom: adaptive thinking spends tokens before the JSON
      thinking: { type: "adaptive" },
      system: [
        {
          type: "text",
          text: VOICEPRINT_SYSTEM,
          cache_control: { type: "ephemeral" },
        },
      ],
      output_config: { format: { type: "json_schema", schema: VOICEPRINT_SCHEMA } },
      messages: [
        {
          role: "user",
          content: `Read this writing and produce its voiceprint.\n\n<writing_sample>\n${text}\n</writing_sample>`,
        },
      ],
    } as any);

    if ((res as any).stop_reason === "refusal") return null;

    const block = (res.content as any[]).find((b) => b.type === "text");
    if (!block?.text) return null;

    const parsed = JSON.parse(block.text) as Voiceprint;
    // minimal shape guard before handing to the UI
    if (!parsed?.archetype || !parsed?.portrait?.rhythm) return null;
    if (!Array.isArray(parsed.traits)) parsed.traits = [];
    return parsed;
  } catch (err) {
    console.error("[voiceprint] LLM call failed, falling back to local:", err);
    return null;
  }
}
