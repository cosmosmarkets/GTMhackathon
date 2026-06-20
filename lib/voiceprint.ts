import type { Voiceprint, VoiceprintPortrait } from "./types";

// ---------------------------------------------------------------------------
// Feature extraction — a real linguistic fingerprint of the pasted writing.
// This is what makes every voiceprint feel personal: the copy below is
// assembled from these measured features, not a canned response.
// ---------------------------------------------------------------------------

const STOPWORDS = new Set(
  ("a an and the of to in on at for with from by as is are was were be been being " +
    "this that these those it its i you he she we they me my your our their them him her " +
    "but or so if then than too very just about into over under out up down not no yes do " +
    "does did done have has had will would can could should may might must im ive id youre " +
    "thats theres what which who whom whose when where why how all any some more most")
    .split(" "),
);

interface Features {
  words: number;
  sentences: number;
  avgSentenceLen: number;
  sentenceVariance: number; // std dev of sentence length
  shortRatio: number; // share of sentences <= 7 words
  longRatio: number; // share of sentences >= 24 words
  avgWordLen: number;
  longWordRatio: number; // words >= 8 chars
  lexicalDiversity: number; // unique / total
  emDash: number;
  semicolon: number;
  colon: number;
  paren: number;
  ellipsis: number;
  exclaim: number;
  question: number;
  comma: number;
  contractions: number;
  firstPerson: number;
  secondPerson: number;
  lowercaseStarts: number; // casual: sentences that begin lowercase
  per100: (n: number) => number; // normalize a raw count to per-100-words
  distinctive: string[]; // signature words this writer reaches for
}

