import { NextResponse } from "next/server";
import { generateVoiceprint } from "@/lib/voiceprint";
import { generateVoiceprintLLM } from "@/lib/prompts/voiceprint";

// Opus + adaptive thinking can take 15–40s; raise the serverless cap so the
// call isn't killed mid-flight (which would silently fall back to the local engine).
export const maxDuration = 60;

// POST /api/voiceprint
// Body: { text: string }
// Returns: Voiceprint (see lib/types.ts)
//
// NOTE FOR D: swap the body of this handler for the Claude call. Keep the
// response shape identical to `Voiceprint` and the whole UI keeps working —
// the front end only depends on the contract, not on how it's produced.
export async function POST(req: Request) {
  let text = "";
  try {
    const body = await req.json();
    text = typeof body?.text === "string" ? body.text : "";
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const words = (text.match(/[A-Za-z'’]+/g) ?? []).length;
  if (words < 20) {
    return NextResponse.json(
      { error: "Paste a little more — around 40+ words gives the truest read of your voice." },
      { status: 422 },
    );
  }

  // Prefer D's Claude prompt when a key is configured; the local analyzer is a
  // zero-dependency fallback so the tool always works (and the demo never
  // hard-fails on an API hiccup).
  const llm = await generateVoiceprintLLM(text);
  const voiceprint = llm ?? generateVoiceprint(text);
  return NextResponse.json(voiceprint);
}
