import { forwardRef } from "react";
import type { Voiceprint } from "@/lib/types";

// The screenshot-friendly card. Designed to look good captured on a phone —
// a premium obsidian card with the Lightfern mark and warm accents.
export const ShareCard = forwardRef<HTMLDivElement, { voiceprint: Voiceprint }>(
  function ShareCard({ voiceprint }, ref) {
    return (
      <div
        ref={ref}
        className="relative overflow-hidden rounded-3xl bg-surface-dark p-8 shadow-lift sm:p-10"
        style={{
          backgroundImage:
            "radial-gradient(38rem 22rem at 112% -18%, rgba(199,154,62,0.14), transparent 60%), radial-gradient(30rem 20rem at -12% 120%, rgba(110,127,91,0.20), transparent 58%)",
        }}
      >
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-[0.2em] text-paper/50">
          <span>Voiceprint</span>
          <span className="inline-flex items-center gap-1.5 text-paper/80">
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M.39 16.2C13.58 12.72 11.29.1 6.48 2.07c-4.94 2.03 0 18.26 10.65 9.13"
                stroke="#9DB083"
                strokeWidth="2.51"
              />
            </svg>
            Lightfern
          </span>
        </div>

        <div className="mt-8">
          <div className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-gold">
            Your voice archetype
          </div>
          <h3 className="mt-2 font-serif text-4xl leading-none text-paper sm:text-5xl">
            {voiceprint.archetype}
          </h3>
        </div>

        <p className="mt-6 font-serif text-xl italic leading-snug text-paper/90 text-balance">
          “{voiceprint.signature}”
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          {voiceprint.traits.map((t) => (
            <span
              key={t}
              className="rounded-full border border-paper/15 bg-paper/5 px-3 py-1 text-xs font-medium text-paper/80"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-9 border-t border-paper/10 pt-5 text-sm text-paper/60">
          This is your voice.{" "}
          <span className="text-paper">Lightfern keeps it in every email.</span>
        </div>
      </div>
    );
  },
);
