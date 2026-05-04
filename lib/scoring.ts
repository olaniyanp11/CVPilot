const STOPWORDS = new Set(
  [
    "a",
    "an",
    "and",
    "are",
    "as",
    "at",
    "be",
    "but",
    "by",
    "for",
    "from",
    "has",
    "have",
    "how",
    "in",
    "is",
    "it",
    "its",
    "of",
    "on",
    "or",
    "our",
    "that",
    "the",
    "their",
    "they",
    "this",
    "to",
    "we",
    "with",
    "you",
    "your",
  ].map((w) => w.toLowerCase()),
);

function clamp0to100(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#.\- ]+/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);
}

function extractKeywords(jobDescription: string): string[] {
  const tokens = tokenize(jobDescription).filter(
    (t) => t.length >= 2 && !STOPWORDS.has(t),
  );

  const counts = new Map<string, number>();
  for (const t of tokens) counts.set(t, (counts.get(t) ?? 0) + 1);

  // Keep common tech tokens like "c++", "c#", "node.js" (normalized by tokenizer).
  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([k]) => k)
    .slice(0, 40);
}

function presenceRatio(haystack: string, needles: string[]): number {
  const h = haystack.toLowerCase();
  if (needles.length === 0) return 0;
  let found = 0;
  for (const n of needles) {
    if (h.includes(n.toLowerCase())) found += 1;
  }
  return found / needles.length;
}

function scoreSkills(resumeText: string, jobDescription: string): number {
  // Heuristic: measure overlap on the extracted keyword set.
  const kw = extractKeywords(jobDescription);
  return clamp0to100(presenceRatio(resumeText, kw) * 100);
}

function scoreExperience(resumeText: string, jobDescription: string): number {
  // Heuristic: give credit for years/months tokens + overlap on action-ish keywords.
  const experienceNeedles = [
    "years",
    "year",
    "months",
    "month",
    "led",
    "owned",
    "built",
    "shipped",
    "delivered",
    "managed",
    "designed",
    "implemented",
    "optimized",
    "improved",
  ];
  const expPresence = presenceRatio(resumeText, experienceNeedles);
  const overlap = presenceRatio(resumeText, extractKeywords(jobDescription));
  return clamp0to100((expPresence * 0.4 + overlap * 0.6) * 100);
}

function scoreKeywords(resumeText: string, jobDescription: string): {
  score: number;
  missing: string[];
  matched: string[];
} {
  const kw = extractKeywords(jobDescription);
  const lower = resumeText.toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];
  for (const k of kw) {
    if (lower.includes(k)) matched.push(k);
    else missing.push(k);
  }
  const ratio = kw.length ? matched.length / kw.length : 0;
  return { score: clamp0to100(ratio * 100), missing, matched };
}

export type ScoringResult = {
  skillsScore: number; // 0-100
  experienceScore: number; // 0-100
  keywordScore: number; // 0-100
  matchScore: number; // weighted 0-100
  missingKeywords: string[];
};

export function scoreResume(resumeText: string, jobDescription: string): ScoringResult {
  const skillsScore = scoreSkills(resumeText, jobDescription);
  const experienceScore = scoreExperience(resumeText, jobDescription);
  const kw = scoreKeywords(resumeText, jobDescription);

  const matchScore =
    skillsScore * 0.4 + experienceScore * 0.4 + kw.score * 0.2;

  return {
    skillsScore,
    experienceScore,
    keywordScore: kw.score,
    matchScore: clamp0to100(matchScore),
    missingKeywords: kw.missing.slice(0, 20),
  };
}

