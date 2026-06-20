/**
 * voiceprint.ts — client-side voice MIRROR for the Voiceprint tool.
 *
 * THE ONE RULE: this is a MIRROR, not a JUDGE.
 * It DESCRIBES how someone writes and hands them a voice archetype.
 * It NEVER scores, ranks, grades, or calls writing "generic / slop / AI".
 * Find what's interesting in EVERY voice — that's the whole point.
 *
 * Runs entirely in the browser. No API, no network, no dependencies.
 *
 * Usage:
 *   import { voiceprint } from "./voiceprint";
 *   const print = voiceprint(pastedText);
 *
 * Tune the ARCHETYPES affinity rules + descriptor templates until the
 * portraits feel flattering, specific, and true.
 */

// ---------- Types ----------

export interface Archetype {
  name: string;     // e.g. "The Direct Operator"
  tagline: string;  // one short line of flavour
}

/** Raw measured features. Internal — used to pick descriptors + archetype.
 *  Also stored for the downstream champion table. NEVER shown as a grade. */
export interface Traits {
  words: number;
  sentences: number;
  avgLen: number;        // avg words per sentence
  variation: number;     // coefficient of variation of sentence lengths
  shortRatio: number;    // share of sentences <= 6 words
  longRatio: number;     // share of sentences >= 25 words
  firstPerson: number;   // per-100-words
  opinion: number;       // per-100-words
  questions: number;     // count
  exclaims: number;      // count
  contractions: number;  // per-100-words
  casual: number;        // per-100-words
  dashes: number;        // count (— or " - ")
  parentheticals: number;// count
  lists: number;         // list-ish markers
  longWordRatio: number; // share of words >= 8 chars
  variety: number;       // type-token ratio
  numbers: number;       // count
}

export interface Voiceprint {
  archetype: Archetype;
  signatureLine: string;   // the one-line signature (the shareable hook)
  rhythm: string;          // descriptive sentence about pacing
  tone: string[];          // tone/register descriptors (2-3 words/phrases)
  moves: string[];         // named signature moves detected
  lexical: string;         // lexical character description
  structure: string;       // how they open / build / land
  signature: number[];     // words per sentence → the voice-signature waveform
  traits: Traits;          // raw features (for champion table; never displayed as score)
  wordCount: number;
  tooShort: boolean;
}

// ---------- Tunables ----------

const MIN_WORDS = 25; // below this we nudge instead of mirroring

const OPINION_MARKERS = [
  "i think", "i believe", "honestly", "my take", "i'd argue", "i argue",
  "in my view", "personally", "i reckon", "frankly", "i'd say",
  "the truth is", "here's the thing", "let's be honest", "to be clear",
];

const CASUAL_MARKERS = [
  "yeah", "yep", "nope", "kinda", "sorta", "gonna", "wanna",
  "basically", "anyway", "ok", "okay", "lol", "haha", "honestly",
];

// ---------- Stats helpers ----------

const avg = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const stdev = (xs: number[]) => {
  if (xs.length < 2) return 0;
  const m = avg(xs);
  return Math.sqrt(avg(xs.map((x) => (x - m) ** 2)));
};
const count = (haystack: string, needles: string[]) =>
  needles.reduce((n, p) => n + (haystack.split(p).length - 1), 0);
const per100 = (n: number, words: number) => (words ? (n / words) * 100 : 0);

// ---------- Feature extraction ----------

