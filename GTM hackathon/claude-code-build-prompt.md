# Claude Code Build Prompt — Voiceprint MVP

> Paste everything inside the `=== PROMPT ===` block into Claude Code, in a fresh project folder
> that already contains `voiceprint.ts`, `supabase-schema.sql`, `voiceprint-design-doc.md`.
> Build the phases **in order** and stop at each checkpoint to verify before continuing.

---

=== PROMPT ===

You are building **Voiceprint**, a viral web tool for an AI email company called Lightfern.
A user pastes their writing and the tool **reads it back to them**: a descriptive portrait of *how* they
write (rhythm, tone, signature moves, lexical character, structure), a **voice archetype** (e.g. "The
Storyteller"), and a one-line signature. They can share the result and drop their email. Built for a
hackathon demo — must be robust, fast, and look like an official Lightfern microsite.

## THE ONE RULE (do not break)
This is a **MIRROR, not a JUDGE.** It DESCRIBES; it does NOT score, rank, grade, or call writing
"generic / slop / basic / AI". There is **no number anywhere**. People paste their own real writing —
grading it insults them. Find what's interesting in every voice. The axis is never human-vs-AI.

## Stack (do not deviate)
- Next.js (App Router) + TypeScript + Tailwind CSS
- Analysis runs **client-side** using the provided `voiceprint.ts` — NO API route, NO LLM, NO server call
- Supabase JS client for storing submissions (browser, anon key) and reading the voice wall
- Deploy target: Vercel
- No auth. No accounts. Email in the capture form is the only identity.

## Provided files (use them, don't reinvent)
- `voiceprint.ts` — the analysis engine. Import and call `voiceprint(text)`. It returns
  `{ archetype{name,tagline}, signatureLine, rhythm, tone[], moves[], lexical, structure, signature[], traits, wordCount, tooShort }`.
  Do NOT rewrite the analysis logic. (Its archetype names + copy are editable at the top — leave the math alone.)
- `supabase-schema.sql` — the database contract. The `submissions` table + a public `voice_wall` view. Do not rename columns.
- `voiceprint-design-doc.md` — the brand + visual spec. Follow it for color, type, motifs, and copy tone.

## Environment
Read Supabase config from env:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
Create `.env.local.example` documenting them. Never hardcode keys.

---

## BUILD IN PHASES. Verify each checkpoint before moving on.

### Phase 0 — Scaffold (get a page on screen)
- Init Next.js App Router + TS + Tailwind.
- Drop `voiceprint.ts` into `/lib/voiceprint.ts`.
- One route `/` with a textarea and a "Read my voice" button.
- On click, call `voiceprint(text)` and `JSON.stringify` the result to the screen (raw, ugly is fine).
- ✅ CHECKPOINT: I can paste text, click, and see a real portrait object (archetype, signatureLine, etc.). Stop and confirm.

### Phase 1 — The portrait (the hero)
Replace the raw JSON with a styled portrait, top to bottom:
- **Archetype name** (serif, large) with its `tagline`.
- **Signature line** (serif, quotable).
- **Voice signature** visual: render `result.signature[]` (sentence word-counts) as a row of vertical
  bars (height ∝ value). This is the ownable screenshot moment. A bursty OR even rhythm are both fine —
  it's a portrait, not a meter.
- **Tone chips** from `result.tone[]` (labelled, categorical — not a rating).
- **Portrait body**: four labelled blocks — Rhythm (`result.rhythm`), Signature moves (`result.moves[]`),
  Lexical character (`result.lexical`), Structure (`result.structure`).
- Handle `tooShort: true` → show the `signatureLine` nudge, hide the portrait, don't crash.
- Buttons: "Share my voiceprint", "Read another".
- ABSOLUTELY NO numbers, scores, percentages, ranks, or words like "generic/slop/basic/AI" in the UI.
- ✅ CHECKPOINT: paste → polished portrait with archetype, signature line, waveform, four blocks. Stop and confirm.

### Phase 2 — Capture form + Supabase
- Below the portrait, a capture card: email (required, validated), role (optional select:
  Founder / GTM / AE / Product / Investor / Writer / Other), handle (optional text).
- Create `/lib/supabase.ts` with a browser client from the env vars.
- On submit, insert one row into `submissions` matching the schema EXACTLY:
  `{ email, role, handle, text, archetype: result.archetype.name, signature_line: result.signatureLine,
     tone: result.tone, moves: result.moves, signature: result.signature, traits: result.traits,
     word_count: result.wordCount }`.
- Success state: "Sent — your voiceprint is in." Friendly error if insert fails.
- Microcopy: "Zero spam. Your writing is read in your browser." (true — analysis is client-side.)
- ✅ CHECKPOINT: a submission appears in the Supabase `submissions` table with the archetype + signature_line. Stop and confirm.
- This is the **MVP-complete line.** Everything below is additive.

### Phase 3 — Brand styling (make it look like Lightfern)
Follow `voiceprint-design-doc.md`:
- Background `paper` (#FAF7F0), ink text, `fern` (#1F6F4E) primary, blue/red splatter accents.
- Serif (Fraunces via next/font/google) for archetype name + signature line + headlines; Inter for UI/body.
- White cards, radius 20px, soft shadow.
- One paint splatter behind the archetype name; 2–3 subtle botanical accents in corners.
  You MAY hotlink real assets from `https://lightfern.com/images/landing/` (e.g. `flower-green.svg`,
  `splatter-green.svg`) for the demo, or use simple SVG stand-ins.
- Mobile-first: archetype + waveform must look right at 375px wide. Tap targets ≥ 44px.
- Respect `prefers-reduced-motion`.
- ✅ CHECKPOINT: on a phone it reads like an official Lightfern asset. Stop and confirm.

### Phase 4 — Share card
- A composed card sized for sharing (1080×1080) containing: archetype name, signature line, the
  voice-signature waveform, one tone chip, paper bg + splatter + fern, and a "lightfern.com" wordmark.
- "Download image" button: render the card to PNG client-side (use `html-to-image` or canvas) and download.
- "Copy link" button to the tool URL.
- Must look complete with no surrounding page (it travels alone). The archetype + signature line ARE the share.

### Phase 5 — Voice wall (additive, last) — NOT a leaderboard
- Route `/wall`: read the public `voice_wall` view (NOT the base table) via the anon client.
- Grid of cards: handle (or "anon") + archetype + signature line + tiny waveform. Title: "The room's voiceprints."
- NO ranking, NO scores, NO order-by-best. It's a gallery. Optional: a playful tally of archetypes.
- Link to it from the portrait screen.

---

## File structure (target)
```
/app
  /page.tsx              # paste → portrait → capture (single-page flow with state)
  /wall/page.tsx
/components
  PasteCard.tsx
  ArchetypeHero.tsx      # archetype name + tagline + signature line
  VoiceSignature.tsx     # the waveform
  ToneChips.tsx
  PortraitBlock.tsx      # rhythm / moves / lexical / structure
  CTACard.tsx
  CaptureForm.tsx
  ShareCard.tsx
/lib
  voiceprint.ts          # provided — do not edit the analysis math
  supabase.ts
.env.local.example
```

## Acceptance criteria (the whole MVP)
1. Paste text → archetype, signature line, four-part portrait, waveform, tone chips. No crash on empty/short/huge input.
2. Submitting the form writes one correctly-shaped row to `submissions` (archetype + signature_line + traits present).
3. Nowhere does the UI show a number/score/rank, or imply judgement or AI-detection.
   (Grep your own copy for digits, "%", "score", "rank", "slop", "generic", "AI".)
4. On a 375px phone it looks like a Lightfern microsite and the result is screenshot-worthy.
5. `npm run build` passes and it deploys to Vercel.

## Constraints / don'ts
- Don't reintroduce scoring/ranking/grading in any form. Mirror, not judge.
- Don't move analysis server-side. Keep it in the browser.
- Don't add auth, routing complexity, a CMS, or extra pages.
- Don't rename Supabase columns or the voice_wall view.
- Don't block the Phase 2 checkpoint on Phase 3 polish. Working first, pretty second.

Start with Phase 0 now. After each checkpoint, summarize what works and wait for my go-ahead.

=== END PROMPT ===

---

## Notes for Jawad (not part of the prompt)

- **Set the env vars first.** Get `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase → Project Settings → API, and run `supabase-schema.sql` in the SQL editor *before* Phase 2, or the insert checkpoint fails.
- **Tune the portraits early.** After Phase 1, paste 5–6 real samples (a punchy founder email, a flowing essay, a tight memo) and adjust the archetype affinity weights + descriptor copy at the top of `voiceprint.ts` until every portrait feels flattering, specific, and true. This is the biggest lever on virality.
- **Guard the one rule.** The fastest way to lose is a stray number or a "you sound generic". Have your non-coder read every output string for judgement.
- **If the clock wins:** stop after Phase 3. Phases 4–5 are gravy. The demo only needs paste → portrait → capture, looking like Lightfern.
- **Hard checkpoint = end of Phase 2** (paste → portrait → email captured). That's the hour-3 line from the build plan.
