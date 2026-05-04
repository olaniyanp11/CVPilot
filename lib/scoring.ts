const STOPWORDS = new Set([
  // Articles / conjunctions / prepositions
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "been",
  "being",
  "but",
  "by",
  "can",
  "did",
  "do",
  "does",
  "for",
  "from",
  "had",
  "has",
  "have",
  "how",
  "if",
  "in",
  "is",
  "it",
  "its",
  "may",
  "might",
  "must",
  "not",
  "of",
  "on",
  "or",
  "our",
  "shall",
  "she",
  "should",
  "so",
  "that",
  "the",
  "their",
  "them",
  "they",
  "this",
  "to",
  "use",
  "used",
  "using",
  "was",
  "we",
  "were",
  "will",
  "with",
  "would",
  "you",
  "your",

  // Generic JD filler words that are NOT skills
  "full",
  "job",
  "description",
  "role",
  "position",
  "work",
  "location",
  "hybrid",
  "remote",
  "including",
  "include",
  "such",
  "via",
  "into",
  "through",
  "across",
  "within",
  "ensure",
  "ensuring",
  "produce",
  "clear",
  "embed",
  "embedded",
  "ability",
  "able",
  "also",
  "well",
  "both",
  "more",
  "very",
  "just",
  "only",
  "than",
  "then",
  "when",
  "where",
  "which",
  "who",
  "any",
  "each",
  "every",
  "all",
  "new",
  "good",
  "best",
  "high",
  "key",
  "main",
  "other",
  "third",
  "party",
  "cross",
  "team",
  "teams",
  "based",
  "various",
  "relevant",
  "related",
  "required",
  "requirements",
  "preferred",
  "experience",
  "strong",
  "solid",
  "excellent",
  "proficiency",
  "knowledge",
  "understanding",
  "familiarity",
  "exposure",
  "background",
  "working",
  "collaborate",
  "collaborating",
  "collaboration",
  "report",
  "reporting",
  "maintain",
  "maintaining",
  "support",
  "supporting",
  "drive",
  "driving",
  "ensure",
  "manage",
  "managing",
  "build",
  "building",
  "identify",
  "identifying",
  "conduct",
  "conducting",
  "develop",
  "developing",
  "implement",
  "implementing",
  "provide",
  "providing",
  "perform",
  "performing",
  "track",
  "tracking",
]);

// Words that look like keywords but are too generic to be useful signals
const MIN_LENGTH = 4;

function clamp0to100(n: number): number {
  return Math.max(0, Math.min(100, Math.round(n)));
}

function tokenize(text: string): string[] {
  return (
    text
      .toLowerCase()
      // Preserve important tech tokens: c++, c#, .net, ci/cd, node.js, pci-dss
      .replace(/[^a-z0-9+#./\- ]+/g, " ")
      .split(/\s+/)
      .map((t) => t.replace(/^[-./]+|[-./]+$/g, "").trim()) // strip leading/trailing punctuation
      .filter(Boolean)
  );
}

function extractKeywords(text: string): string[] {
  const tokens = tokenize(text).filter(
    (t) =>
      t.length >= MIN_LENGTH &&
      !STOPWORDS.has(t) &&
      // Must contain at least one letter — filters "2022", "35", "100"
      /[a-z]/.test(t) &&
      // Skip tokens that are purely numeric with a suffix like "3rd", "2nd"
      !/^\d+(st|nd|rd|th)?$/.test(t),
  );

  const counts = new Map<string, number>();
  for (const t of tokens) {
    if (t.length >= MIN_LENGTH && !STOPWORDS.has(t)) {
      counts.set(t, (counts.get(t) ?? 0) + 1);
    }
  }

  return (
    Array.from(counts.entries())
      // Sort by frequency desc, then length desc (longer = more specific)
      .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
      .map(([k]) => k)
      // Cap at 30 — beyond that it's noise
      .slice(0, 30)
  );
}

function presenceRatio(haystack: string, needles: string[]): number {
  const h = haystack.toLowerCase();
  if (needles.length === 0) return 0;
  let found = 0;
  for (const n of needles) {
    if (h.includes(n.toLowerCase())) found++;
  }
  return found / needles.length;
}

function scoreSkills(resumeText: string, jobDescription: string): number {
  const kw = extractKeywords(jobDescription);
  return clamp0to100(presenceRatio(resumeText, kw) * 100);
}

function scoreExperience(resumeText: string, jobDescription: string): number {
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

function scoreKeywords(
  resumeText: string,
  jobDescription: string,
): { score: number; missing: string[]; matched: string[] } {
  const kw = extractKeywords(jobDescription);
  const lower = resumeText.toLowerCase();
  const matched: string[] = [];
  const missing: string[] = [];

  for (const k of kw) {
    if (lower.includes(k)) matched.push(k);
    else missing.push(k);
  }

  const ratio = kw.length ? matched.length / kw.length : 0;

  return {
    score: clamp0to100(ratio * 100),
    // Sort missing by length desc — "playwright", "regression" before "test", "plan"
    missing: missing.sort((a, b) => b.length - a.length).slice(0, 20),
    matched,
  };
}

export type ScoringResult = {
  skillsScore: number;
  experienceScore: number;
  keywordScore: number;
  matchScore: number;
  missingKeywords: string[];
};

export function scoreResume(
  resumeText: string,
  jobDescription: string,
): ScoringResult {
  const skillsScore = scoreSkills(resumeText, jobDescription);
  const experienceScore = scoreExperience(resumeText, jobDescription);
  const kw = scoreKeywords(resumeText, jobDescription);

  // Keywords weighted most heavily — it's the most direct ATS signal
  const matchScore =
    skillsScore * 0.35 + experienceScore * 0.3 + kw.score * 0.35;

  return {
    skillsScore,
    experienceScore,
    keywordScore: kw.score,
    matchScore: clamp0to100(matchScore),
    missingKeywords: kw.missing,
  };
}
