# Role B — Data + Champion Engine

**Project:** A voiceprint tool that self-selects champions into a scored table we then email. You own the data spine and the scoring that turns tool-users into a champion list.
*(Full context: the master build brief.)*

## Your mission
Capture every tool submission, score each one for champion-fit, and rank them. This is how "people used a tool" becomes "here's who to email."

## The key idea
The capture form turns each user into a row: `email | role | handle | writing_sample`. That row already carries all three champion signals — your job is to score and rank them.

## ⚠️ Scope note on the "no scoring" rule
The "mirror, not a judge" rule is for the **user-facing voiceprint** (A's tool). **Your champion table is the back office — scoring and ranking leads is exactly its job.** You're scoring *leads for champion-fit*, not grading anyone's writing to their face. Different thing.

## What you build, in order
1. **Data store** — keep it simple (e.g. Supabase table). Agree the row schema with A at 0:00–0:30.
2. **Capture endpoint** — receives form posts from A, writes rows.
3. **Champion table view** — reads all rows, displays them ranked by score.
4. **Scoring** — for each row, call Claude with D's scoring rubric → 0–100 + a short breakdown across **mission fit / email-volume (role) / network effect (handle)**. **Score on submit and store the result** so the table renders instantly in the demo (don't make scoring a live bottleneck).
5. **Pre-load the hand-seeded champions** (10–15 real names from D) into the store, scored the same way, so the table is never thin.
6. Flag the **top N** as the outreach list.

## Handoffs
- **With A:** the data-store schema. A writes, you read.
- **From D:** the scoring rubric + the hand-seeded champion list.

## Your timeline
- **0:00–0:30** — set up store + lock schema with A
- **0:30–3:00** — capture endpoint + table skeleton
- **3:00–4:30** — scoring + load hand-seeded champions
- **4:30+** — help A/B polish, support the dry-run

## Gotchas
- **Network-effect signal:** don't build live social scraping in 6h. Let the LLM estimate from role + handle, or just rank on role + writing + whether they gave a real handle. Keep it light.
- Have a few **real, impressive rows visible** in the demo (the hand-seeds guarantee this).
