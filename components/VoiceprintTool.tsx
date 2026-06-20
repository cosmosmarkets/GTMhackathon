"use client";

import { useRef, useState } from "react";
import type { Voiceprint } from "@/lib/types";
import { Teaser } from "./Teaser";
import { FullReveal } from "./FullReveal";
import type { CaptureValues } from "./CaptureGate";
import { ArrowRight, Loader2, Wand2 } from "lucide-react";

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
      {/* Input */}
      {stage === "idle" && (
        <div className="animate-fade-up">
          <div className="relative">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste anything you've written — a few emails, a post, a paragraph from your last newsletter. The more it sounds like you, the truer the read."
              rows={7}
              className="w-full resize-none rounded-2xl border border-white/10 bg-ink-800/80 p-5 text-bone leading-relaxed placeholder:text-bone-faint outline-none transition focus:border-fern/50 focus:ring-2 focus:ring-fern/15"
            />
            <div className="pointer-events-none absolute bottom-3 right-4 font-mono text-xs text-bone-faint">
              {words} words
            </div>
          </div>

          {error && <p className="mt-2 text-sm text-amber-300/90">{error}</p>}

          <div className="mt-4 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <button
              onClick={analyze}
              className="group inline-flex items-center justify-center gap-2 rounded-xl bg-fern px-6 py-3.5 font-semibold text-ink transition hover:bg-fern-bright"
            >
              Get my voiceprint
              <ArrowRight size={18} className="transition group-hover:translate-x-0.5" />
            </button>
            <button
              onClick={() => setText(SAMPLE)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/12 px-5 py-3.5 font-medium text-bone-muted transition hover:border-white/30 hover:text-bone"
            >
              <Wand2 size={16} />
              Try a sample
            </button>
          </div>
        </div>
      )}

      {/* Loading */}
      {stage === "loading" && (
        <div className="animate-fade-up rounded-2xl border border-white/10 bg-ink-800/80 p-8">
          <div className="flex items-center gap-3 text-bone">
            <Loader2 size={20} className="animate-spin text-fern" />
            <span className="font-serif text-2xl">{STATUS[statusIdx]}</span>
          </div>
          <div className="mt-6 space-y-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="shimmer-bg h-3 rounded animate-shimmer"
                style={{ width: `${[92, 78, 85][i]}%` }}
              />
            ))}
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
