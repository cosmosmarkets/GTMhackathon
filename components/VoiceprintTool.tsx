"use client";

import { useRef, useState } from "react";
import type { Voiceprint } from "@/lib/types";
import { Teaser } from "./Teaser";
import { FullReveal } from "./FullReveal";
import type { CaptureValues } from "./CaptureGate";

type Stage = "idle" | "loading" | "teaser" | "revealed";

const SAMPLE = `I don't believe in the ten-step playbook. Most of what passes for strategy is just people copying whoever's loudest that quarter. Here's what actually works: pick one thing, do it embarrassingly well, and ignore everything else until it's done. The rest is noise. I've watched smart founders drown in dashboards while their best customer quietly churned — because nobody was reading the room, they were reading the chart. So I stopped optimising. I started paying attention.`;

const STATUS = [
  "Reading your sentences…",
  "Measuring your rhythm…",
  "Finding your signature moves…",
  "Naming your archetype…",
];

export function VoiceprintTool() {
  const [stage, setStage] = useState<Stage>("idle");
  const [text, setText] = useState("");
  const [voiceprint, setVoiceprint] = useState<Voiceprint | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [gateError, setGateError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const statusTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  const words = (text.match(/[A-Za-z'’]+/g) ?? []).length;

  function cycleStatus() {
    setStatusIdx(0);
    statusTimer.current && clearInterval(statusTimer.current);
    statusTimer.current = setInterval(() => {
      setStatusIdx((i) => (i + 1) % STATUS.length);
    }, 900);
  }
  function stopStatus() {
    statusTimer.current && clearInterval(statusTimer.current);
    statusTimer.current = null;
  }

  async function analyze() {
    setError(null);
    if (words < 20) {
      setError("Paste around 40+ words so we can read your voice properly.");
      return;
    }
    setStage("loading");
    cycleStatus();
    const started = Date.now();
    try {
      const res = await fetch("/api/voiceprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Something went wrong.");
      // small floor so the analysis feels considered, not instant
      const elapsed = Date.now() - started;
      if (elapsed < 1600) await new Promise((r) => setTimeout(r, 1600 - elapsed));
      setVoiceprint(data as Voiceprint);
      setStage("teaser");
      setTimeout(
        () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        60,
      );
    } catch (e: any) {
      setError(e?.message ?? "Something went wrong. Try again.");
      setStage("idle");
    } finally {
      stopStatus();
    }
  }

  async function unlock(values: CaptureValues) {
    setGateError(null);
    setSubmitting(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          writing_sample: text,
          voiceprint_json: voiceprint,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error ?? "Could not submit. Try again.");
      if (typeof data?.rank === "number") setRank(data.rank);
      if (typeof data?.total === "number") setTotal(data.total);
      setStage("revealed");
      setTimeout(
        () => resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
        60,
      );
    } catch (e: any) {
      setGateError(e?.message ?? "Could not submit. Try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setStage("idle");
    setText("");
    setVoiceprint(null);
    setRank(null);
    setTotal(null);
    setError(null);
    setGateError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div>
      {/* Idle — the "Sow" specimen input. A ruled herbarium sheet: divider
          label, a sepia specimen frame with inner corner ticks, an engraved
          CTA, and a pressed fern specimen alongside. */}
      {stage === "idle" && (
        <div className="animate-vp-rise">
          {/* section divider */}
          <div className="mb-2 flex items-center justify-center gap-[18px]">
            <span
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(42,32,22,.4))",
              }}
            />
            <span className="whitespace-nowrap font-label text-[13px] tracking-[0.32em] text-accent-deep">
              &#10087;&nbsp;&nbsp;A Reading of Your Voice&nbsp;&nbsp;&#10087;
            </span>
            <span
              className="h-px flex-1"
              style={{
                background:
                  "linear-gradient(90deg, rgba(42,32,22,.4), transparent)",
              }}
            />
          </div>

          <div className="grid grid-cols-1 items-stretch gap-10 md:grid-cols-[1.62fr_1fr]">
            {/* left — the specimen input */}
            <div className="pt-3.5">
              {/* specimen frame */}
              <div
                className="relative max-w-[700px] border border-line-strong"
                style={{ background: "rgba(252,247,235,.55)" }}
              >
                {/* inner corner ticks */}
                <span className="pointer-events-none absolute left-1.5 top-1.5 h-3 w-3 border-l border-t border-accent" />
                <span className="pointer-events-none absolute right-1.5 top-1.5 h-3 w-3 border-r border-t border-accent" />
                <span className="pointer-events-none absolute bottom-1.5 left-1.5 h-3 w-3 border-b border-l border-accent" />
                <span className="pointer-events-none absolute bottom-1.5 right-1.5 h-3 w-3 border-b border-r border-accent" />

                {/* header row */}
                <div className="flex items-center justify-between border-b border-line px-[18px] py-[11px]">
                  <span className="font-label text-[11px] tracking-[0.26em] text-ink-soft">
                    Specimen &#8212; your own words
                  </span>
                  <span className="font-label text-[11px] tracking-[0.22em] text-clay">
                    No. 001
                  </span>
                </div>

                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste a few emails, a post, a paragraph from your last letter. The more it sounds like you, the truer the reading."
                  rows={8}
                  className="w-full resize-none border-0 bg-transparent p-[22px] font-body text-[18px] leading-[1.62] text-ink outline-none placeholder:text-ink-faint"
                />

                {/* footer meta row */}
                <div className="flex items-center justify-between border-t border-line px-[18px] py-[9px]">
                  <span
                    className="font-body text-[15px] italic"
                    style={{ color: words >= 40 ? "#39492c" : "#a08a66" }}
                  >
                    {words} words gathered
                  </span>
                  <span className="font-body text-[14px] italic text-clay">
                    forty needed
                  </span>
                </div>
              </div>

              {error && (
                <p className="mt-3 font-body text-[15px] italic text-clay">
                  {error}
                </p>
              )}

              {/* buttons row */}
              <div className="mt-6 flex flex-wrap items-center gap-[22px]">
                <button
                  onClick={analyze}
                  className="relative border border-ink bg-ink px-[30px] py-[15px] font-label text-[14px] tracking-[0.2em] text-cream shadow-press transition-transform duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-press-hover"
                  style={{ transitionTimingFunction: "cubic-bezier(.34,1.56,.64,1)" }}
                >
                  &#10087;&nbsp;&nbsp;Take the Reading
                </button>
                <button
                  onClick={() => setText(SAMPLE)}
                  className="font-body text-[18px] italic text-rust underline underline-offset-4 transition hover:[text-underline-offset:6px]"
                >
                  or read a sample hand
                </button>
              </div>
            </div>

            {/* right — pressed fern specimen + plate label */}
            <div className="relative hidden min-h-[540px] md:block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/fern-frond.svg"
                alt="pressed fern specimen"
                className="absolute bottom-[-30px] right-[4%] h-[640px] animate-vp-frond opacity-90"
              />
              <div
                className="absolute bottom-[18px] left-0 w-[215px] border border-line-strong px-4 py-3.5 shadow-plate"
                style={{ background: "rgba(252,247,235,.78)", transform: "rotate(-2.5deg)" }}
              >
                <div className="border-b border-line pb-1.5 font-label text-[10px] tracking-[0.26em] text-clay">
                  Plate I
                </div>
                <div className="mt-2 font-display text-[24px] font-semibold italic leading-none text-ink">
                  Filix
                </div>
                <div className="mt-[3px] font-body text-[14px] text-ink-soft">
                  the common fern
                </div>
                <div className="mt-2.5 font-body text-[13px] italic leading-[1.35] text-ink-faint">
                  Pressed by hand, from your own writing.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading — the "Reading" block. Centered seedling with a soft glow,
          an italic headline, a filling progress rule, and the cycling status. */}
      {stage === "loading" && (
        <div className="flex animate-vp-fade flex-col items-center justify-center py-[30px] text-center">
          <div className="font-label text-[12px] tracking-[0.34em] text-ink-soft">
            The Reading Is Underway
          </div>

          <div className="relative my-7 mb-2 h-[168px] w-[160px]">
            <div
              className="absolute inset-0 animate-vp-glow rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(57,73,44,.16), transparent 68%)",
              }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/assets/seedling.svg"
              alt="seedling"
              className="absolute inset-0 m-auto h-[168px] w-[160px] animate-vp-sway"
              style={{ transformOrigin: "70px 138px" }}
            />
          </div>

          <h2 className="mt-1 max-w-[16ch] font-display text-[clamp(34px,3.6vw,54px)] font-medium italic leading-[1.05] text-ink">
            Pressing your words, line by line
          </h2>

          <div
            className="relative my-8 mb-4 h-px"
            style={{ width: "min(440px, 70vw)", background: "rgba(42,32,22,.25)" }}
          >
            <div
              className="absolute left-0 top-[-1px] h-[3px] bg-accent-deep"
              style={{
                animation: "vp-fill 2.6s cubic-bezier(.5,0,.3,1) forwards",
              }}
            />
          </div>

          <div className="min-h-[1.4em] font-body text-[18px] italic text-ink-soft">
            {STATUS[statusIdx]}
          </div>
        </div>
      )}

      {/* Result region */}
      <div ref={resultRef} className="scroll-mt-8">
        {stage === "teaser" && voiceprint && (
          <Teaser
            voiceprint={voiceprint}
            onUnlock={unlock}
            submitting={submitting}
            error={gateError}
          />
        )}

        {stage === "revealed" && voiceprint && (
          <FullReveal
            voiceprint={voiceprint}
            rank={rank}
            total={total}
            onReset={reset}
          />
        )}
      </div>
    </div>
  );
}
