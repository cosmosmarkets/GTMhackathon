import { Logo } from "@/components/Logo";
import { VoiceprintTool } from "@/components/VoiceprintTool";

/* Editorial scaffolding — a numbered section marker, mono-set like a printed
   analysis sheet. The rule extends to fill the row. */
function SectionMark({ n, label }: { n: string; label: string }) {
  return (
    <div className="flex items-center gap-4">
      <span className="font-mono text-sm tabular-nums text-accent-deep">{n}</span>
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.28em] text-ink-faint">
        {label}
      </span>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen">
      {/* The spine — a bound-document edge. Hairline rule + rotated mono label.
          Collapses on small screens (the top label carries it there). */}
      <div className="pointer-events-none fixed inset-y-0 left-0 z-10 hidden w-16 lg:block">
        <span className="absolute left-8 top-0 h-full w-px bg-line" />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap font-mono text-[0.62rem] uppercase tracking-[0.4em] text-ink-faint">
          Voiceprint — A Lightfern Tool
        </span>
      </div>

      <main className="mx-auto flex min-h-screen max-w-4xl flex-col px-5 py-7 sm:px-8 lg:pl-16">
        {/* Masthead */}
        <header className="flex items-center justify-between border-b border-line pb-5">
          <Logo />
          <a
            href="https://lightfern.ai"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-ink-muted transition hover:text-ink"
          >
            What is Lightfern?
          </a>
        </header>

        {/* Hero — type carries the page. Left-aligned, oversized, intentional
            line breaks. Roman serif with one italic move. */}
        <section className="mt-12 animate-fade-up sm:mt-16">
          <div className="mb-6 inline-flex items-center gap-2 font-mono text-[0.7rem] uppercase tracking-[0.28em] text-accent-deep">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
            </span>
            A reading of your voice
          </div>

          <h1 className="font-serif text-[clamp(2.9rem,8.5vw,6rem)] font-normal leading-[0.94] tracking-[-0.02em] text-ink">
            What does your{" "}
            <em className="italic text-accent-deep">writing voice</em>
            <br className="hidden sm:block" /> actually sound like?
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-relaxed text-ink-muted">
            Paste anything you&apos;ve written and we&apos;ll map it back to you —
            your rhythm, your signature moves, the archetype only you write in.
            No scores. Just your voice, seen clearly.
          </p>
        </section>

        {/* 01 — The tool */}
        <section className="mt-14">
          <SectionMark n="01" label="The read" />
          <div className="mt-7">
            <VoiceprintTool />
          </div>
        </section>

        <div className="flex-1" />

        {/* Colophon */}
        <footer className="mt-24 border-t border-line pt-6 font-mono text-[0.7rem] uppercase tracking-[0.18em] text-ink-faint">
          <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
            <Logo className="opacity-80" />
            <div className="flex items-center gap-5 normal-case tracking-normal">
              <a href="/geo" className="transition hover:text-ink">
                Answers
              </a>
              <span className="font-sans text-sm">
                Your voice, for any email. · lightfern.com
              </span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