function extract(raw: string): Features {
  const text = raw.replace(/\s+/g, " ").trim();
  const wordTokens = text.match(/[A-Za-z'’]+/g) ?? [];
  const words = Math.max(wordTokens.length, 1);

  const sentenceChunks = text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter((s) => /[A-Za-z]/.test(s));
  const sentences = Math.max(sentenceChunks.length, 1);

  const lens = sentenceChunks.map((s) => (s.match(/[A-Za-z'’]+/g) ?? []).length);
  const avgSentenceLen = lens.reduce((a, b) => a + b, 0) / sentences;
  const variance =
    lens.reduce((a, b) => a + (b - avgSentenceLen) ** 2, 0) / sentences;
  const sentenceVariance = Math.sqrt(variance);
  const shortRatio = lens.filter((l) => l > 0 && l <= 7).length / sentences;
  const longRatio = lens.filter((l) => l >= 24).length / sentences;

  const wordLens = wordTokens.map((w) => w.replace(/[’']/g, "").length);
  const avgWordLen =
    wordLens.reduce((a, b) => a + b, 0) / Math.max(wordLens.length, 1);
  const longWordRatio = wordLens.filter((l) => l >= 8).length / words;

  const lowerWords = wordTokens.map((w) => w.toLowerCase());
  const lexicalDiversity = new Set(lowerWords).size / words;

  const count = (re: RegExp) => (text.match(re) ?? []).length;
  const per100 = (n: number) => (n / words) * 100;

  // distinctive words: frequent, non-stopword, with a bit of weight to length
  const freq = new Map<string, number>();
  for (const w of lowerWords) {
    const clean = w.replace(/[’']/g, "");
    if (clean.length < 5 || STOPWORDS.has(clean)) continue;
    freq.set(clean, (freq.get(clean) ?? 0) + 1);
  }
  const distinctive = [...freq.entries()]
    .sort((a, b) => b[1] * b[0].length - a[1] * a[0].length)
    .slice(0, 5)
    .map(([w]) => w);

  const lowercaseStarts =
    sentenceChunks.filter((s) => /^[a-z]/.test(s)).length / sentences;

  return {
    words,
    sentences,
    avgSentenceLen,
    sentenceVariance,
    shortRatio,
    longRatio,
    avgWordLen,
    longWordRatio,
    lexicalDiversity,
    emDash: count(/—|--| - /g),
    semicolon: count(/;/g),
    colon: count(/:/g),
    paren: count(/\(/g),
    ellipsis: count(/\.\.\.|…/g),
    exclaim: count(/!/g),
    question: count(/\?/g),
    comma: count(/,/g),
    contractions: count(/\b\w+['’](t|s|re|ve|ll|d|m)\b/gi),
    firstPerson: count(/\b(i|me|my|mine|we|us|our)\b/gi),
    secondPerson: count(/\b(you|your|yours)\b/gi),
    lowercaseStarts,
    per100,
    distinctive,
  };
}

// ---------------------------------------------------------------------------
// Archetypes — every one is flattering. The engine picks the closest fit.
// ---------------------------------------------------------------------------

interface Archetype {
  id: string;
  label: string;
  score: (f: Features) => number;
  signature: (f: Features) => string;
  tagline: string;
}

const ARCHETYPES: Archetype[] = [
  {
    id: "striker",
    label: "The Striker",
    tagline: "You write in clean, deliberate hits.",
    score: (f) => f.shortRatio * 6 + Math.max(0, 14 - f.avgSentenceLen) * 0.35,
    signature: () => "Short range, full force — you land the point before anyone braces for it.",
  },
  {
    id: "essayist",
    label: "The Essayist",
    tagline: "Your sentences carry weight and travel far.",
    score: (f) =>
      f.longRatio * 3 + f.semicolon * 0.6 + (f.avgSentenceLen - 16) * 0.2 + f.longWordRatio * 4,
    signature: () =>
      "Long, considered lines that hold a whole thought intact until it's ready to land.",
  },
  {
    id: "cartographer",
    label: "The Cartographer",
    tagline: "You map the terrain before you move through it.",
    score: (f) =>
      f.colon * 0.5 + f.semicolon * 0.4 + Math.max(0, 4 - f.sentenceVariance) + f.paren * 0.3,
    signature: () =>
      "Structured and exact — you lay out the ground so the reader always knows where they stand.",
  },
  {
    id: "conversationalist",
    label: "The Conversationalist",
    tagline: "You write the way you'd lean across a table and talk.",
    score: (f) =>
      f.per100(f.contractions) * 0.7 +
      f.per100(f.secondPerson) * 0.6 +
      f.per100(f.question) * 0.8 +
      f.lowercaseStarts * 3,
    signature: () =>
      "Warm and direct — you talk to the reader, not at them, and they feel it.",
  },
  {
    id: "storyteller",
    label: "The Storyteller",
    tagline: "Your rhythm rises and falls like a told story.",
    score: (f) => f.sentenceVariance * 0.7 + f.per100(f.firstPerson) * 0.4 + f.comma * 0.1,
    signature: () =>
      "A natural cadence — you vary the line length so the reader is carried, never marched.",
  },
  {
    id: "minimalist",
    label: "The Minimalist",
    tagline: "You trust the plain word to do the work.",
    score: (f) =>
      (5.2 - f.avgWordLen) * 2 +
      (1 - f.longWordRatio) * 3 +
      Math.max(0, 0.6 - f.per100(f.comma) / 10) * 4,
    signature: () =>
      "Spare and unhurried — nothing decorative survives, and that's exactly the strength.",
  },
  {
    id: "craftsman",
    label: "The Craftsman",
    tagline: "Every clause looks set by hand.",
    score: (f) => f.emDash * 0.8 + f.lexicalDiversity * 4 + f.paren * 0.3,
    signature: () =>
      "Precise punctuation and a wide vocabulary — writing that's clearly been shaped, not poured.",
  },
  {
    id: "spark",
    label: "The Spark",
    tagline: "There's voltage in how you put it.",
    score: (f) => f.per100(f.exclaim) * 1.5 + f.sentenceVariance * 0.3 + f.shortRatio * 1.5,
    signature: () =>
      "Energetic and quick — you write like you can't quite wait to get the idea out.",
  },
];

// ---------------------------------------------------------------------------
// Portrait copy — assembled from measured features. Descriptive, never graded.
// ---------------------------------------------------------------------------

function rhythmLine(f: Features): string {
  if (f.shortRatio > 0.5)
    return `Short and percussive. Your sentences average about ${Math.round(
      f.avgSentenceLen,
    )} words, and you favour the clean stop over the long run-on — momentum built one beat at a time.`;
  if (f.longRatio > 0.3 || f.avgSentenceLen > 22)
    return `Long-breathed and flowing. Your sentences average around ${Math.round(
      f.avgSentenceLen,
    )} words, unspooling a full thought before they let the reader down for air.`;
  if (f.sentenceVariance > 7)
    return `Dynamic and varied — you swing from short, sharp lines to longer ones (a spread of about ${Math.round(
      f.sentenceVariance,
    )} words), which keeps a natural, almost spoken cadence.`;
  return `Steady and measured. Your sentences hold a consistent length near ${Math.round(
    f.avgSentenceLen,
  )} words, giving the writing an even, trustworthy pulse.`;
}

function toneLine(f: Features): string {
  const casual = f.per100(f.contractions) > 2 || f.lowercaseStarts > 0.2;
  const direct = f.per100(f.secondPerson) > 1.5;
  if (casual && direct)
    return "Conversational and close. You use contractions freely and speak straight to the reader — it reads like talk, not memo.";
  if (direct)
    return "Direct and engaged. You keep the reader in the second person, which gives the writing a hand-on-the-shoulder immediacy.";
  if (f.per100(f.firstPerson) > 3)
    return "Personal and grounded. You write from the first person, anchoring ideas to lived point of view rather than abstraction.";
  return "Composed and self-assured. You keep a measured distance that makes the writing feel considered and credible.";
}

function signatureMovesLine(f: Features): string {
  const moves: string[] = [];
  if (f.emDash >= 1) moves.push("the em-dash — your tool for the sudden aside and the late twist");
  if (f.semicolon >= 1) moves.push("the semicolon, joining ideas that belong in the same breath");
  if (f.paren >= 1) moves.push("the parenthetical (a quiet second voice running underneath)");
  if (f.ellipsis >= 1) moves.push("the trailing ellipsis, leaving a thought hanging on purpose");
  if (f.per100(f.question) > 1.2) moves.push("the rhetorical question, used to turn the reader toward you");
  if (f.colon >= 2) moves.push("the colon: a setup, then the payoff");
  if (moves.length === 0)
    return "You keep punctuation clean and load-bearing — no flourishes for their own sake, every mark earning its place.";
  return `You reach for ${listJoin(moves)}.`;
}

function lexicalLine(f: Features): string {
  const base =
    f.avgWordLen > 5
      ? "You favour the longer, more specific word — vocabulary that's reaching for precision rather than ease."
      : "You favour plain, sturdy words — the kind that don't need a second read.";
  const diversity =
    f.lexicalDiversity > 0.6
      ? " Your range is wide; you rarely repeat the same word twice."
      : f.lexicalDiversity < 0.42
        ? " You return to a tight core of words like motifs, which gives the writing a recognisable signature."
        : " You balance fresh words with a few you clearly trust.";
  const sig =
    f.distinctive.length >= 2
      ? ` Words you reach for: ${f.distinctive.slice(0, 4).map((w) => `“${w}”`).join(", ")}.`
      : "";
  return base + diversity + sig;
}

function structureLine(f: Features): string {
  if (f.colon + f.semicolon >= 3)
    return "You build in clauses — setup, pivot, resolution — so each sentence carries its own small arc.";
  if (f.shortRatio > 0.5)
    return "You stack short units and let white space do the pacing; the structure is a staircase, not a paragraph wall.";
  if (f.longRatio > 0.3)
    return "You let ideas accumulate inside long, subordinated sentences, trusting the reader to hold the thread to the end.";
  return "You move in even, self-contained sentences — each one a complete step, easy to follow and hard to misread.";
}

function listJoin(items: string[]): string {
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function traitChips(f: Features): string[] {
  const chips: string[] = [];
  chips.push(f.shortRatio > 0.45 ? "punchy" : f.longRatio > 0.3 ? "expansive" : "measured");
  chips.push(f.per100(f.contractions) > 2 ? "conversational" : "composed");
  chips.push(f.avgWordLen > 5 ? "precise" : "plain-spoken");
  if (f.emDash >= 2 || f.semicolon >= 2) chips.push("crafted");
  if (f.sentenceVariance > 7) chips.push("dynamic");
  if (f.per100(f.secondPerson) > 1.5) chips.push("direct");
  return [...new Set(chips)].slice(0, 4);
}

// ---------------------------------------------------------------------------

export function generateVoiceprint(rawText: string): Voiceprint {
  const f = extract(rawText);

  let best = ARCHETYPES[0];
  let bestScore = -Infinity;
  for (const a of ARCHETYPES) {
    const s = a.score(f);
    if (s > bestScore) {
      bestScore = s;
      best = a;
    }
  }

  const portrait: VoiceprintPortrait = {
    rhythm: rhythmLine(f),
    tone: toneLine(f),
    signatureMoves: signatureMovesLine(f),
    lexicalCharacter: lexicalLine(f),
    structure: structureLine(f),
  };

  return {
    archetype: best.label,
    signature: best.signature(f),
    tagline: best.tagline,
    portrait,
    traits: traitChips(f),
  };
}
