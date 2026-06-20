"use client";

import { useState } from "react";
import Link from "next/link";
import { voiceprint, type Voiceprint } from "@/lib/voiceprint";
import PasteCard from "@/components/PasteCard";
import ArchetypeHero from "@/components/ArchetypeHero";
import VoiceSignature from "@/components/VoiceSignature";
import ToneChips from "@/components/ToneChips";
import PortraitBlock from "@/components/PortraitBlock";
import CTACard from "@/components/CTACard";
import CaptureForm from "@/components/CaptureForm";
import ShareCard from "@/components/ShareCard";

export default function Home() {
  const [result, setResult] = useState<Voiceprint | null>(null);
  const [text, setText] = useState("");
  const [showShare, setShowShare] = useState(false);

  function handleRead(input: string) {
    setText(input);
    setResult(voiceprint(input));
    setShowShare(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  function readAnother() {
    setResult(null);
    setText("");
    setShowShare(false);
    if (typeof window !== "undefined") window.scrollTo({ top: 0 });
  }

  if (!result) {
    return (
      <main className="min-h-screen">
        <PasteCard onRead={handleRead} />
        <WallLink />
      </main>
    );
  }

  // Too-short nudge: show the signature line, hide the portrait, don't crash.
  if (result.tooShort) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5">
        <div className="vp-rise mx-auto w-full max-w-md rounded-card border border-black/[0.04] bg-card p-8 text-center shadow-card">
          <p className="font-serif text-2xl leading-snug text-ink">
            {result.signatureLine}
          </p>
          <button
            onClick={readAnother}
            className="mt-6 min-h-[48px] rounded-full bg-fern px-8 text-base font-semibold text-paper transition hover:bg-fern/90"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-5 pb-24 pt-12 sm:pt-16">
      <div className="vp-rise mx-auto w-full max-w-2xl space-y-10">
        <ArchetypeHero
          name={result.archetype.name}
          tagline={result.archetype.tagline}
          signatureLine={result.signatureLine}
        />

        <div className="rounded-card border border-black/[0.04] bg-card p-6 shadow-card">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.18em] text-muted">
            Your voice signature
          </p>
          <VoiceSignature signature={result.signature} />
        </div>

        <div className="flex justify-center">
          <ToneChips tone={result.tone} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <PortraitBlock label="Rhythm" body={result.rhythm} />
          <PortraitBlock label="Signature moves" items={result.moves} />
          <PortraitBlock label="Lexical character" body={result.lexical} />
          <PortraitBlock label="Structure" body={result.structure} />
        </div>

        <CTACard />

        {/* Share + read-another */}
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => setShowShare((s) => !s)}
            className="min-h-[48px] w-full rounded-full bg-fern px-8 text-base font-semibold text-paper transition hover:bg-fern/90 sm:w-auto"
          >
            {showShare ? "Hide share card" : "Share my voiceprint"}
          </button>
          <button
            onClick={readAnother}
            className="min-h-[48px] w-full rounded-full border border-fern/30 bg-card px-8 text-base font-semibold text-fern transition hover:bg-fern/5 sm:w-auto"
          >
            Read another
          </button>
        </div>

        {showShare && (
          <div className="vp-rise">
            <ShareCard result={result} />
          </div>
        )}

        <CaptureForm result={result} text={text} />

        <WallLink />
      </div>
    </main>
  );
}

function WallLink() {
  return (
    <div className="mt-10 text-center">
      <Link
        href="/wall"
        className="text-sm font-medium text-fern underline-offset-4 hover:underline"
      >
        See the room&rsquo;s voiceprints →
      </Link>
    </div>
  );
}
