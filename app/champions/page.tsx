import { buildChampionTable, type ChampionRow } from "@/lib/champion/table";
import { Trophy, ArrowLeft, Sparkles, Users } from "lucide-react";

export const dynamic = "force-dynamic";
export const maxDuration = 60; // scores leads via Opus on render; needs room beyond the default timeout
export const metadata = { title: "Champion table — Lightfern" };

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-[0.65rem] font-mono uppercase tracking-wider text-ink-faint">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-paper-subtle">
        <div
          className="h-full rounded-full bg-accent"
          style={{ width: `${Math.max(3, value)}%` }}
        />
      </div>
    </div>
  );
}

function scoreTone(score: number): string {
  if (score >= 75) return "text-accent-deep";
  if (score >= 55) return "text-ink";
  return "text-ink-faint";
}

function Row({ r }: { r: ChampionRow }) {
  return (
    <div
      className={`relative rounded-2xl border bg-surface p-5 shadow-soft sm:p-6 ${
        r.isChampion ? "border-gold/40" : "border-line"
      }`}
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        {/* Rank + score */}
        <div className="flex items-center gap-4 sm:w-28 sm:flex-col sm:items-start sm:gap-2">
          <div className="font-mono text-sm text-ink-faint">#{r.rank}</div>
          <div className={`font-mono text-4xl font-semibold leading-none ${scoreTone(r.score)}`}>
            {r.score}
          </div>
          {r.isChampion && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-[0.7rem] font-semibold text-gold-vivid">
              <Trophy size={12} /> Champion
            </span>
          )}
        </div>

        {/* Identity */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {r.link ? (
              <a
                href={r.link}
                target="_blank"
                rel="noreferrer"
                className="font-serif text-2xl text-ink underline-offset-4 hover:underline"
              >
                {r.name}
              </a>
            ) : (
              <span className="font-serif text-2xl text-ink">{r.name}</span>
            )}
            <span
              className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium uppercase tracking-wider ${
                r.source === "live"
                  ? "bg-clay/10 text-clay"
                  : "bg-accent-soft text-accent-deep"
              }`}
            >
              {r.source === "live" ? "live capture" : "seed"}
            </span>
            {r.archetype && (
              <span className="rounded-full bg-paper-subtle px-2 py-0.5 text-[0.65rem] text-ink-muted">
                {r.archetype}
              </span>
            )}
          </div>

          <div className="mt-1 text-sm text-ink-muted">
            {r.role}
            {r.handle ? ` · ${r.handle}` : ""}
          </div>

          {(r.why || r.writingPreview) && (
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">
              {r.why ? (
                r.why
              ) : (
                <span className="italic">“{r.writingPreview}”</span>
              )}
            </p>
          )}

          <p className="mt-3 text-sm font-medium text-ink">{r.headline}</p>
        </div>

        {/* Breakdown */}
        <div className="w-full space-y-2.5 sm:w-52">
          <Bar label="Mission fit" value={r.breakdown.mission_fit.score} />
          <Bar label="Email volume" value={r.breakdown.email_volume.score} />
          <Bar label="Network" value={r.breakdown.network_effect.score} />
          <div className="pt-1 text-right text-[0.65rem] font-mono uppercase tracking-wider text-ink-faint">
            {r.scoredBy === "llm" ? "AI-scored" : "heuristic"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default async function ChampionsPage() {
  const { rows, meta } = await buildChampionTable();

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-5 py-10 sm:px-8">
      <a
        href="/"
        className="inline-flex items-center gap-1.5 text-sm text-ink-muted transition hover:text-ink"
      >
        <ArrowLeft size={15} /> Voiceprint tool
      </a>

      <header className="mt-6">
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-accent-deep">
          <Sparkles size={13} /> Back office · Champion engine
        </div>
        <h1 className="mt-4 font-serif text-5xl leading-none text-ink">
          Champion table
        </h1>
        <p className="mt-3 max-w-2xl text-ink-muted">
          Everyone who runs the voiceprint tool self-selects into this list. Each
          row is scored for champion-fit — mission fit, email volume, and network
          effect — and ranked. The top {meta.topN} are flagged for outreach.
        </p>

        <div className="mt-5 flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface border border-line px-3 py-1.5 text-ink-muted">
            <Users size={13} /> {meta.total} total
          </span>
          <span className="rounded-full bg-surface border border-line px-3 py-1.5 text-ink-muted">
            {meta.live} live · {meta.seeds} seeded
          </span>
          <span className="rounded-full bg-surface border border-line px-3 py-1.5 text-ink-muted">
            Scoring: {meta.scoring === "llm" ? "AI (Claude)" : "heuristic — set ANTHROPIC_API_KEY for AI scores"}
          </span>
        </div>
      </header>

      <section className="mt-8 space-y-3">
        {rows.length === 0 ? (
          <p className="rounded-2xl border border-line bg-surface p-8 text-center text-ink-muted">
            No entries yet. Seeds load from <code>data/champions.seed.json</code>;
            live captures arrive as people use the tool.
          </p>
        ) : (
          rows.map((r) => <Row key={r.id} r={r} />)
        )}
      </section>

      <footer className="mt-12 border-t border-line pt-6 text-sm text-ink-faint">
        Champion-fit scoring is back-office only — the user-facing voiceprint tool
        never shows a score. Mirror on the front; ranking on the back.
      </footer>
    </main>
  );
}
