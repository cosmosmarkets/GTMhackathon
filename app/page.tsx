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
          className="text-sm text-bone-muted transition hover:text-bone"
        >
          What is Lightfern?
        </a>
      </header>

      {/* Hero */}
      <section className="mt-14 animate-fade-up sm:mt-20">
        <div className="inline-flex items-center gap-2 rounded-full border border-fern/25 bg-fern/5 px-3 py-1 text-xs font-medium text-fern-bright">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-fern opacity-75" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-fern" />
          </span>
          Voiceprint · a Lightfern tool
        </div>

        <h1 className="mt-5 font-serif text-5xl leading-[1.04] text-bone text-balance sm:text-6xl">
          What does your{" "}
          <span className="italic text-fern-bright">writing voice</span> actually
          sound like?
        </h1>

        <p className="mt-5 max-w-xl text-lg leading-relaxed text-bone-muted text-balance">
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
      <footer className="mt-20 border-t border-white/10 pt-6 text-sm text-bone-faint">
        <div className="flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center">
          <Logo className="opacity-80" />
          <div className="flex items-center gap-4">
            <a href="/geo" className="transition hover:text-bone">
              Answers
            </a>
            <span>Your voice, in every email. · lightfern.ai</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
