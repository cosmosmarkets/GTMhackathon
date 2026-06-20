"use client";

import { useRef, useState } from "react";
import type { Voiceprint } from "@/lib/types";
import { ShareCard } from "./ShareCard";
import { PortraitRows } from "./PortraitRows";
import { Trophy, Share2, Check, RotateCcw, Camera } from "lucide-react";

export function FullReveal({
  voiceprint,
  rank,
  total,
  onReset,
}: {
  voiceprint: Voiceprint;
  rank?: number | null;
  total?: number | null;
  onReset: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  async function share() {
    const text = `My writing voice is "${voiceprint.archetype}" — ${voiceprint.signature} (via Lightfern's voiceprint)`;
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: "My Voiceprint", text, url });
        return;
      }
    } catch {
      /* user cancelled — fall through to copy */
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* no-op */
    }
  }

  return (
    <div className="animate-fade-up space-y-6">
      {/* Headline reveal */}
      <div className="text-center">
        <div className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-fern/80">
          Your voice archetype
        </div>
        <h2 className="mt-2 font-serif text-5xl leading-none text-bone sm:text-6xl">
          {voiceprint.archetype}
        </h2>
        <p className="mx-auto mt-4 max-w-xl font-serif text-xl italic text-bone/90 text-balance">
          “{voiceprint.signature}”
        </p>

        {typeof rank === "number" && rank > 0 && (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-fern/30 bg-fern/5 px-4 py-1.5 text-sm text-fern-bright">
            <Trophy size={15} />
            You're #{rank}
            {typeof total === "number" && total > 0 ? ` of ${total}` : ""} on the
            board
          </div>
        )}
      </div>

      {/* The shareable card */}
      <ShareCard voiceprint={voiceprint} ref={cardRef} />

      <div className="flex flex-col items-center gap-3">
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={share}
            className="inline-flex items-center gap-2 rounded-xl bg-fern px-5 py-3 font-semibold text-ink transition hover:bg-fern-bright"
          >
            {copied ? <Check size={17} /> : <Share2 size={17} />}
            {copied ? "Copied" : "Share my voiceprint"}
          </button>
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 rounded-xl border border-white/15 px-5 py-3 font-medium text-bone-muted transition hover:border-white/30 hover:text-bone"
          >
            <RotateCcw size={16} />
            Try another sample
          </button>
        </div>
        <p className="inline-flex items-center gap-1.5 text-xs text-bone-faint">
          <Camera size={13} /> Screenshot the card above to post it.
        </p>
      </div>

      {/* The full portrait */}
      <div className="pt-2">
        <div className="mb-3 font-mono text-[0.7rem] uppercase tracking-[0.2em] text-bone-faint">
          The full portrait
        </div>
        <PortraitRows portrait={voiceprint.portrait} />
      </div>

      {/* Lightfern CTA */}
      <div className="rounded-3xl border border-fern/25 bg-gradient-to-br from-ink-700 to-ink-800 p-7 text-center">
        <p className="font-serif text-2xl text-bone text-balance">
          This is your voice. Lightfern keeps it in every email.
        </p>
        <p className="mx-auto mt-2 max-w-md text-bone-muted">
          AI outreach that still sounds like you — because it's trained on the
          voiceprint you just unlocked.
        </p>
        <a
          href="https://lightfern.ai"
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-fern px-6 py-3 font-semibold text-ink transition hover:bg-fern-bright"
        >
          Keep my voice with Lightfern
        </a>
      </div>
    </div>
  );
}
