"use client";

import { useState } from "react";
import { Lock, Loader2 } from "lucide-react";

export interface CaptureValues {
  email: string;
  role: string;
  handle: string;
}

export function CaptureGate({
  onSubmit,
  submitting,
  error,
}: {
  onSubmit: (v: CaptureValues) => void;
  submitting: boolean;
  error?: string | null;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [handle, setHandle] = useState("");
  const [touched, setTouched] = useState(false);

  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim());
  const valid = emailOk && role.trim().length > 0 && handle.trim().length > 0;

  function handle_submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    onSubmit({ email: email.trim(), role: role.trim(), handle: handle.trim() });
  }

  const field =
    "w-full rounded-xl border border-white/10 bg-ink-700/70 px-4 py-3 text-bone placeholder:text-bone-faint outline-none transition focus:border-fern/60 focus:ring-2 focus:ring-fern/20";

  return (
    <form onSubmit={handle_submit} className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-fern-bright">
        <Lock size={15} />
        <span className="font-medium">Unlock your full portrait, archetype & rank</span>
      </div>

      <div>
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={field}
          aria-label="Email"
        />
        {touched && !emailOk && (
          <p className="mt-1 text-xs text-amber-300/90">Enter a valid email.</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          type="text"
          placeholder="What you do (e.g. Founder, Writer)"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className={field}
          aria-label="Role"
        />
        <div className="relative">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-bone-faint">
            @
          </span>
          <input
            type="text"
            placeholder="yourhandle"
            value={handle.replace(/^@+/, "")}
            onChange={(e) => setHandle(e.target.value)}
            className={`${field} pl-8`}
            aria-label="Social handle"
          />
        </div>
      </div>

      {error && <p className="text-xs text-amber-300/90">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-fern px-5 py-3.5 font-semibold text-ink transition hover:bg-fern-bright disabled:opacity-60"
      >
        {submitting ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Unlocking…
          </>
        ) : (
          "Reveal my full voiceprint"
        )}
      </button>

      <p className="text-center text-xs text-bone-faint">
        No spam. We'll only reach out about early access to Lightfern.
      </p>
    </form>
  );
}
