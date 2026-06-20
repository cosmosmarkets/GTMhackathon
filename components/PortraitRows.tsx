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
    <div className={`divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-soft ${className}`}>
      {ROWS.map(({ key, label, Icon }) => (
        <div
          key={key}
          className="flex gap-4 bg-surface p-5 transition hover:bg-surface-muted"
        >
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-accent/20 bg-accent-soft text-accent-deep">
            <Icon size={17} />
          </div>
          <div>
            <div className="font-mono text-[0.7rem] uppercase tracking-[0.18em] text-accent-deep">
              {label}
            </div>
            <p className="mt-1.5 leading-relaxed text-ink/90">{portrait[key]}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
