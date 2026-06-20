# Role D — Deliverables (the brains + GTM)

D owns the prompts (the product's *quality*), the seed research, sponsor ops, and
the pitch. This is the index.

## 1. Voiceprint prompt → A  ✅ shipped & wired

- **Prompt + schema:** [`lib/prompts/voiceprint.ts`](lib/prompts/voiceprint.ts) — `VOICEPRINT_SYSTEM` (mirror-not-judge) + a JSON-schema structured output that produces the `Voiceprint` contract A renders.
- **Model:** `claude-opus-4-8`, adaptive thinking, prompt caching on the stable system prompt.
- **Wired:** `/api/voiceprint` calls it when `ANTHROPIC_API_KEY` is set; otherwise it falls back to the local analyzer (`lib/voiceprint.ts`). Same response shape either way, so A's UI is unchanged.
- **The one rule, enforced in the prompt:** never score/rank/grade, never say "generic/slop/AI", find something interesting in every voice.

## 2. Champion-scoring prompt → B  ✅ shipped

- **Prompt + schema + scorer:** [`lib/prompts/champion-score.ts`](lib/prompts/champion-score.ts) — 0–100 with a breakdown across **mission-fit / email-volume / network-effect** (the back office; ranking is its job).
- **Reference endpoint:** `POST /api/score` `{ writing_sample, role, handle, email }` → `ChampionScore`. B can lift `scoreChampion()` or call the route. Needs `ANTHROPIC_API_KEY`.
- B scores on submit and stores the result (see [HANDOFF-A-to-B.md](HANDOFF-A-to-B.md) for the `leads` columns: `champion_score`, `score_breakdown`).

## 3. Hand-seeded champions → B

- **Seed list:** [`data/champions.seed.json`](data/champions.seed.json) — 8–15 real, verified people across craft writers / GTM leaders / AI educators / VC writers, each with name, role, handle, link, and why.
- B pre-loads these into the store (scored the same way) so the champion table is never thin on stage.
- **Verify before outreach** — confirm each link is current.

## 4. Sponsor live-ops + pitch

- Day-of runbook and the demo script: [DEMO-SCRIPT.md](DEMO-SCRIPT.md).

## Enabling the prompts

Set `ANTHROPIC_API_KEY` locally (`.env.local`) and on Vercel (project env). No
redeploy of code needed — the routes pick it up. Everything degrades gracefully
without it (voiceprint → local analyzer; scoring → 503).
