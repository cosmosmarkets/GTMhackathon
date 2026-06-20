/**
 * Decorative brand motifs — inline SVG stand-ins for Lightfern's botanical +
 * splatter texture. Inline (not hotlinked) so the demo never depends on the
 * network. Purely decorative: aria-hidden, no meaning encoded in color.
 */

export function SplatterGreen({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="#1F6F4E">
        <path d="M100 18c14 6 18 24 30 30s28-2 34 12-10 24-8 38 16 22 10 36-26 8-36 18-10 30-26 32-22-14-36-18-30 4-40-8 6-26 2-40-18-20-12-36 24-10 34-22 4-26 18-30 16 6 30 6z" />
        <circle cx="40" cy="56" r="9" />
        <circle cx="166" cy="58" r="6" />
        <circle cx="158" cy="150" r="10" />
        <circle cx="36" cy="142" r="7" />
        <circle cx="100" cy="180" r="5" />
        <circle cx="22" cy="100" r="4" />
        <circle cx="182" cy="104" r="5" />
      </g>
    </svg>
  );
}

export function SplatterBlue({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g fill="#3B6FD4">
        <path d="M96 30c18-4 30 14 44 16s24-6 30 8-8 26 0 38 18 18 8 32-26 4-36 16-6 28-24 28-20-16-36-18-26 8-38-4 0-26-6-38-22-14-16-30 24-6 32-20 4-24 22-26 28 14 26 14z" />
        <circle cx="46" cy="60" r="6" />
        <circle cx="160" cy="150" r="7" />
        <circle cx="170" cy="64" r="4" />
      </g>
    </svg>
  );
}

export function FlowerGreen({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M60 16C68 28 84 28 92 22c6 10-2 24-12 28 12 4 18 18 12 28-10 2-22-6-28-16-2 14-14 24-26 22-4-10 4-22 16-28-12-6-18-18-12-28 10-2 22 6 26 16 2-12 12-22 12-22z"
          fill="#1F6F4E"
          opacity="0.9"
        />
        <circle cx="60" cy="58" r="9" fill="#3DBA7A" />
      </g>
    </svg>
  );
}

export function FlowerRed({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 120"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M60 18C66 30 82 32 90 26c5 11-4 24-14 27 11 5 16 19 9 28-10 1-21-8-26-18-3 13-15 22-27 19-3-11 6-22 18-26-11-7-16-19-9-28 10-1 21 8 25 18 3-12 14-21 14-21z"
          fill="#E5533C"
          opacity="0.88"
        />
        <circle cx="59" cy="58" r="8" fill="#FAF7F0" />
      </g>
    </svg>
  );
}

export function Leaf({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 80 120"
      aria-hidden="true"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M40 6c22 18 30 48 18 78-6 16-18 26-18 30-0-4-12-14-18-30C10 54 18 24 40 6z"
        fill="#1F6F4E"
        opacity="0.85"
      />
      <path d="M40 18v82" stroke="#FAF7F0" strokeWidth="2" opacity="0.5" />
    </svg>
  );
}
