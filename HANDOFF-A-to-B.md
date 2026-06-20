# Handoff: A → B (capture → champion table)

**Decision (2026-06-20):** A keeps its data model; **B adapts the table to it.**
This is the contract. Once B creates the table below and gives A the Supabase
URL + a key, the pipeline is wired — every tool submission lands as a row B can
score and rank.

## The row A sends (LOCKED)

`POST /api/lead` validates and persists exactly this shape (`lib/types.ts → LeadRow`):

```json
{
  "id": "uuid",
  "email": "jess@acme.com",
  "role": "Founder",
  "handle": "jessbuilds",
  "writing_sample": "the full pasted text…",
  "voiceprint_json": {
    "archetype": "The Striker",
    "signature": "Short range, full force — you land the point…",
    "tagline": "You write in clean, deliberate hits.",
    "portrait": {
      "rhythm": "…", "tone": "…", "signatureMoves": "…",
      "lexicalCharacter": "…", "structure": "…"
    },
    "traits": ["punchy", "composed", "plain-spoken"]
  },
  "created_at": "2026-06-20T12:00:00.000Z"
}
```

### The three champion signals are all in here
- **Mission fit** → `writing_sample` + `voiceprint_json` (what & how they write)
- **Email-volume (role)** → `role` + `email`
- **Network effect** → `handle`

Score off these server-side. A never ranks anyone (mirror-not-judge stays on the tool side).

## Ready-to-run table (matches the row 1:1)

```sql
create table if not exists public.leads (
  id              uuid primary key,
  email           text not null,
  role            text,
  handle          text,
  writing_sample  text,
  voiceprint_json jsonb,
  created_at      timestamptz not null default now(),
  -- B's downstream columns (A never writes these):
  champion_score  int,
  score_breakdown jsonb,
  is_champion     boolean default false
);
create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_score_idx   on public.leads (champion_score desc);
```

(Want a different table name? Set `SUPABASE_LEADS_TABLE` on A.)

## How A writes to it — pick one, tell A which

1. **Direct Supabase (simplest).** Give A `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`
   (server-side env on Vercel). A inserts via PostgREST. Done.
2. **B endpoint.** Stand up an insert endpoint and give A `LEAD_FORWARD_URL`
   (+ optional `LEAD_FORWARD_KEY`). A POSTs the row above to you.

Either way, if you return `{ "rank": n, "total": m }`, the tool shows it on the
reveal ("You're #n on the board"). Optional.

## What B still owns (not A)
- Champion-scoring (call D's scoring rubric → `champion_score` + `score_breakdown`, **on submit**, stored).
- Champion-table view (reads `leads` ranked by score).
- Pre-loading D's 10–15 hand-seeded champions, scored the same way.
- Flagging top N (`is_champion`) as the outreach list.
