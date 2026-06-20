import { NextResponse } from "next/server";
import { scoreChampion, type ScoreInput } from "@/lib/prompts/champion-score";

export const maxDuration = 60; // Opus + thinking can exceed the default serverless timeout

// POST /api/score  — REFERENCE endpoint for Role B (champion table).
// Body: { writing_sample, role, handle, email } → ChampionScore.
//
// D hands B the prompt (lib/prompts/champion-score.ts); this route is a working
// reference B can lift or call directly. It needs ANTHROPIC_API_KEY. The
// user-facing tool never calls this — scoring is back-office only.
export async function POST(req: Request) {
  let body: ScoreInput;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const result = await scoreChampion(body);
  if (!result) {
    return NextResponse.json(
      { error: "Scoring unavailable (set ANTHROPIC_API_KEY)." },
      { status: 503 },
    );
  }
  return NextResponse.json(result);
}
