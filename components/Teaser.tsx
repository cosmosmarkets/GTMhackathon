"use client";

import type { Voiceprint } from "@/lib/types";
import { CaptureGate, type CaptureValues } from "./CaptureGate";

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
    <div className="animate-vp-fade">
      {/* Divider: ❧ The First Sprout ❧ */}
      <div className="my-1 flex items-center justify-center gap-[18px]">
        <span
          className="h-px flex-1"
          style={{ background: "linear-gradient(90deg, transparent, rgba(42,32,22,.4))" }}
        />
        <span className="whitespace-nowrap font-label text-[13px] tracking-[0.32em] text-accent-deep">
          &#10087;&nbsp;&nbsp;The First Sprout&nbsp;&nbsp;&#10087;
        </span>
        <span
          className="h-px flex-1"
          style={{ background: "linear-gradient(90deg, rgba(42,32,22,.4), transparent)" }}
        />
      </div>

      <div className="mt-[18px] grid grid-cols-1 items-start gap-12 md:grid-cols-[1.5fr_1fr]">
        {/* glimpse */}
        <div>
          <div className="font-label text-[11px] tracking-[0.26em] text-clay">
            A first glimpse &#8212; one observation of four
          </div>

          <p className="mt-[14px] font-display text-[clamp(30px,3.2vw,46px)] font-medium italic leading-[1.12] text-ink [text-wrap:pretty]">
            {voiceprint.tagline}
          </p>

          {/* traits rule */}
          <div className="mb-1 mt-[26px] flex items-center gap-[14px]">
            <span
              className="h-px w-[30px] flex-none"
              style={{ background: "rgba(42,32,22,.5)" }}
            />
            <span className="font-label text-[11px] tracking-[0.22em] text-accent-deep">
              {voiceprint.traits.join(" ❧ ")}
            </span>
            <span
              className="h-px flex-1"
              style={{ background: "rgba(42,32,22,.25)" }}
            />
          </div>

          {/* one open ledger entry */}
          <div
            className="mt-[22px] grid grid-cols-[40px_1fr] gap-4 pt-[14px]"
            style={{ borderTop: "1px solid rgba(42,32,22,.35)" }}
          >
            <div className="font-display text-[26px] italic leading-none text-rust">
              I.
            </div>
            <div>
              <div className="font-label text-[11px] tracking-[0.22em] text-ink-soft">
                Rhythm
              </div>
              <p className="mt-1.5 font-body text-[17px] leading-[1.55] text-ink">
                {voiceprint.portrait.rhythm}
              </p>
            </div>
          </div>

          {/* sealed remainder */}
          <div className="relative mt-1 select-none">
            <div style={{ filter: "blur(5px)", opacity: 0.6 }}>
              <div
                className="mt-[14px] grid grid-cols-[40px_1fr] gap-4 pt-[14px]"
                style={{ borderTop: "1px solid rgba(42,32,22,.3)" }}
              >
                <div className="font-display text-[26px] italic text-rust">II.</div>
                <div>
                  <div className="mb-[9px] h-[10px] w-[22%]" style={{ background: "rgba(42,32,22,.4)" }} />
                  <div className="mb-[7px] h-[9px] w-[94%]" style={{ background: "rgba(42,32,22,.22)" }} />
                  <div className="h-[9px] w-[80%]" style={{ background: "rgba(42,32,22,.22)" }} />
                </div>
              </div>
              <div
                className="mt-[14px] grid grid-cols-[40px_1fr] gap-4 pt-[14px]"
                style={{ borderTop: "1px solid rgba(42,32,22,.3)" }}
              >
                <div className="font-display text-[26px] italic text-rust">III.</div>
                <div>
                  <div className="mb-[9px] h-[10px] w-[30%]" style={{ background: "rgba(42,32,22,.4)" }} />
                  <div className="mb-[7px] h-[9px] w-[88%]" style={{ background: "rgba(42,32,22,.22)" }} />
                  <div className="h-[9px] w-[70%]" style={{ background: "rgba(42,32,22,.22)" }} />
                </div>
              </div>
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span
                className="font-body text-[16px] italic text-accent-deep"
                style={{
                  background: "rgba(252,247,235,.85)",
                  border: "1px solid rgba(42,32,22,.4)",
                  padding: "8px 18px",
                }}
              >
                your archetype &amp; three more readings, still sealed
              </span>
            </div>
          </div>
        </div>

        {/* register gate */}
        <CaptureGate onSubmit={onUnlock} submitting={submitting} error={error} />
      </div>
    </div>
  );
}
