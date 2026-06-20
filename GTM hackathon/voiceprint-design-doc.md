# Voiceprint — Design Document

**Reference brand:** [Lightfern](https://lightfern.com/) — *"Your voice, for any email. Sounds like you, because it is you."*
**This tool:** the front door to Lightfern's superpower — *recognising the subtleties of your unique voice.* Paste your writing; it reads you back to yourself.
**Design north star:** it should feel like an official Lightfern microsite. If someone screenshots their result, a stranger should think Lightfern shipped it.

---

## 0. THE PIVOT — read this first

**It's a mirror, not a judge.** The tool **describes** how you write and hands you a **voice archetype**. It does **not** score, rank, grade, or call anything "generic / slop / AI". People paste their own real writing — grading it insults them and kills the share. Find what's interesting in *every* voice.

- ✅ *"You're The Storyteller. You build the scene, then make the point."*
- ❌ *"Distinctiveness: 64/100."* / ❌ *"73% AI."* / ❌ *"Going generic."* — never.

This is Lightfern's pitch, demoed live: the tool proves Lightfern can *read* your voice, so it can *keep* it.

---

## 1. What we learned from lightfern.com (the brand we're matching)

**Voice / tone** — calm, confident, human. Short declaratives (*"Sounds like you, because it is you."*). Warm, never hype. The copy itself is unfussy — which is the product's whole promise.

**Visual motifs (the ownable stuff)**
- **Botanical**: ferns + hand-painted flowers (`flower-green`, `flower-red`, `flower-2`) as organic accents.
- **Painterly splatters**: green / blue / red paint (`splatter-green/blue/red`) — the hand-made texture against clean UI.
- **Clean email surfaces**: crisp white cards, real-looking inbox mockups, soft shadows, rounded corners.

**The tension to reproduce:** *precise clean software* + *organic hand-made warmth*. That contrast **is** the brand. Our tool sits in the same gap: a sharp, specific read of someone's voice, presented with handcrafted warmth.

> ⚠️ Sample the exact hex values off the live logo/splatters before finalizing. Palette below is tuned to match the site — verify, don't guess.

---

## 2. Design principles (for this tool)

1. **Flattering-but-true.** Every portrait finds what's good. No judgement, ever.
2. **The archetype + signature line are the hero.** That's the shareable hook — a label you'd put in your bio.
3. **Make the voice visible.** Render sentence-rhythm as a "voice signature" waveform — descriptive, ownable, screenshot-worthy.
4. **Paper, not dashboard.** Warm off-white, botanical accents — a portrait, not an analytics report.
5. **One screen of delight per step.** Paste → reveal → share. No nav, no clutter.

---

## 3. Visual system

### Color (verify against live site)

| Token | Hex (proposed) | Use |
|---|---|---|
| `paper` | `#FAF7F0` | Page background (warm, painterly off-white) |
| `ink` | `#1A1D1A` | Primary text |
| `fern` | `#1F6F4E` | Primary green — buttons, archetype accent, brand |
| `fern-bright` | `#3DBA7A` | Highlights |
| `splatter-blue` | `#3B6FD4` | Accent, tone chips |
| `splatter-red` | `#E5533C` | Accent (warm, never "error/bad") |
| `card` | `#FFFFFF` | Result / capture surfaces |
| `muted` | `#6B716B` | Secondary text, captions |

No red-means-bad anywhere. Color is decorative + categorical, never a verdict.

### Typography

- **Display / archetype / signature line:** warm editorial serif — **Fraunces** (or similar). Makes the archetype feel crafted and quotable.
- **UI / body:** clean humanist sans — **Inter**. Matches Lightfern's tidy product type.
- **Rule:** serif for archetype name + signature line + section headlines only. Everything else sans.

### Shape & texture

- Cards: white, radius 20px, soft shadow (`0 8px 30px rgba(0,0,0,0.06)`).
- Botanical SVG accents in 2–3 corners — subtle.
- One paint-splatter behind the archetype name (the hero texture). One hero moment, don't over-splatter.
- Generous whitespace, single column, max-width ~640px.

### The signature visual — "voice signature" 〰️

Turn each sentence's length into a bar in a little waveform (`result.signature[]`). Bursty rhythm looks alive; even rhythm looks calm — **both are valid**, it's a portrait not a meter. This visualizes real data, is uniquely ours, and is the thing people screenshot. ~80px tall, full card width, inline SVG/canvas.

---

## 4. Screens & flow

```
[1 Landing/Paste]  →  [2 Voiceprint portrait]  →  [3 Capture]  →  [Share card / Voice wall]
```

### Screen 1 — Paste

- Hero (serif): **"What does your voice sound like?"**
- Sub (sans): *"Paste anything you've written. We'll read it back to you."*
- Large textarea (white card, placeholder: *"Paste an email, a post, a paragraph…"*).
- Primary button (`fern`): **"Read my voice"**.
- Botanical accent top-right, splatter bottom-left. No nav.

### Screen 2 — The portrait (the hero)

Top to bottom:
- **Archetype name** (serif, large) inside/over a splatter — e.g. *"The Direct Operator."* + its tagline.
- **Signature line** (serif, quotable) — *"Short sentences, strong opinions, not a word wasted."*
- **Voice signature** waveform.
- **Tone chips** — 2–3 (`conversational`, `direct`, `curious`).
- **Portrait body** — four short descriptive blocks, each a label + sentence:
  - *Rhythm* — how the sentences move.
  - *Signature moves* — the recurring devices (dashes, asides, one-liners).
  - *Lexical character* — plain vs ranging vocabulary.
  - *Structure* — how they open, build, land.
- **CTA card** (white, Lightfern email-surface style): *"This is your voice. Lightfern keeps it in every email."* → button.
- Secondary: **Share my voiceprint** · **Read another**.
- Handle `tooShort: true` → show the nudge line, hide the portrait, don't crash.

### Screen 3 — Capture

- Framed as a reward, not a gate: *"Want your full voiceprint + early access?"*
- Fields: **email** (required), **role** (optional select), **handle** (optional).
- Button (`fern`): **"Send it to me."**
- Microcopy: *"Zero spam. Your writing is read in your browser."* (true — analysis is client-side.)

### Share card (the viral asset)

- Square (1080×1080), exportable PNG.
- Contents: **archetype name**, **signature line**, the voice-signature waveform, one tone chip, `paper` bg + splatter + fern, and a **lightfern.com** wordmark.
- Must look complete with no surrounding page (it travels alone). The archetype + signature line *are* the share.
- "Download image" + "Copy link".

### Voice wall (additive — replaces the old leaderboard)

- *"The room's voiceprints."* No ranking — a wall, not a ladder.
- Grid of cards: handle (or "anon") + archetype + signature line + tiny waveform.
- Optional: a tally of archetypes ("7 Storytellers, 4 Operators…"). Playful, not competitive.

---

## 5. Voice & copy rules

- Find the interesting thing in every voice. Specific beats flattering-but-vague.
- ✅ *"You think in parentheses — a quiet aside is your signature."*
- ❌ any score, rank, grade, "generic", "slop", "basic", "AI". A portrait, not a report card.
- Archetype names are aspirational and shareable (something you'd quote in a bio).
- Describe **the writing**, not the person's worth.
- CTA always ties to the promise: *keeps it in every email.*

---

## 6. Responsive & accessibility

- Mobile-first single column (shares open on phones). Archetype + waveform must look right at 375px.
- Tap targets ≥ 44px. Comfortable textarea on mobile.
- Text contrast ≥ 4.5:1 (check `muted` on `paper`).
- Never encode meaning in color alone — tone chips are labelled.
- Respect `prefers-reduced-motion` for reveal animation.

---

## 7. Component checklist (hand to Cursor)

- [ ] `PasteCard` — textarea + "Read my voice" button
- [ ] `ArchetypeHero` — archetype name + tagline + signature line + splatter
- [ ] `VoiceSignature` — sentence-rhythm waveform (SVG/canvas)
- [ ] `ToneChips` — labelled tone descriptors
- [ ] `PortraitBlock` — rhythm / moves / lexical / structure (label + sentence ×4)
- [ ] `CTACard` — Lightfern-style email surface + button
- [ ] `CaptureForm` — email/role/handle → Supabase
- [ ] `ShareCard` — exportable PNG composition
- [ ] `VoiceWall` — gallery of archetypes (additive)

---

## 8. Build-order note (so design doesn't block the demo)

Get Screen 1 → portrait → Screen 2 working in **default styling first**, then layer the brand (paper bg, serif, splatter, botanical accents, waveform). The brand layer makes it look like Lightfern but it's additive — never let polish delay the hour-3 demoable checkpoint.

**Good-enough shortcuts if the clock wins:**
- Pull the real fern/flower/splatter SVGs from `lightfern.com/images/landing/` rather than redrawing.
- Skip the canvas waveform; a row of CSS bars reads the same.
- Share card can be a styled div people screenshot; auto-PNG export is a bonus.

---

## 9. Definition of done (design)

✅ On a phone, a stranger pastes text, sees their **archetype** + **signature line** on warm paper with a fern accent and their voice-signature, reads a four-part portrait that flatters them and feels *true*, and the result screenshots like an official Lightfern asset — wordmark and all. Nowhere is there a number, rank, or judgement.
