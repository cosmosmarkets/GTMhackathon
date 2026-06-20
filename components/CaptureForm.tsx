"use client";

import { useState } from "react";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { Voiceprint } from "@/lib/voiceprint";

/**
 * CaptureForm — Screen 3. Framed as a reward, not a gate.
 * Inserts one row into `submissions` matching the schema EXACTLY.
 */

const ROLES = ["Founder", "GTM", "AE", "Product", "Investor", "Writer", "Other"];

type Status = "idle" | "sending" | "sent" | "error";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function CaptureForm({
  result,
  text,
}: {
  result: Voiceprint;
  text: string;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [handle, setHandle] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const emailValid = EMAIL_RE.test(email.trim());

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailValid || status === "sending") return;

    setStatus("sending");
    setError("");

    const supabase = getSupabase();
    if (!supabase) {
      setStatus("error");
      setError(
        "We can't reach our inbox right now. (Supabase isn't configured.)"
      );
      return;
    }

    const row = {
      email: email.trim(),
      role: role || null,
      handle: handle.trim() || null,
      text,
      archetype: result.archetype.name,
      signature_line: result.signatureLine,
      tone: result.tone,
      moves: result.moves,
      signature: result.signature,
      traits: result.traits,
      word_count: result.wordCount,
    };

    const { error: insertError } = await supabase
      .from("submissions")
      .insert(row);

    if (insertError) {
      setStatus("error");
      setError("Something went wrong sending that. Mind trying once more?");
      return;
    }

    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div className="rounded-card border border-fern/20 bg-card p-6 text-center shadow-card">
        <p className="font-serif text-2xl text-fern">
          Sent &mdash; your voiceprint is in.
        </p>
        <p className="mt-2 text-muted">
          We&rsquo;ll be in touch. Welcome to Lightfern.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-card border border-black/[0.04] bg-card p-6 shadow-card"
    >
      <h2 className="font-serif text-2xl text-ink">
        Want your full voiceprint + early access?
      </h2>
      <p className="mt-1 text-muted">
        We&rsquo;ll send it over. No noise, just the good stuff.
      </p>

      {!isSupabaseConfigured && (
        <p className="mt-3 rounded-xl bg-splatter-red/10 px-3 py-2 text-sm text-splatter-red">
          Heads up: Supabase env vars aren&rsquo;t set, so submissions
          won&rsquo;t save yet. The portrait above still works.
        </p>
      )}

      <div className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-ink"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="min-h-[48px] w-full rounded-2xl border border-black/10 bg-paper px-4 text-base text-ink outline-none focus:border-fern focus:ring-2 focus:ring-fern/20"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="role"
              className="mb-1 block text-sm font-medium text-ink"
            >
              Role <span className="text-muted">(optional)</span>
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="min-h-[48px] w-full rounded-2xl border border-black/10 bg-paper px-4 text-base text-ink outline-none focus:border-fern focus:ring-2 focus:ring-fern/20"
            >
              <option value="">Select…</option>
              {ROLES.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="handle"
              className="mb-1 block text-sm font-medium text-ink"
            >
              Handle <span className="text-muted">(optional)</span>
            </label>
            <input
              id="handle"
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@you"
              className="min-h-[48px] w-full rounded-2xl border border-black/10 bg-paper px-4 text-base text-ink outline-none focus:border-fern focus:ring-2 focus:ring-fern/20"
            />
          </div>
        </div>
      </div>

      {status === "error" && (
        <p className="mt-3 text-sm text-splatter-red">{error}</p>
      )}

      <button
        type="submit"
        disabled={!emailValid || status === "sending"}
        className="mt-5 min-h-[48px] w-full rounded-full bg-fern px-8 text-base font-semibold text-paper transition hover:bg-fern/90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {status === "sending" ? "Sending…" : "Send it to me."}
      </button>

      <p className="mt-3 text-center text-sm text-muted">
        Zero spam. Your writing is read in your browser.
      </p>
    </form>
  );
}
