# Voiceprint Tool — Build Plan (Jawad's component)

Your piece = the viral front door. Paste box → Voiceprint portrait → shareable card → email capture.
Everything downstream (champion table, outreach, Scaille pages) feeds off this. Get it demoable, *then* extend.

---

## The dumb version (say this back to yourself)

A box. Someone pastes their writing. We **read it back to them** — how they write, their signature moves —
and hand them a **voice archetype** ("You're The Storyteller") plus a one-line signature. Then:
*"This is your voice. Lightfern keeps it in every email."* and grab their email.

That's it. Everything else is polish.

## The one rule (tattoo it)

**It's a mirror, not a judge.**
- ✅ "You're The Direct Operator. Short sentences, strong opinions, not a word wasted."
- ❌ "Distinctiveness: 64/100." ❌ "Going generic." ❌ "73% AI." — **never score, rank, grade, or say "slop".**
- People paste their *own real writing*. Grading it insults them and kills the share. Find what's interesting in **every** voice — that's the whole point, and it's literally Lightfern's superpower (*recognising the subtleties of your unique voice*).

---

## Scope — what's IN your component vs OUT

**IN (your job, demoable by ~hour 3):**

- [ ] Screen 1: paste box + "Read my voice" button
- [ ] Analysis engine (client-side `voiceprint()` — descriptive, no score)
- [ ] Screen 2: portrait — archetype + signature line + waveform + 4 descriptive blocks + CTA
- [ ] Shareable result card (archetype + signature line)
- [ ] Screen 3 / inline: capture form — email + optional role + handle
- [ ] Submissions saved where the champion table can read them

**OUT (not yours):** champion-table ranking, Lightfern outreach, Scaille pages, Zero.

---

## Recommended stack (non-technical, 6 hrs, won't break on stage)

| Choice | Pick | Why |
|---|---|---|
| Page | **Next.js (App Router) + TS + Tailwind** in Cursor | Cursor scaffolds it in one prompt; clean routes |
| Analysis | **Client-side `voiceprint()` in plain TS** | No API key, instant, free, never fails live |
| Storage | **Supabase** (one `submissions` table) | Already wired here; champion table reads the same rows |
| Deploy | **Vercel** | One link to seed the room |

> The engine is now a **mirror**: it returns an archetype, a signature line, and four descriptive blocks (rhythm / moves / lexical / structure) — **no number anywhere**. The provided `voiceprint.ts` already does this.

**The one real decision — descriptions engine:**

- **Heuristic-only (recommended):** `voiceprint.ts` builds the portrait from measured features + template copy. Robust, instant, zero dependencies. Already written.
- **Heuristic + LLM upgrade (only if ahead):** heuristic picks the archetype; one LLM call rewrites the portrait in fresher prose. Smarter copy, but needs an API key + proxy + can fail live. Stretch goal, never the critical path.

---

## The analysis engine (the heart) — `voiceprint.ts`, no LLM needed

It measures features and **describes**, never grades. Pipeline:

1. **Extract features** — sentence-length variation, short/long ratios, first-person + opinion density, questions, dashes, parentheticals, lists, vocabulary variety, long-word ratio, numbers.
2. **Pick a voice archetype** — each archetype scores its *affinity* to the feature vector; highest wins. (Matching, not grading — every text matches *some* archetype well.) Starter set: The Direct Operator, The Storyteller, The Craftsman, The Connector, The Architect, The Wit, The Minimalist.
3. **Build the portrait** — template sentences for rhythm, signature moves, lexical character, structure, plus tone chips.
4. **Compose the signature line** — three crisp fragments that capture the voice.
5. **Emit the waveform data** — each sentence's word-count, for the visual.

**Tune by vibe:** paste 5–6 real samples (a punchy founder email, a flowing essay, a tight memo) and adjust the archetype affinity weights + descriptor templates until each portrait feels **flattering, specific, and true**. This is the single biggest lever on shareability.

> ⚠️ The archetype names + the descriptor copy are the personality. Your non-coder should own and expand them — they live in clearly-marked blocks at the top of `voiceprint.ts`.

---

## Output copy (your non-coder owns this — the viral engine)

- **Archetype names** — aspirational, quotable, bio-worthy ("The Craftsman," not "Type C writer").
- **Taglines** — one warm line per archetype.
- **Descriptor templates** — flattering-but-true sentences per detected feature.
- **Signature line** — the thing people screenshot and quote.

Always end on the CTA: **"This is your voice. Lightfern keeps it in every email."**

---

## Build phases (mapped to the 6-hr clock)

**0:00–0:30 — Scaffold**
- [ ] Page with paste box + button + empty result area
- [ ] `voiceprint()` returns a portrait object end-to-end (prove the wiring)

**0:30–2:00 — Real portrait**
- [ ] Render archetype + signature line + 4 descriptive blocks + tone chips
- [ ] Add the voice-signature waveform
- [ ] Tune archetypes + copy against 5–6 sample texts

**2:00–3:00 — Portrait + capture (HARD CHECKPOINT: demoable)**
- [ ] CTA card
- [ ] Capture form writes a row to Supabase
- [ ] ✅ Paste → portrait → submit, live. Stop and verify before extending.

**3:00–4:30 — Viral layer**
- [ ] Shareable card (archetype + signature line; screenshot-able; bonus: download-as-PNG)
- [ ] Voice wall ("the room's voiceprints" — a gallery, no ranking)
- [ ] Deploy to Vercel, get the link

**4:30–6:00 — Seed + harden**
- [ ] Push link into the room so submissions are real by demo
- [ ] Edge cases: empty input, 5-word input, giant paste
- [ ] Optional LLM upgrade ONLY if everything above is green

---

## Data capture → handoff (so the champion table can read it)

One `submissions` table. Minimum columns:

```
id | created_at | email | role (opt) | handle (opt)
text | archetype | signature_line | tone(json) | moves(json) | signature(json) | traits(json)
```

The tool stores a **portrait + the raw text + traits** — NOT a score. The champion table does its own ranking
downstream (mission signals from the writing + role/email-volume + following). Agree these column names with
whoever builds the table *before* you start writing.

---

## Pitfalls & good-enough shortcuts

- **Don't** reintroduce a score, rank, grade, or "generic/slop" anywhere — it breaks the mission and the share. (Grep your copy for digits, "%", "score", "slop", "generic".)
- **Don't** let it drift into "is this AI?" — the axis is never human-vs-AI.
- **Don't** build the LLM path on the critical line.
- **Shortcut:** shareable "card" can be a styled `<div>` people screenshot.
- **Shortcut:** voice wall can be a simple grid — no auth, no profiles, no ranking.
- **Tune by vibe.** Calibrate archetypes + copy on real samples until every portrait feels true and flattering.
- **Empty/short input** → playful nudge, not a crash or a fake portrait.

---

## Definition of done (your component)

✅ Live Vercel link. Paste → archetype + signature line + four-part portrait + waveform + CTA → email captured to the shared table → result is screenshot-shareable → voice wall shows the room. **No number, rank, or judgement anywhere.** If that works by hour 3, everything else is gravy.
