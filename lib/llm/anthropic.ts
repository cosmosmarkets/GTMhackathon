import Anthropic from "@anthropic-ai/sdk";

// Lazy singleton. Returns null when no key is configured so callers can fall
// back gracefully (the demo never hard-depends on the LLM).
let client: Anthropic | null = null;

export function getAnthropic(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;
  if (!client) client = new Anthropic({ apiKey });
  return client;
}

// D's locked model choice for the hackathon (see CLAUDE.md project log).
export const MODEL = "claude-opus-4-8";
