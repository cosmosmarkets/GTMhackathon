"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

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

  const fieldLabel =
    "font-label text-[10px] tracking-[0.24em] text-ink-soft";
  const field =
    "w-full border-0 bg-transparent px-0.5 py-[7px] font-body text-[17px] text-ink outline-none placeholder:text-ink-faint";

  return (
    <form
      onSubmit={handle_submit}
      className="relative"
      style={{
        border: "1px solid rgba(42,32,22,.5)",
        background: "rgba(252,247,235,.6)",
        padding: "30px 30px 32px",
      }}
    >
      {/* corner ticks */}
      <span
        className="absolute h-[13px] w-[13px]"
        style={{ top: 7, left: 7, borderLeft: "1px solid #6e3b2e", borderTop: "1px solid #6e3b2e" }}
      />
      <span
        className="absolute h-[13px] w-[13px]"
        style={{ top: 7, right: 7, borderRight: "1px solid #6e3b2e", borderTop: "1px solid #6e3b2e" }}
      />
      <span
        className="absolute h-[13px] w-[13px]"
        style={{ bottom: 7, left: 7, borderLeft: "1px solid #6e3b2e", borderBottom: "1px solid #6e3b2e" }}
      />
      <span
        className="absolute h-[13px] w-[13px]"
        style={{ bottom: 7, right: 7, borderRight: "1px solid #6e3b2e", borderBottom: "1px solid #6e3b2e" }}
      />

      <div className="text-center">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="mx-auto">
          <rect x="5" y="11" width="14" height="9" stroke="#6e3b2e" strokeWidth="1.4" />
          <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#6e3b2e" strokeWidth="1.4" />
        </svg>
        <div className="mt-3 font-display text-[28px] font-semibold leading-[1.1] text-ink">
          Sign the register
          <br />
          to read the rest
        </div>
        <div className="mt-2 font-body text-[15px] italic text-ink-soft">
          Your full portrait, archetype and standing.
        </div>
      </div>

      <div className="mt-[26px] flex flex-col gap-5">
        <label className="block">
          <span className={fieldLabel}>Your correspondence</span>
          <input
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={field}
            style={{ borderBottom: "1px solid rgba(42,32,22,.5)" }}
            aria-label="Email"
          />
          {touched && !emailOk && (
            <p className="mt-1 font-body text-[13px] italic text-clay">Enter a valid email.</p>
          )}
        </label>

        <label className="block">
          <span className={fieldLabel}>Your vocation</span>
          <input
            type="text"
            placeholder="Founder, writer, marketer&#8230;"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={field}
            style={{ borderBottom: "1px solid rgba(42,32,22,.5)" }}
            aria-label="Role"
          />
        </label>

        <label className="block">
          <span className={fieldLabel}>Where we may find you</span>
          <input
            type="url"
            placeholder="linkedin.com/in/yourname"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            className={field}
            style={{ borderBottom: "1px solid rgba(42,32,22,.5)" }}
            aria-label="LinkedIn URL"
          />
        </label>
      </div>

      {error && <p className="mt-3 font-body text-[13px] italic text-clay">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="group mt-[26px] flex w-full items-center justify-center gap-2 font-label text-[13px] tracking-[0.2em] text-cream disabled:opacity-70"
        style={{
          border: "1px solid #2a2016",
          background: "#2a2016",
          padding: "15px",
          cursor: submitting ? "default" : "pointer",
          boxShadow:
            "inset 0 0 0 1px rgba(239,227,204,.22), 4px 4px 0 0 rgba(42,32,22,.3)",
          transition:
            "transform .2s cubic-bezier(.34,1.56,.64,1), box-shadow .2s",
        }}
        onMouseEnter={(e) => {
          if (submitting) return;
          e.currentTarget.style.transform = "translate(-2px,-2px)";
          e.currentTarget.style.boxShadow =
            "inset 0 0 0 1px rgba(239,227,204,.3), 6px 6px 0 0 rgba(42,32,22,.34)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "";
          e.currentTarget.style.boxShadow =
            "inset 0 0 0 1px rgba(239,227,204,.22), 4px 4px 0 0 rgba(42,32,22,.3)";
        }}
      >
        {submitting ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Unsealing&#8230;
          </>
        ) : (
          <>&#10087;&nbsp;&nbsp;Unseal the Full Reading</>
        )}
      </button>

      <p className="mt-[14px] text-center font-body text-[13px] italic text-clay">
        No noise. Only a note when Lightfern opens.
      </p>
    </form>
  );
}
