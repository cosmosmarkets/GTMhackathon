# Voiceprint

A viral web tool for **Lightfern**. Paste your writing; it reads you back to
yourself — a descriptive portrait of how you write (rhythm, tone, signature
moves, lexical character, structure), a **voice archetype** (e.g. "The
Storyteller"), and a one-line signature. Share the result, drop your email.

> **The one rule:** this is a **mirror, not a judge**. It describes; it never
> scores, ranks, grades, or calls writing "generic / slop / AI". No numbers
> anywhere. Find what's interesting in every voice.

## Stack

- **Next.js** (App Router) + **TypeScript** + **Tailwind CSS**
- Analysis runs **100% client-side** via `lib/voiceprint.ts` — no API route, no
  LLM, no server call.
- **Supabase** JS client (browser, anon key) for storing submissions and
  reading the public voice wall.
- Deploy target: **Vercel**.

## Getting started

```bash
npm install
cp .env.local.example .env.local   # fill in your Supabase values
npm run dev
```

Open http://localhost:3000.

### Supabase setup

1. Create a Supabase project.
2. Run [`supabase-schema.sql`](./supabase-schema.sql) in the SQL editor. It
   creates the `submissions` table (RLS: anon may only INSERT) and the public
   `voice_wall` view (anon-readable, no email/raw text exposed).
3. Copy **Project Settings → API** values into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

The portrait works without Supabase; only the email capture and voice wall
need it.

## Flow

```
Paste  →  Portrait (archetype + signature line + waveform + 4 blocks)  →  Capture (email)
                                   ↘  Share card (1080×1080 PNG)
/wall  →  the room's voiceprints (gallery, never a leaderboard)
```

## Structure

```
app/
  page.tsx          # paste → portrait → capture (single-page flow with state)
  wall/page.tsx     # the voice wall (reads the voice_wall view)
  layout.tsx        # Fraunces + Inter fonts, metadata
components/
  PasteCard, ArchetypeHero, VoiceSignature, ToneChips,
  PortraitBlock, CTACard, CaptureForm, ShareCard, Decor
lib/
  voiceprint.ts     # the analysis engine (provided — math is not edited)
  supabase.ts       # browser client from env vars
```

## Editing the portraits

Archetype names, taglines, and descriptor copy live at the top of
`lib/voiceprint.ts`. Tune the **copy** and **affinity weights** to make every
portrait feel flattering, specific, and true. Leave the feature-extraction math
alone.