function extract(text: string): Traits {
  const lower = ` ${text.toLowerCase()} `;
  const words = text.match(/\b[\w']+\b/g) || [];
  const sentences = text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean);
  const lens = sentences.map((s) => (s.match(/\b[\w']+\b/g) || []).length).filter((n) => n > 0);

  const unique = new Set(words.map((w) => w.toLowerCase())).size;
  const dashes = (text.match(/—| - |--/g) || []).length;
  const parentheticals = (text.match(/\([^)]+\)/g) || []).length;
  const lists =
    (text.match(/(^|\n)\s*[-*•→]/g) || []).length +
    (text.match(/(^|\n)\s*\d+[.)]/g) || []).length +
    (/\w+,\s*\w+,?\s*and\s+\w+/i.test(text) ? 1 : 0);

  return {
    words: words.length,
    sentences: lens.length,
    avgLen: avg(lens),
    variation: stdev(lens) / (avg(lens) || 1),
    shortRatio: lens.length ? lens.filter((n) => n <= 6).length / lens.length : 0,
    longRatio: lens.length ? lens.filter((n) => n >= 25).length / lens.length : 0,
    firstPerson: per100(count(lower, [" i ", " i'", " me ", " my ", " we ", " our "]), words.length),
    opinion: per100(count(lower, OPINION_MARKERS), words.length),
    questions: (text.match(/\?/g) || []).length,
    exclaims: (text.match(/!/g) || []).length,
    contractions: per100((text.match(/\b\w+'\w+\b/g) || []).length, words.length),
    casual: per100(count(lower, CASUAL_MARKERS), words.length),
    dashes,
    parentheticals,
    lists,
    longWordRatio: words.length ? words.filter((w) => w.length >= 8).length / words.length : 0,
    variety: words.length ? unique / words.length : 0,
    numbers: (text.match(/\b\d[\d,.]*\b/g) || []).length,
  };
}

// ---------- Archetypes ----------
// Each archetype scores its AFFINITY to the feature vector. Highest wins.
// This is matching, not grading — every text matches *some* archetype well.

const ARCHETYPES: {
  name: string;
  tagline: string;
  affinity: (t: Traits) => number;
}[] = [
  {
    name: "The Direct Operator",
    tagline: "Says it straight, lands it fast.",
    affinity: (t) => t.shortRatio * 3 + t.opinion * 1.5 + (t.avgLen < 14 ? 1.5 : 0) - t.longRatio * 2,
  },
  {
    name: "The Storyteller",
    tagline: "Builds the scene, then makes the point.",
    affinity: (t) => t.longRatio * 3 + t.firstPerson * 0.4 + t.variation * 1.5 - t.lists * 0.5,
  },
  {
    name: "The Craftsman",
    tagline: "Every sentence placed on purpose.",
    affinity: (t) => t.variation * 2.5 + t.variety * 3 + t.parentheticals * 0.6 + t.longWordRatio * 4,
  },
  {
    name: "The Connector",
    tagline: "Writes like they're talking to you.",
    affinity: (t) => t.contractions * 0.8 + t.casual * 1.2 + t.questions * 0.8 + t.firstPerson * 0.5 + t.exclaims * 0.6,
  },
  {
    name: "The Architect",
    tagline: "Thinks in structure, writes in order.",
    affinity: (t) => t.lists * 2 + t.numbers * 0.6 + (t.avgLen >= 12 && t.avgLen <= 22 ? 1.2 : 0) - t.casual * 0.5,
  },
  {
    name: "The Wit",
    tagline: "Dry, sharp, quietly funny.",
    affinity: (t) => t.parentheticals * 1.2 + t.dashes * 0.8 + t.shortRatio * 1.5 + (t.variation > 0.6 ? 1 : 0),
  },
  {
    name: "The Minimalist",
    tagline: "Nothing wasted. Nothing extra.",
    affinity: (t) => t.shortRatio * 2.5 + (1 - t.longWordRatio) * 2 + (t.avgLen < 10 ? 2 : 0) - t.parentheticals * 0.5,
  },
];

function pickArchetype(t: Traits): Archetype {
  let best = ARCHETYPES[0];
  let bestScore = -Infinity;
  for (const a of ARCHETYPES) {
    const s = a.affinity(t);
    if (s > bestScore) {
      bestScore = s;
      best = a;
    }
  }
  return { name: best.name, tagline: best.tagline };
}

// ---------- Descriptor builders (all flattering-but-true) ----------

function describeRhythm(t: Traits): string {
  if (t.variation >= 0.65)
    return "Your rhythm swings — long, rolling builds, then a sharp stop. It keeps a reader moving.";
  if (t.shortRatio >= 0.4)
    return "You move in short, clipped bursts. Each sentence lands before the next begins.";
  if (t.longRatio >= 0.25)
    return "You write in long, flowing lines that carry a thought all the way through.";
  return "Your sentences keep a steady, even pace — measured and easy to follow.";
}

function describeTone(t: Traits): string[] {
  const tone: string[] = [];
  if (t.casual >= 1 || t.contractions >= 3) tone.push("conversational");
  if (t.opinion >= 1) tone.push("direct");
  if (t.questions >= 2) tone.push("curious");
  if (t.exclaims >= 2) tone.push("energetic");
  if (t.longWordRatio >= 0.22) tone.push("considered");
  if (t.firstPerson >= 4) tone.push("personal");
  if (!tone.length) tone.push("measured", "even");
  return tone.slice(0, 3);
}

function describeMoves(text: string, t: Traits): string[] {
  const moves: string[] = [];
  if (t.dashes >= 2) moves.push("You reach for the dash — asides and second thoughts, mid-sentence.");
  if (t.parentheticals >= 2) moves.push("You think in parentheses (a quiet aside is your signature).");
  if (t.questions >= 2) moves.push("You ask as you go, thinking out loud on the page.");
  if (t.shortRatio >= 0.35) moves.push("You drop in one-line sentences. They hit.");
  if (t.lists >= 2) moves.push("You break things into lists — order over sprawl.");
  if (t.opinion >= 1) moves.push("You plant a flag. The reader knows where you stand.");
  if (/\w+,\s*\w+,?\s*and\s+\w+/i.test(text)) moves.push("You like a rule of three — things come in neat little trios.");
  if (!moves.length) moves.push("You keep it clean and unadorned — the point does the work.");
  return moves.slice(0, 3);
}

function describeLexical(t: Traits): string {
  if (t.longWordRatio >= 0.25 && t.variety >= 0.55)
    return "A rich, ranging vocabulary — you pick the exact word, not the nearest one.";
  if (t.longWordRatio <= 0.14)
    return "Plain, sturdy words. You trust simple language to carry the weight.";
  if (t.variety >= 0.6)
    return "You rarely repeat yourself — the vocabulary keeps turning over.";
  return "A balanced palette — everyday words with the occasional sharper choice.";
}

function describeStructure(text: string, t: Traits): string {
  const opensQuestion = /^\s*[A-Z][^.!?]*\?/.test(text);
  if (opensQuestion) return "You open with a question, then walk the reader to the answer.";
  if (t.lists >= 2) return "You set up a point, then break it into parts — scaffold first, detail after.";
  if (t.longRatio >= 0.25) return "You build slowly and land the point at the end — the payoff waits.";
  return "You lead with the point and support it after — top-down and confident.";
}

function buildSignatureLine(t: Traits, tone: string[], moves: string[]): string {
  // Three crisp fragments that capture the voice. Descriptive, never a grade.
  const rhythmBit =
    t.shortRatio >= 0.4 ? "Short sentences" :
    t.longRatio >= 0.25 ? "Long, flowing lines" :
    t.variation >= 0.65 ? "Restless rhythm" : "Steady pacing";
  const toneBit =
    tone.includes("direct") ? "strong opinions" :
    tone.includes("conversational") ? "talks to you, not at you" :
    tone.includes("considered") ? "carefully chosen words" :
    tone.includes("curious") ? "always asking" : "an even hand";
  const moveBit =
    t.dashes >= 2 ? "and a love of the dash" :
    t.parentheticals >= 2 ? "and a quiet aside in every paragraph" :
    t.lists >= 2 ? "and everything in its place" :
    t.shortRatio >= 0.4 ? "and not a word wasted" : "and nothing for show";
  return `${rhythmBit}, ${toneBit}, ${moveBit}.`;
}

// ---------- Main ----------

export function voiceprint(input: string): Voiceprint {
  const text = (input || "").trim();
  const traits = extract(text);

  if (traits.words < MIN_WORDS) {
    return {
      archetype: { name: "—", tagline: "" },
      signatureLine: "Give us a bit more to read — paste a paragraph or two.",
      rhythm: "",
      tone: [],
      moves: [],
      lexical: "",
      structure: "",
      signature: traits.sentences ? [] : [],
      traits,
      wordCount: traits.words,
      tooShort: true,
    };
  }

  const tone = describeTone(traits);
  const moves = describeMoves(text, traits);
  const sentenceLens = (text.split(/[.!?]+/).map((s) => s.trim()).filter(Boolean)
    .map((s) => (s.match(/\b[\w']+\b/g) || []).length).filter((n) => n > 0));

  return {
    archetype: pickArchetype(traits),
    signatureLine: buildSignatureLine(traits, tone, moves),
    rhythm: describeRhythm(traits),
    tone,
    moves,
    lexical: describeLexical(traits),
    structure: describeStructure(text, traits),
    signature: sentenceLens, // each value = one sentence's word count → waveform bars
    traits,
    wordCount: traits.words,
    tooShort: false,
  };
}
