import { forwardRef } from "react";
import type { Voiceprint } from "@/lib/types";

// The screenshot-friendly card. Designed to look good captured on a phone.
export const ShareCard = forwardRef<HTMLDivElement, { voiceprint: Voiceprint }>(
  function ShareCard({ voiceprint }, ref) {
    return (
      <div
        ref={ref}
        className="relative overflow-hidden rounded-3xl border border-fern/25 bg-ink-800 p-8 sm:p-10"
        style={{
          backgroundImage:
            "radial-gradient(40rem 24rem at 110% -20%, rgba(52,211,153,0.16), transparent 60%), radial-gradient(30rem 20rem at -10% 120%, rgba(15,118,110,0.18), transparent 55%)",
        }}
      >
        <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-bone-faint">
          <span>Voiceprint</span>
          <span className="text-fern/80">Lightfern</span>
        </div>

        <div className="mt-8">
          <div className="text-[0.7rem] font-mono uppercase tracking-[0.25em] text-fern/80">
            Your voice archetype
          </div>
          <h3 className="mt-2 font-serif text-4xl leading-none text-bone sm:text-5xl">
            {voiceprint.archetype}
          </h3>
        </div>

        <p className="mt-6 font-serif text-xl italic leading-snug text-bone/90 text-balance">
          “{voiceprint.signature}”
        </p>

        <div className="mt-7 flex flex-wrap gap-2">
          {voiceprint.traits.map((t) => (
            <span
              key={t}
              className="rounded-full border border-fern/30 bg-fern/5 px-3 py-1 text-xs font-medium text-fern-bright"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-9 border-t border-white/10 pt-5 text-sm text-bone-muted">
          This is your voice.{" "}
          <span className="text-bone">Lightfern keeps it in every email.</span>
        </div>
      </div>
    );
  },
);
