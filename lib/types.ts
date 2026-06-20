// The voiceprint contract. D owns the real prompt that produces this shape;
// the mock engine in lib/voiceprint.ts produces the same shape so the UI is
// identical whether we're running the local analyzer or a Claude call.

export interface VoiceprintPortrait {
  rhythm: string;
  tone: string;
  signatureMoves: string;
  lexicalCharacter: string;
  structure: string;
}

export interface Voiceprint {
  archetype: string; // e.g. "The Cartographer"
  signature: string; // one-line, screenshot-friendly
  tagline: string; // very short teaser line shown before the gate
  portrait: VoiceprintPortrait;
  // a few descriptive chips for the teaser — never good/bad, just texture
  traits: string[];
}

// The lead row — LOCKED WITH B at 0:00. Form writes it, B's table reads it.
export interface LeadRow {
  id: string;
  email: string;
  role: string;
  handle: string;
  writing_sample: string;
  voiceprint_json: Voiceprint;
  created_at: string;
}
