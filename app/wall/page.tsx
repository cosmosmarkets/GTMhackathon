"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import VoiceSignature from "@/components/VoiceSignature";
import { SplatterGreen } from "@/components/Decor";

/**
 * Voice wall — a GALLERY, not a leaderboard.
 * Reads the public `voice_wall` view (never the base table). No ranking,
 * no scores, no order-by-best. A playful archetype tally is the only count.
 */

type WallRow = {
  id: string;
  handle: string | null;
  role: string | null;
  archetype: string;
  signature_line: string | null;
  signature: number[] | null;
};

export default function WallPage() {
  const [rows, setRows] = useState<WallRow[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const supabase = getSupabase();
    if (!supabase) {
      setState("error");
      return;
    }
    supabase
      .from("voice_wall")
      .select("id, handle, role, archetype, signature_line, signature")
      .then(({ data, error }) => {
        if (error) {
          setState("error");
          return;
        }
        setRows((data as WallRow[]) ?? []);
        setState("ready");
      });
  }, []);

  const tally = rows.reduce<Record<string, number>>((acc, r) => {
    acc[r.archetype] = (acc[r.archetype] || 0) + 1;
    return acc;
  }, {});
  const tallyEntries = Object.entries(tally).sort((a, b) => b[1] - a[1]);

  return (
    <main className="relative min-h-screen px-5 pb-24 pt-12 sm:pt-16">
      <SplatterGreen className="pointer-events-none absolute -left-20 top-10 -z-10 h-72 w-72 opacity-[0.06]" />

      <div className="mx-auto w-full max-w-4xl">
        <div className="text-center">
          <Link
            href="/"
            className="text-sm font-medium text-fern underline-offset-4 hover:underline"
          >
            ← Read your voice
          </Link>
          <h1 className="mt-4 font-serif text-4xl font-semibold text-ink sm:text-5xl">
            The room&rsquo;s voiceprints.
          </h1>
          <p className="mx-auto mt-3 max-w-md text-muted">
            A wall of voices, side by side. No ladder, no ranking — just the
            range of how people write.
          </p>
        </div>

        {/* Playful archetype tally */}
        {tallyEntries.length > 0 && (
          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {tallyEntries.map(([name, n]) => (
              <span
                key={name}
                className="inline-flex items-center gap-1 rounded-full border border-fern/20 bg-fern/[0.06] px-3 py-1 text-sm text-fern"
              >
                <span className="font-semibold">{n}</span>
                <span>
                  {name.replace(/^The /, "")}
                  {n === 1 ? "" : "s"}
                </span>
              </span>
            ))}
          </div>
        )}

        <div className="mt-10">
          {state === "loading" && (
            <p className="text-center text-muted">Reading the room…</p>
          )}

          {state === "error" && (
            <p className="text-center text-muted">
              {isSupabaseConfigured
                ? "Couldn't load the wall just now."
                : "The wall lights up once Supabase is connected."}
            </p>
          )}

          {state === "ready" && rows.length === 0 && (
            <p className="text-center text-muted">
              No voiceprints yet — be the first.
            </p>
          )}

          {state === "ready" && rows.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {rows.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col rounded-card border border-black/[0.04] bg-card p-5 shadow-card"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-sm font-medium text-muted">
                      {r.handle || "anon"}
                    </span>
                    {r.role ? (
                      <span className="text-xs text-muted/70">{r.role}</span>
                    ) : null}
                  </div>
                  <h2 className="mt-1 font-serif text-xl font-semibold text-ink">
                    {r.archetype}
                  </h2>
                  {r.signature_line ? (
                    <p className="mt-2 flex-1 font-serif text-[15px] italic leading-snug text-ink/80">
                      &ldquo;{r.signature_line}&rdquo;
                    </p>
                  ) : (
                    <div className="flex-1" />
                  )}
                  {r.signature && r.signature.length > 0 ? (
                    <div className="mt-4">
                      <VoiceSignature
                        signature={r.signature}
                        height={40}
                        animate={false}
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
