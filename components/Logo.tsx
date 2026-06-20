export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-3.5 ${className}`}>
      {/* Lightfern mark — the single continuous curling frond stroke */}
      <svg
        width="30"
        height="30"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        <path
          d="M.39 16.2C13.58 12.72 11.29.1 6.48 2.07c-4.94 2.03 0 18.26 10.65 9.13"
          stroke="#39492c"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
      <span className="flex flex-col">
        <span className="font-display text-[30px] font-semibold leading-[0.9] tracking-[0.01em] text-ink">
          Voiceprint
        </span>
        <span className="mt-1 font-label text-[11px] uppercase tracking-[0.28em] text-ink-soft">
          A Lightfern Reading Room
        </span>
      </span>
    </span>
  );
}
