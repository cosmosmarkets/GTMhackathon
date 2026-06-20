import { NextResponse } from "next/server";
import { generateVoiceprint } from "@/lib/voiceprint";

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

  const voiceprint = generateVoiceprint(text);
  return NextResponse.json(voiceprint);
}
