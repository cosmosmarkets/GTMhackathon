import { Logo } from "@/components/Logo";
import { VoiceprintTool } from "@/components/VoiceprintTool";

export default function Home() {
  return (
    <main className="relative mx-auto flex min-h-screen max-w-3xl flex-col px-5 py-7 sm:px-8">
      {/* Nav */}
      <header className="flex items-center justify-between">
        <Logo />
        <a
          href="https://lightfern.ai"
          target="_blank"
          rel="noreferrer"
          className="text-sm text-ink-muted transition hover:text-ink"
        >
          What is Lightfern?
        </a>
      </header>

      {/* Hero */}
      <section className="mt-14 animate-fade-up sm:mt-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-accent-deep shadow-soft">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent" />
          </span>
          Voiceprint · a Lightfern tool
        </div>

        <h1 className="mt-5 text-5xl font-semibold leading-[1.05] tracking-[-0.02em] text-ink text-balance sm:text-6xl">
          What does your{" "}
          <span className="font-serif font-normal italic text-accent-deep">
            writing voice
          </span>{" "}
          actually sound like?
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-muted text-balance">
          Paste anything you've written and we'll map it back to you — your
          rhythm, your signature moves, the archetype only you write in. No
          scores. Just your voice, seen clearly.
        </p>
      </section>

      {/* The tool */}
      <section className="mt-9">
        <VoiceprintTool />
      </section>

      <div className="flex-1" />

      {/* Footer */}
      <footer className="mt-20 border-t border-line pt-6 text-sm text-ink-faint">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <Logo className="opacity-80" />
          <div className="flex items-center gap-4">
            <a href="/geo" className="transition hover:text-ink">
              Answers
            </a>
            <span>Your voice, for any email. · lightfern.com</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
