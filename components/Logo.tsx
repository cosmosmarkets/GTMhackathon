export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {/* Lightfern mark — the single continuous curling frond stroke */}
      <svg
        width="22"
        height="22"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
        className="shrink-0 text-accent"
      >
        <path
          d="M.39 16.2C13.58 12.72 11.29.1 6.48 2.07c-4.94 2.03 0 18.26 10.65 9.13"
          stroke="currentColor"
          strokeWidth="2.51"
        />
      </svg>
      <span className="font-serif text-[1.4rem] leading-none tracking-[-0.01em] text-ink">
        Lightfern
      </span>
    </span>
  );
}
