import { Logo } from "@/components/Logo";
import { VoiceprintTool } from "@/components/VoiceprintTool";

/* Four botanical corner ornaments — the 74×74 pressed-fern flourish, mirrored
   per corner. Positioned at the inner frame's edges. Hidden when cramped. */
function CornerOrnament({
  position,
}: {
  position: "tl" | "tr" | "bl" | "br";
}) {
  const place = {
    tl: { top: -3, left: -3 },
    tr: { top: -3, right: -3, transform: "scaleX(-1)" },
    bl: { bottom: -3, left: -3, transform: "scaleY(-1)" },
    br: { bottom: -3, right: -3, transform: "scale(-1,-1)" },
  } as const;
  return (
    <svg
      aria-hidden="true"
      width="74"
      height="74"
      viewBox="0 0 80 80"
      fill="none"
      className="pointer-events-none absolute hidden sm:block"
      style={{ ...place[position] }}
    >
      <path d="M4 78 C4 42 42 4 78 4" stroke="#2a2016" strokeWidth="1.1" />
      <path
        d="M4 60 C12 34 34 12 60 4"
        stroke="#6e3b2e"
        strokeWidth="0.7"
        opacity=".7"
      />
      <path
        d="M34 30 C44 22 44 10 37 5 C31 13 30 22 34 30Z"
        fill="#39492c"
        opacity=".55"
      />
      <circle cx="40" cy="40" r="2.2" fill="#6e3b2e" />
    </svg>
  );
}

export default function Home() {
  return (
    <div
      className="relative min-h-screen"
      style={{ backgroundColor: "#F5EFE1", color: "#2a2016", padding: 22 }}
    >
      {/* Outer frame — 1.5px sepia at .6, 6px pad */}
      <div
        className="animate-vp-rise relative flex min-h-[calc(100vh-44px)] flex-col"
        style={{ border: "1.5px solid rgba(42,32,22,.6)", padding: 6 }}
      >
        {/* Inner frame — 0.75px sepia at .4, generous responsive padding */}
        <div
          className="relative flex min-h-[calc(100vh-56px)] flex-1 flex-col px-5 py-7 sm:px-[52px] sm:pb-[30px] sm:pt-[34px]"
          style={{ border: "0.75px solid rgba(42,32,22,.4)" }}
        >
          <CornerOrnament position="tl" />
          <CornerOrnament position="tr" />
          <CornerOrnament position="bl" />
          <CornerOrnament position="br" />

          {/* Masthead */}
          <header
            className="flex flex-col items-start justify-between gap-3 pb-4 sm:flex-row sm:items-end sm:gap-0"
            style={{ borderBottom: "1px solid rgba(42,32,22,.45)" }}
          >
            <Logo />
            <div className="text-left sm:text-right">
              <div className="font-label text-[11px] uppercase tracking-[0.26em] text-clay">
                Est. MMXXV
              </div>
              <a
                href="https://lightfern.ai"
                target="_blank"
                rel="noreferrer"
                className="font-body text-[16px] italic text-rust underline decoration-[1px] underline-offset-4 transition-[text-underline-offset] hover:underline-offset-[6px]"
              >
                What is Lightfern?
              </a>
            </div>
          </header>

          {/* The tool — handles idle / reading / sprout / reveal stages */}
          <div className="flex flex-1 flex-col">
            <VoiceprintTool />
          </div>

          {/* Colophon */}
          <footer
            className="mt-10 flex flex-col items-center justify-between gap-3 pt-3.5 text-center sm:mt-[26px] sm:flex-row sm:gap-0 sm:text-left"
            style={{ borderTop: "1px solid rgba(42,32,22,.45)" }}
          >
            <span className="font-label text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
              Voiceprint &middot; By Lightfern
            </span>
            <span className="font-body text-[15px] italic text-ink-soft">
              Your voice, for any email.
            </span>
            <span className="flex items-center gap-5">
              <a
                href="/geo"
                className="font-label text-[10.5px] uppercase tracking-[0.22em] text-ink-faint transition-colors hover:text-ink"
              >
                Answers
              </a>
              <span className="font-label text-[10.5px] uppercase tracking-[0.22em] text-ink-faint">
                lightfern.com
              </span>
            </span>
          </footer>
        </div>
      </div>
    </div>
  );
}
