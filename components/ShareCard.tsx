"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import type { Voiceprint } from "@/lib/voiceprint";
import VoiceSignature from "./VoiceSignature";
import { SplatterGreen, FlowerRed, Leaf } from "./Decor";

/**
 * ShareCard — the viral asset. A 1080×1080 composition that travels alone.
 * Rendered on screen scaled down; exported to PNG at full size via html-to-image.
 */

export default function ShareCard({ result }: { result: Voiceprint }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function download() {
    if (!cardRef.current || downloading) return;
    setDownloading(true);
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1080,
        height: 1080,
        pixelRatio: 1,
        cacheBust: true,
        backgroundColor: "#FAF7F0",
      });
      const link = document.createElement("a");
      link.download = "my-voiceprint.png";
      link.href = dataUrl;
      link.click();
    } catch {
      // swallow — share is a bonus, never blocks the demo
    } finally {
      setDownloading(false);
    }
  }

  async function copyLink() {
    try {
      const url =
        typeof window !== "undefined" ? window.location.origin : "lightfern.com";
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  const tone = result.tone[0];

  return (
    <div>
      {/* Visible, scaled preview. The exported node is the inner 1080px card. */}
      <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-card shadow-card">
        <div
          className="origin-top-left"
          style={{ width: 360, height: 360, transform: "scale(0.3333)", transformOrigin: "top left" }}
        >
          <div
            ref={cardRef}
            style={{ width: 1080, height: 1080 }}
            className="relative flex flex-col justify-between overflow-hidden bg-paper p-20"
          >
            <SplatterGreen className="pointer-events-none absolute -right-20 -top-24 h-[520px] w-[520px] opacity-[0.1]" />
            <FlowerRed className="pointer-events-none absolute bottom-24 right-24 h-28 w-28 opacity-80" />
            <Leaf className="pointer-events-none absolute left-16 top-24 h-28 w-28 opacity-50" />

            <div>
              <p className="text-2xl font-medium uppercase tracking-[0.3em] text-muted">
                Voice archetype
              </p>
              <h2 className="mt-4 font-serif text-8xl font-semibold leading-none text-ink">
                {result.archetype.name}
              </h2>
              <p className="mt-6 font-serif text-4xl italic text-fern">
                {result.archetype.tagline}
              </p>
            </div>

            <div>
              <VoiceSignature
                signature={result.signature}
                height={150}
                animate={false}
              />
            </div>

            <div>
              <p className="font-serif text-5xl leading-tight text-ink">
                &ldquo;{result.signatureLine}&rdquo;
              </p>
              <div className="mt-8 flex items-center justify-between">
                {tone ? (
                  <span className="inline-flex items-center rounded-full border border-fern/30 bg-fern/10 px-6 py-2 text-3xl font-medium text-fern">
                    {tone}
                  </span>
                ) : (
                  <span />
                )}
                <span className="font-serif text-4xl font-semibold text-fern">
                  lightfern.com
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button
          onClick={download}
          disabled={downloading}
          className="min-h-[48px] rounded-full bg-fern px-6 text-base font-semibold text-paper transition hover:bg-fern/90 disabled:opacity-50"
        >
          {downloading ? "Rendering…" : "Download image"}
        </button>
        <button
          onClick={copyLink}
          className="min-h-[48px] rounded-full border border-fern/30 bg-card px-6 text-base font-semibold text-fern transition hover:bg-fern/5"
        >
          {copied ? "Link copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
