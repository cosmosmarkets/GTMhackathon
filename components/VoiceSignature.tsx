/**
 * VoiceSignature — the ownable "voice signature" waveform.
 * Each value in `signature[]` is one sentence's word count. We render them as
 * vertical bars (height ∝ value). A bursty rhythm or an even one are BOTH
 * valid — this is a portrait, not a meter. No numbers shown, ever.
 */

export default function VoiceSignature({
  signature,
  height = 84,
  color = "#1F6F4E",
  className = "",
  animate = true,
}: {
  signature: number[];
  height?: number;
  color?: string;
  className?: string;
  animate?: boolean;
}) {
  const bars = signature.filter((n) => n > 0);
  if (!bars.length) return null;

  // Cap the number of bars so very long pastes still read as a clean waveform.
  const MAX_BARS = 64;
  const shown =
    bars.length <= MAX_BARS
      ? bars
      : sampleEvenly(bars, MAX_BARS);

  const max = Math.max(...shown);

  return (
    <div
      className={`flex items-end gap-[3px] ${className}`}
      style={{ height }}
      role="img"
      aria-label="Your voice signature — a waveform of sentence rhythm."
    >
      {shown.map((v, i) => {
        const pct = Math.max(0.08, v / max);
        return (
          <div
            key={i}
            className={animate ? "vp-bar flex-1 rounded-full" : "flex-1 rounded-full"}
            style={{
              height: `${pct * 100}%`,
              minWidth: 3,
              background: color,
              opacity: 0.55 + 0.45 * pct,
              animationDelay: animate ? `${Math.min(i * 0.012, 0.5)}s` : undefined,
            }}
          />
        );
      })}
    </div>
  );
}

function sampleEvenly(arr: number[], n: number): number[] {
  const out: number[] = [];
  const step = arr.length / n;
  for (let i = 0; i < n; i++) {
    // average the bucket so the shape is preserved
    const start = Math.floor(i * step);
    const end = Math.max(start + 1, Math.floor((i + 1) * step));
    let sum = 0;
    for (let j = start; j < end; j++) sum += arr[j];
    out.push(sum / (end - start));
  }
  return out;
}
