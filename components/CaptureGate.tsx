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
  const handleOk = handle.trim().length === 0 || handle.trim().startsWith("https://");
  const valid = emailOk && role.trim().length > 0;

  function handle_submit(e: React.FormEvent) {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    onSubmit({ email: email.trim(), role: role.trim(), handle: handle.trim() });
  }

  const field =
    "w-full rounded-xl border border-line bg-surface-muted px-4 py-3 text-ink placeholder:text-ink-faint outline-none transition focus:border-accent focus:bg-surface focus:ring-2 focus:ring-accent/20";

  return (
    <form onSubmit={handle_submit} className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-accent-deep">
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
          <p className="mt-1 text-xs text-clay">Enter a valid email.</p>
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
        <input
          type="url"
          placeholder="linkedin.com/in/yourname"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          className={field}
          aria-label="LinkedIn URL"
        />
      </div>

      {error && <p className="text-xs text-clay">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 font-medium text-paper shadow-soft transition hover:bg-ink/90 disabled:opacity-60"
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

      <p className="text-center text-xs text-ink-faint">
        No spam. We'll only reach out about early access to Lightfern.
      </p>
    </form>
  );
}
