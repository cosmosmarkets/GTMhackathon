/**
 * PortraitBlock — one labelled descriptive block (label + sentence(s)).
 * Used for Rhythm, Signature moves, Lexical character, Structure.
 * Accepts either a string body or a list of moves.
 */

export default function PortraitBlock({
  label,
  body,
  items,
}: {
  label: string;
  body?: string;
  items?: string[];
}) {
  return (
    <div className="rounded-card border border-black/[0.04] bg-card p-5 shadow-card">
      <h3 className="mb-2 font-serif text-base font-semibold text-fern">
        {label}
      </h3>
      {body ? (
        <p className="text-[15px] leading-relaxed text-ink/90">{body}</p>
      ) : null}
      {items && items.length ? (
        <ul className="space-y-2">
          {items.map((it, i) => (
            <li
              key={i}
              className="flex gap-2 text-[15px] leading-relaxed text-ink/90"
            >
              <span aria-hidden className="mt-[2px] text-fern-bright">
                ·
              </span>
              <span>{it}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
