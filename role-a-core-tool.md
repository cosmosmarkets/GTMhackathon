# Role A — Core Tool (Front-End + UX)

**Project:** A voiceprint tool that positions Lightfern, self-selects champions into a scored table, and writes their outreach in Lightfern. You own the part everyone sees.
*(Full context: the master build brief.)*

## Your mission
Build the voiceprint experience and the capture gate. This is the demo's centrepiece — if it looks and feels good, we win the room.

## ⚠️ The one rule you cannot break
**The tool is a mirror, not a judge.** Your UI never shows a score, never says "slop," "generic," "AI-detected," or anything good/bad. It *describes* the person's voice back to them and gives them an archetype. People are pasting their own real writing — flatter it, don't grade it.

## What you build, in order
1. **Scaffold** a single-page Next.js/React app in Cursor.
2. **Paste box** + "Get my voiceprint" button.
3. On submit → call the voiceprint API route (D owns the prompt/output format) → get the portrait back.
4. **Teaser first, then gate.** Show a glimpse of the result, then require **email + role + handle** to unlock the full portrait + archetype + leaderboard rank. (Don't gate *everything* or people bounce.)
5. The capture form **POSTs to B's store** — agree the row shape with B in the first 30 minutes (see below).
6. **Full reveal:** the portrait + archetype label + one-line signature + a **shareable card** (archetype + signature, screenshot-friendly) with the CTA: *"This is your voice. Lightfern keeps it in every email."*

## Schema — lock this with B at 0:00–0:30
Agree the lead row before anyone goes deep:
```
{ id, email, role, handle, writing_sample, voiceprint_json, created_at }
```
If the form and B's table disagree on this, you lose an hour late. Lock it first.

## Handoffs
- **From D:** the voiceprint prompt + its output format (so you know what fields to render).
- **With B:** the data-store schema (above). Your form writes; B's table reads.

## Your timeline
- **0:00–0:30** — scaffold + lock schema with B
- **0:30–3:00** — tool working end to end + capture gate (**hard checkpoint: demoable by 3:00**)
- **4:30–5:15** — polish + dry-run the live demo path

## Gotchas
- Make the result feel *personal and fun* — this is what makes people share.
- Test with several different writing styles so it never produces a flat or generic-sounding portrait.
