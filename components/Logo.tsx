export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* a small fern frond */}
        <path
          d="M12 22C12 22 12 9 19 4"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
          className="text-fern"
        />
        <path
          d="M12 18.5c2.2.2 4.2-1 5-3M12.6 14.8c2.1.4 4-.6 5-2.6M13.7 11.2c1.9.6 3.7 0 4.9-1.7M15 8c1.6.7 3.1.4 4.3-.8"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          className="text-fern/70"
        />
      </svg>
      <span className="font-sans font-semibold tracking-tight text-bone">
        Lightfern
      </span>
    </span>
  );
}
