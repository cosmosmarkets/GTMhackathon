"use client";

import { useState } from "react";
import { FlowerGreen, FlowerRed, Leaf, SplatterBlue } from "./Decor";

/**
 * PasteCard — Screen 1. Textarea + "Read my voice" button.
 * Botanical accents top-right, splatter bottom-left. No nav.
 */

export default function PasteCard({
  onRead,
}: {
  onRead: (text: string) => void;
}) {
  const [text, setText] = useState("");
  const canRead = text.trim().length > 0;

  return (
    <section className="relative mx-auto w-full max-w-2xl px-5 py-12 sm:py-20">
      <FlowerGreen className="pointer-events-none absolute -right-2 top-2 h-16 w-16 opacity-80 sm:right-0 sm:h-20 sm:w-20" />
      <Leaf className="pointer-events-none absolute right-10 top-16 h-12 w-12 opacity-50 sm:right-16" />
      <SplatterBlue className="pointer-events-none absolute -left-8 bottom-0 -z-10 h-40 w-40 opacity-[0.07]" />
      <FlowerRed className="pointer-events-none absolute -left-1 bottom-6 h-12 w-12 opacity-70" />

      <div className="text-center">
        <h1 className="font-serif text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          What does your voice sound like?
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg text-muted">
          Paste anything you&rsquo;ve written. We&rsquo;ll read it back to you.
        </p>
      </div>

      <div className="mt-8 rounded-card border border-black/[0.04] bg-card p-3 shadow-card sm:p-4">
        <label htmlFor="paste" className="sr-only">
          Paste your writing
        </label>
        <textarea
          id="paste"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Paste an email, a post, a paragraph…"
          rows={9}
          className="w-full resize-y rounded-2xl bg-transparent p-3 text-base leading-relaxed text-ink outline-none placeholder:text-muted/70 focus:ring-0"
        />
      </div>

      <div className="mt-5 flex flex-col items-center gap-3">
        <button
          onClick={() => canRead && onRead(text)}
          disabled={!canRead}
          className="min-h-[48px] w-full rounded-full bg-fern px-8 text-base font-semibold text-paper shadow-card transition hover:bg-fern/90 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
        >
          Read my voice
        </button>
        <p className="text-sm text-muted">
          Read in your browser. Nothing leaves your device until you ask.
        </p>
      </div>
    </section>
  );
}
