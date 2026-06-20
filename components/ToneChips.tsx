/**
 * ToneChips — labelled, categorical tone descriptors. These are NOT ratings.
 * Color rotates for texture only; meaning lives in the label, never the color.
 */

const CHIP_STYLES = [
  "bg-fern/10 text-fern border-fern/20",
  "bg-splatter-blue/10 text-splatter-blue border-splatter-blue/20",
  "bg-splatter-red/10 text-splatter-red border-splatter-red/25",
];

export default function ToneChips({
  tone,
  className = "",
}: {
  tone: string[];
  className?: string;
}) {
  if (!tone.length) return null;
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tone.map((t, i) => (
        <span
          key={t}
          className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${
            CHIP_STYLES[i % CHIP_STYLES.length]
          }`}
        >
          {t}
        </span>
      ))}
    </div>
  );
}
