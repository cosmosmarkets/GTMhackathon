import { forwardRef } from "react";
import type { Voiceprint } from "@/lib/types";

const GOLD_TINT =
  "brightness(0) saturate(100%) invert(72%) sepia(18%) saturate(420%) hue-rotate(46deg) brightness(92%)";

// The screenshot-friendly "Plate" — a dark obsidian specimen card with gold
// corner ticks, a pressed-fern frond, and the archetype + signature.
export const ShareCard = forwardRef<HTMLDivElement, { voiceprint: Voiceprint }>(
  function ShareCard({ voiceprint }, ref) {
    return (
      <div
        ref={ref}
        className="relative p-[34px] pb-[30px]"
        style={{
          border: "1px solid rgba(236,227,207,.35)",
          background: "linear-gradient(160deg, #1b1e13, #16180f)",
          boxShadow: "0 40px 80px -40px rgba(0,0,0,.8)",
        }}
      >
        {/* gold corner ticks */}
        <span className="absolute h-[14px] w-[14px]" style={{ top: 8, left: 8, borderLeft: "1px solid #c79a3e", borderTop: "1px solid #c79a3e" }} />
        <span className="absolute h-[14px] w-[14px]" style={{ top: 8, right: 8, borderRight: "1px solid #c79a3e", borderTop: "1px solid #c79a3e" }} />
        <span className="absolute h-[14px] w-[14px]" style={{ bottom: 8, left: 8, borderLeft: "1px solid #c79a3e", borderBottom: "1px solid #c79a3e" }} />
        <span className="absolute h-[14px] w-[14px]" style={{ bottom: 8, right: 8, borderRight: "1px solid #c79a3e", borderBottom: "1px solid #c79a3e" }} />

        <div
          className="flex items-center justify-between font-label text-[10px]"
          style={{ letterSpacing: ".24em", color: "#b6a983" }}
        >
          <span>Voiceprint</span>
          <span>Plate VII</span>
        </div>

        <img
          src="/assets/fern-frond.svg"
          alt=""
          className="mx-auto mb-1.5 mt-[18px] block"
          style={{ height: 150, opacity: 0.9, filter: GOLD_TINT }}
        />

        <div
          className="text-center font-label text-[10px]"
          style={{ letterSpacing: ".26em", color: "#d8b566" }}
        >
          Your Voice Archetype
        </div>
        <div className="mt-1.5 text-center font-display text-[42px] font-medium leading-none text-cream">
          {voiceprint.archetype}
        </div>

        <p
          className="mx-auto mt-3.5 max-w-[24ch] text-center font-display text-[18px] italic leading-[1.35]"
          style={{ color: "rgba(236,227,207,.9)" }}
        >
          &ldquo;{voiceprint.signature}&rdquo;
        </p>

        {voiceprint.traits?.length > 0 && (
          <div
            className="mt-3 text-center font-label text-[9px]"
            style={{ letterSpacing: ".2em", color: "rgba(236,227,207,.55)" }}
          >
            {voiceprint.traits.join("  ❧  ")}
          </div>
        )}

        {/* fern divider */}
        <div className="mt-[22px] flex items-center gap-3">
          <span className="h-px flex-1" style={{ background: "rgba(236,227,207,.2)" }} />
          <svg width="20" height="20" viewBox="0 0 18 18" fill="none" aria-hidden="true">
            <path
              d="M.39 16.2C13.58 12.72 11.29.1 6.48 2.07c-4.94 2.03 0 18.26 10.65 9.13"
              stroke="#9DB083"
              strokeWidth="2.4"
            />
          </svg>
          <span className="h-px flex-1" style={{ background: "rgba(236,227,207,.2)" }} />
        </div>
        <div
          className="mt-3 text-center font-body text-[14px] italic"
          style={{ color: "#b6a983" }}
        >
          This is your voice. Lightfern keeps it in every email.
        </div>
      </div>
    );
  },
);
