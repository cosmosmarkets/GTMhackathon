import { SplatterGreen } from "./Decor";

/**
 * ArchetypeHero — the shareable hook. Archetype name (serif, large) over a
 * paint splatter, its tagline, then the quotable signature line.
 */

export default function ArchetypeHero({
  name,
  tagline,
  signatureLine,
}: {
  name: string;
  tagline: string;
  signatureLine: string;
}) {
  return (
    <div className="relative text-center">
      <SplatterGreen className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-56 w-56 -translate-x-1/2 -translate-y-[58%] opacity-[0.08] sm:h-72 sm:w-72" />

      <p className="mb-2 text-sm font-medium uppercase tracking-[0.2em] text-muted">
        Your voice archetype
      </p>
      <h1 className="font-serif text-4xl font-semibold leading-tight text-ink sm:text-6xl">
        {name}
      </h1>
      <p className="mx-auto mt-3 max-w-md font-serif text-lg italic text-fern sm:text-xl">
        {tagline}
      </p>

      <p className="mx-auto mt-6 max-w-xl font-serif text-xl leading-snug text-ink sm:text-2xl">
        &ldquo;{signatureLine}&rdquo;
      </p>
    </div>
  );
}
