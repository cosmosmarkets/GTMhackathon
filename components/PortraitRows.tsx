import type { VoiceprintPortrait } from "@/lib/types";
import { AudioLines, Drama, PenLine, Type, LayoutList } from "lucide-react";

const ROWS: {
  key: keyof VoiceprintPortrait;
  label: string;
  Icon: typeof AudioLines;
}[] = [
  { key: "rhythm", label: "Rhythm", Icon: AudioLines },
  { key: "tone", label: "Tone", Icon: Drama },
  { key: "signatureMoves", label: "Signature moves", Icon: PenLine },
  { key: "lexicalCharacter", label: "Lexical character", Icon: Type },
  { key: "structure", label: "Structure", Icon: LayoutList },
];

export function PortraitRows({
  portrait,
  className = "",
}: {
  portrait: VoiceprintPortrait;
  className?: string;
}) {
  return (
    <div className={`space-y-px overflow-hidden rounded-2xl border border-white/10 bg-ink-800 ${className}`}>
      {ROWS.map(({ key, label, Icon }) => (
        <div
          key={key}
          className="flex gap-4 bg-ink-800 p-5 transition hover:bg-ink-700/60"
        >
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-fern/20 bg-fern/5 text-fern">
            <Icon size={17} />
          </div>
          <div>
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-fern/80">
              {label}
            </div>
            <p className="mt-1.5 leading-relaxed text-bone/90">{portrait[key]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
