import type { VoiceprintPortrait } from "@/lib/types";

const ROWS: {
  key: keyof VoiceprintPortrait;
  label: string;
  numeral: string;
}[] = [
  { key: "rhythm", label: "Rhythm", numeral: "I." },
  { key: "tone", label: "Tone", numeral: "II." },
  { key: "signatureMoves", label: "Signature moves", numeral: "III." },
  { key: "lexicalCharacter", label: "Lexical character", numeral: "IV." },
  { key: "structure", label: "Structure", numeral: "V." },
];

// The dark Roman-numeral portrait ledger used inside the Bloom reveal.
export function PortraitRows({
  portrait,
  className = "",
}: {
  portrait: VoiceprintPortrait;
  className?: string;
}) {
  return (
    <div className={className}>
      {ROWS.map(({ key, label, numeral }, i) => (
        <div
          key={key}
          className="grid grid-cols-[38px_1fr] gap-4 py-4"
          style={{
            borderTop: "1px solid rgba(236,227,207,.2)",
            ...(i === ROWS.length - 1
              ? { borderBottom: "1px solid rgba(236,227,207,.2)" }
              : {}),
          }}
        >
          <div
            className="font-display text-[26px] italic leading-none"
            style={{ color: "#D8B566" }}
          >
            {numeral}
          </div>
          <div>
            <div
              className="font-label text-[11px]"
              style={{ letterSpacing: ".22em", color: "#7D9359" }}
            >
              {label}
            </div>
            <p
              className="mt-1.5 font-body text-[16px] leading-[1.55]"
              style={{ color: "rgba(236,227,207,.92)" }}
            >
              {portrait[key]}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
