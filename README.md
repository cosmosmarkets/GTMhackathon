# Voiceprint — by Lightfern (Role A)

The user-facing voiceprint tool + capture gate. Paste your writing → see a
glimpse → drop email/role/handle → unlock your full portrait, archetype, and
shareable card. **The tool is a mirror, not a judge — it never scores.**

## Run it

```bash
npm install
npm run dev      # http://localhost:3000  (uses next default port)
```

No API keys needed: the voiceprint engine and lead store both run locally.

## The flow (state machine in `components/VoiceprintTool.tsx`)

`idle` (paste box) → `loading` → `teaser` (glimpse + locked preview + gate) →
`revealed` (archetype + signature + share card + full portrait + Lightfern CTA).

## Handoff contracts

These are the seams. Both sides are stubbed so Role A is demoable solo; swap in
the real thing with no front-end changes.

### From D — the voiceprint engine
- Endpoint: `POST /api/voiceprint` `{ text }` → `Voiceprint` (see `lib/types.ts`).
- Today it's a real local text-analysis engine (`lib/voiceprint.ts`) that derives
  the portrait from rhythm, punctuation, and lexical fingerprint — so every result
  is genuinely personal, offline.
- To swap in Claude: replace the handler body in `app/api/voiceprint/route.ts`,
  keep the `Voiceprint` response shape identical. UI keeps working.

### With B — the capture store (schema LOCKED)
```
{ id, email, role, handle, writing_sample, voiceprint_json, created_at }
```
- Endpoint: `POST /api/lead` validates and persists this row.
- Default: writes to `/data/leads.json` and returns `{ rank, total }` (newest-on-board).
- To forward to B: set `LEAD_FORWARD_URL` (+ optional `LEAD_FORWARD_KEY`). The route
  POSTs the same row to B and passes through B's `{ rank, total }` to the reveal.

## Stack
Next.js 14 (App Router) · Tailwind · lucide-react · Instrument Serif / DM Sans /
JetBrains Mono. Deploys to Vercel as-is (`/data` is the only local-only bit —
once B's store is wired, nothing touches the filesystem).
