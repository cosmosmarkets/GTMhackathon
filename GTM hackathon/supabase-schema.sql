-- ============================================================
-- Voiceprint — Supabase schema  (MIRROR, not judge)
-- Run in Supabase Studio → SQL Editor, or via the MCP apply_migration tool.
-- This is the CONTRACT between the tool and the champion table.
-- Agree these column names before anyone writes the insert.
--
-- NOTE: the tool no longer produces a score/band. It produces a
-- descriptive portrait + archetype. The champion table does its OWN
-- scoring downstream, from the raw text + traits stored here.
-- ============================================================

create table if not exists public.submissions (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),

  -- Captured from the form
  email          text not null,
  role           text,                 -- optional: "Founder", "GTM", "AE", etc.
  handle         text,                 -- optional: X/LinkedIn handle for the voice wall

  -- Produced by voiceprint() — descriptive, never a grade
  text           text not null,        -- the pasted writing (their consent: stored to mirror)
  archetype      text not null,        -- e.g. "The Direct Operator"
  signature_line text,                 -- the one-line signature
  tone           jsonb,                -- string[]  e.g. ["direct","conversational"]
  moves          jsonb,                -- string[]  named signature moves
  signature      jsonb,                -- number[]  sentence lengths (the waveform)
  traits         jsonb,                -- raw measured features (for the champion table)

  -- Optional analytics
  word_count     int,
  referrer       text
);

-- Helpful indexes for the voice wall + champion-table queries
create index if not exists submissions_created_idx   on public.submissions (created_at desc);
create index if not exists submissions_archetype_idx on public.submissions (archetype);

-- ============================================================
-- Row Level Security
-- The tool uses the public anon key in the browser, so RLS is what
-- keeps the table safe. Anyone can INSERT; the voice wall reads only a
-- LIMITED view. We do NOT expose email or raw text to anon reads.
-- ============================================================

alter table public.submissions enable row level security;

-- 1) Anyone (anon) may submit a voiceprint.
drop policy if exists "anon can insert submissions" on public.submissions;
create policy "anon can insert submissions"
  on public.submissions
  for insert
  to anon
  with check (true);

-- 2) Voice wall read: expose ONLY non-sensitive columns via a view.
--    No anon SELECT policy on the base table => email/text stay private.
create or replace view public.voice_wall as
  select
    id,
    created_at,
    coalesce(nullif(handle, ''), 'anon') as handle,
    role,
    archetype,
    signature_line,
    signature
  from public.submissions
  order by created_at desc
  limit 100;

grant select on public.voice_wall to anon;

-- ============================================================
-- The champion table (downstream, NOT the viral tool) reads the FULL
-- base table using the service_role key from a trusted/server context
-- — never the anon key. email + text + traits stay server-side only.
-- It computes its OWN ranking (mission signals from the writing +
-- role/email-volume + following). The tool never ranks anyone.
-- ============================================================

-- Quick checks:
-- select archetype, count(*) from public.voice_wall group by 1;  -- safe, anon-readable
-- select count(*) from public.submissions;                       -- needs service_role
