"use client";

import { useRef, useState } from "react";
import type { Voiceprint } from "@/lib/types";
import { ShareCard } from "./ShareCard";
import { PortraitRows } from "./PortraitRows";

const CORNER_TRANSFORMS = [
  { top: -3, left: -3, transform: "none" },
  { top: -3, right: -3, transform: "scaleX(-1)" },
  { bottom: -3, left: -3, transform: "scaleY(-1)" },
  { bottom: -3, right: -3, transform: "scale(-1,-1)" },
] as const;

function CornerOrnament(props: React.CSSProperties) {
  return (
    <svg
      style={{ position: "absolute", ...props }}
      width="74"
      height="74"
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
    >
      <path d="M4 78 C4 42 42 4 78 4" stroke="#ece3cf" strokeWidth="1.1" />
      <path d="M4 60 C12 34 34 12 60 4" stroke="#c79a3e" strokeWidth="0.7" opacity=".8" />
      <path d="M34 30 C44 22 44 10 37 5 C31 13 30 22 34 30Z" fill="#7d9359" opacity=".7" />
      <circle cx="40" cy="40" r="2.2" fill="#c79a3e" />
    </svg>
  );
}

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

  const showRank = typeof rank === "number" && rank > 0;

  return (
    <div
      className="relative overflow-hidden font-body"
      style={{ background: "#14160e", color: "#ece3cf", padding: 22 }}
    >
      {/* soft animated radial glow layer */}
      <div
        className="animate-vp-glow pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(46rem 28rem at 108% -10%, rgba(199,154,62,.16), transparent 58%), radial-gradient(40rem 30rem at -8% 116%, rgba(57,73,44,.5), transparent 60%)",
        }}
      />

      {/* double-border frame */}
      <div
        className="relative"
        style={{ border: "1.5px solid rgba(236,227,207,.4)", padding: 6 }}
      >
        <div
          className="relative"
          style={{
            border: "0.75px solid rgba(236,227,207,.26)",
            padding: "34px clamp(20px,4vw,52px) 30px",
          }}
        >
          {CORNER_TRANSFORMS.map((c, i) => (
            <CornerOrnament key={i} {...c} />
          ))}

          {/* the developed plate */}
          <div className="animate-vp-bloom grid items-start gap-10 py-2 lg:grid-cols-[1.15fr_1fr] lg:gap-[50px]">
            {/* ===== LEFT: the verdict ===== */}
            <div>
              <div
                className="font-label text-[12px]"
                style={{ letterSpacing: ".32em", color: "#d8b566" }}
              >
                Your Voice Archetype
              </div>
              <h2
                className="mt-3 font-display font-medium"
                style={{
                  fontSize: "clamp(56px,6.4vw,104px)",
                  lineHeight: 0.92,
                  letterSpacing: "-.01em",
                }}
              >
                {renderArchetype(voiceprint.archetype)}
              </h2>

              <p
                className="mt-5 max-w-[24ch] font-display italic"
                style={{
                  fontSize: "clamp(20px,2vw,28px)",
                  lineHeight: 1.35,
                  color: "rgba(236,227,207,.9)",
                }}
              >
                &ldquo;{voiceprint.signature}&rdquo;
              </p>

              {voiceprint.traits?.length > 0 && (
                <div className="mt-[26px] flex items-center gap-3.5">
                  <span
                    className="h-px w-7 flex-none"
                    style={{ background: "rgba(236,227,207,.5)" }}
                  />
                  <span
                    className="font-label text-[11px]"
                    style={{
                      letterSpacing: ".22em",
                      color: "rgba(236,227,207,.85)",
                    }}
                  >
                    {voiceprint.traits.join(" ❧ ")}
                  </span>
                </div>
              )}

              {/* rank ribbon */}
              {showRank && (
                <div
                  className="mt-7 inline-flex items-center gap-3"
                  style={{
                    background: "rgba(199,154,62,.12)",
                    borderTop: "1px solid rgba(199,154,62,.45)",
                    borderBottom: "1px solid rgba(199,154,62,.45)",
                    padding: "11px 26px",
                    clipPath:
                      "polygon(14px 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 14px 100%, 0 50%)",
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M8 21h8M12 17v4M5 4h14v4a7 7 0 0 1-14 0V4Z"
                      stroke="#d8b566"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span
                    className="font-label text-[12px]"
                    style={{ letterSpacing: ".2em", color: "#ece3cf" }}
                  >
                    No. {rank}
                    {typeof total === "number" && total > 0 ? ` of ${total}` : ""} in the
                    register
                  </span>
                </div>
              )}

              {/* the portrait ledger */}
              <PortraitRows portrait={voiceprint.portrait} className="mt-[34px]" />
            </div>

            {/* ===== RIGHT: share plate + actions + CTA ===== */}
            <div>
              <ShareCard voiceprint={voiceprint} ref={cardRef} />

              <div className="mt-[18px] flex gap-3.5">
                <button
                  onClick={share}
                  className="flex-1 font-label text-[12px] transition-transform duration-200 hover:-translate-y-0.5"
                  style={{
                    border: "1px solid #ece3cf",
                    background: "#ece3cf",
                    color: "#14160e",
                    letterSpacing: ".18em",
                    padding: 13,
                    transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)",
                  }}
                >
                  {copied ? "✓  Copied" : "Share This Plate"}
                </button>
                <button
                  onClick={onReset}
                  className="flex-none font-label text-[12px] transition-colors duration-200"
                  style={{
                    border: "1px solid rgba(236,227,207,.4)",
                    background: "transparent",
                    color: "#ece3cf",
                    letterSpacing: ".18em",
                    padding: "13px 20px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = "#ece3cf")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = "rgba(236,227,207,.4)")
                  }
                >
                  Begin Again
                </button>
              </div>

              <p
                className="mt-3 text-center font-body text-[13px] italic"
                style={{ color: "rgba(236,227,207,.55)" }}
              >
                Screenshot the plate above to post it.
              </p>

              {/* ===== PROMINENT Lightfern CTA — the climax ===== */}
              <div
                className="relative mt-6 overflow-hidden text-center"
                style={{
                  border: "1px solid rgba(199,154,62,.55)",
                  background: "rgba(199,154,62,.08)",
                  padding: "clamp(32px,4vw,40px)",
                  boxShadow: "0 30px 70px -40px rgba(199,154,62,.4)",
                }}
              >
                <div
                  className="animate-vp-glow pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "radial-gradient(34rem 18rem at 50% -20%, rgba(199,154,62,.28), transparent 62%)",
                  }}
                />
                <div className="relative">
                  <p
                    className="mx-auto max-w-[20ch] font-display"
                    style={{ fontSize: "clamp(26px,3vw,32px)", lineHeight: 1.2 }}
                  >
                    Keep this voice in every email you send.
                  </p>
                  <p
                    className="mx-auto mt-3 max-w-[40ch] font-body text-[14px] leading-[1.55]"
                    style={{ color: "rgba(236,227,207,.75)" }}
                  >
                    Lightfern writes your outreach in the voice you just
                    unsealed — every email, still unmistakably yours.
                  </p>
                  <a
                    href="https://lightfern.ai"
                    target="_blank"
                    rel="noreferrer"
                    className="group mt-6 inline-flex items-center gap-2.5 font-label transition-transform duration-200 hover:-translate-y-0.5"
                    style={{
                      border: "1px solid #c79a3e",
                      background: "#c79a3e",
                      color: "#14160e",
                      fontSize: "13px",
                      letterSpacing: ".18em",
                      padding: "16px 32px",
                      transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)",
                      boxShadow: "0 10px 30px -12px rgba(199,154,62,.7)",
                    }}
                  >
                    <span aria-hidden="true">❧</span>
                    Keep My Voice with Lightfern
                    <span
                      className="transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Render the archetype, italicizing/gilding the final word if there's more than
// one — driven entirely by the real value (e.g. "The Provocateur").
function renderArchetype(archetype: string) {
  const parts = (archetype || "").trim().split(/\s+/);
  if (parts.length < 2) return archetype;
  const last = parts.pop() as string;
  return (
    <>
      {parts.join(" ")}
      <br />
      <span style={{ fontStyle: "italic", color: "#ddc789" }}>{last}</span>
    </>
  );
}
