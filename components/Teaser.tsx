"use client";

import type { Voiceprint } from "@/lib/types";
import { CaptureGate, type CaptureValues } from "./CaptureGate";
import { Sparkles } from "lucide-react";

// The glimpse: enough to feel seen, not enough to walk away. The archetype
// label and the full portrait stay locked behind the gate.
export function Teaser({
  voiceprint,
  onUnlock,
  submitting,
  error,
}: {
  voiceprint: Voiceprint;
  onUnlock: (v: CaptureValues) => void;
  submitting: boolean;
  error?: string | null;
}) {
  return (
    <div className="animate-fade-up rounded-3xl border border-line bg-surface p-6 shadow-soft sm:p-8">
      <div className="flex items-center gap-2 text-accent-deep">
        <Sparkles size={16} />
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.2em]">
          Your voiceprint is ready
        </span>
      </div>

      <p className="mt-4 font-serif text-2xl leading-snug text-ink text-balance sm:text-3xl">
        {voiceprint.tagline}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        {voiceprint.traits.map((t) => (
          <span
            key={t}
            className="rounded-full border border-accent/30 bg-accent-soft px-3 py-1 text-sm text-accent-deep"
          >
            {t}
          </span>
        ))}
      </div>

      {/* One real insight, then the locked stack */}
      <div className="mt-6 rounded-2xl border border-line bg-surface-muted p-5">
        <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-accent-deep">
          Rhythm
        </div>
        <p className="mt-1.5 leading-relaxed text-ink/90">
          {voiceprint.portrait.rhythm}
        </p>
      </div>

      {/* Locked preview — blurred lines hinting at the depth behind the gate */}
      <div className="relative mt-3 select-none">
        <div className="space-y-3 rounded-2xl border border-line bg-surface-muted p-5 blur-[6px]">
          <div className="h-3 w-1/3 rounded bg-ink/15" />
          <div className="h-3 w-11/12 rounded bg-ink/10" />
          <div className="h-3 w-4/5 rounded bg-ink/10" />
          <div className="mt-4 h-3 w-1/4 rounded bg-ink/15" />
          <div className="h-3 w-10/12 rounded bg-ink/10" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="rounded-full border border-line bg-surface px-4 py-1.5 text-sm text-accent-deep shadow-soft">
            + your archetype, signature & 4 more dimensions
          </span>
        </div>
      </div>

      <div className="mt-7 border-t border-line pt-6">
        <CaptureGate onSubmit={onUnlock} submitting={submitting} error={error} />
      </div>
    </div>
  );
}
