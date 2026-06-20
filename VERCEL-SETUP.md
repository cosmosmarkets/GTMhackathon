# Vercel setup — make live submissions show up

**Goal:** right now when someone uses the tool, their submission isn't saved (the
serverless filesystem is read-only and no database is connected). This connects a
datastore so every submission persists and appears in the champion table at
`/champions`.

**Everything is in Vercel. No Supabase, no separate account, no SQL.**

Project: **`voiceprint-lightfern`** (team `welddevelopments-projects`).

---

## Step 1 — Add the datastore (KV / Upstash Redis)

1. Vercel dashboard → open the **`voiceprint-lightfern`** project.
2. Top nav → **Storage** → **Create Database**.
3. Choose **Upstash for Redis** (may be labelled **KV**). Pick the free plan,
   any region close to you, give it a name (e.g. `voiceprint-kv`), create it.
4. When prompted, **Connect it to the `voiceprint-lightfern` project** for **all
   environments** (Production, Preview, Development).

That's it. Connecting auto-adds the credentials as environment variables
(`KV_REST_API_URL`, `KV_REST_API_TOKEN`) — you don't copy/paste anything. The app
already reads these.

## Step 2 — Redeploy

Connecting the store usually triggers a redeploy. If it doesn't, go to
**Deployments → ⋯ on the latest → Redeploy** (or just push any commit). The new
deploy picks up the credentials.

## Step 3 — Verify it works

1. Open **https://voiceprint-lightfern.vercel.app** → paste writing → fill the
   email/role/handle gate → submit.
2. Open **https://voiceprint-lightfern.vercel.app/champions**.
3. The header should now show **live: 1** (or more), and the person appears in the
   ranked list with a **"live capture"** chip. Done.

If `live:` is still 0 after a submit + refresh, the store isn't connected to the
project — re-check Step 1.4 (it must be connected, not just created).

---

## Optional — turn on AI scoring

Without this, the table ranks with a built-in heuristic (works fine). With an
Anthropic API key, the voiceprint and champion scores use Claude (`claude-opus-4-8`).

1. Project → **Settings → Environment Variables**.
2. Add `ANTHROPIC_API_KEY` = the key, for all environments. **Redeploy.**

> ⚠️ It must be an **Anthropic** key (starts with `sk-ant-`). A key from another
> provider (e.g. OpenAI `sk-…`) won't work with this code without a code change —
> tell the dev first if that's what you have.

---

## What's connected to what (for reference)

| Env var | Set by | Effect |
|---|---|---|
| `KV_REST_API_URL` / `KV_REST_API_TOKEN` | the KV/Upstash integration (Step 1) | submissions persist + show in `/champions` |
| `ANTHROPIC_API_KEY` | you, manually (optional) | AI voiceprints + AI champion scores instead of heuristic |

Nothing else is required. No `SUPABASE_*` vars — ignore any Supabase references in
older docs; this build uses Vercel KV.
