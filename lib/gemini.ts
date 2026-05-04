import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ResumeAnalysis } from "@/types/analysis";

function requireGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error(
      "Missing GEMINI_API_KEY. Add it to .env.local (server-only) and restart the dev server.",
    );
  }
  return key;
}

function getClient() {
  const apiKey = requireGeminiApiKey();
  return new GoogleGenerativeAI(apiKey);
}

function safeJsonParse<T>(raw: string): T {
  // Gemini sometimes wraps JSON in ```json fences.
  const cleaned = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```$/i, "")
    .trim();
  return JSON.parse(cleaned) as T;
}

export async function analyzeResume(
  resumeText: string,
  jobDescription: string,
  scoring: { matchScore: number; missingKeywords: string[] },
): Promise<ResumeAnalysis> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = [
    "You are an ATS resume reviewer.",
    "Return ONLY valid JSON (no markdown, no extra keys).",
    "",
    "Rules:",
    "- Do not invent experience.",
    "- Use the provided numeric matchScore and missingKeywords exactly as given.",
    "- Strengths and weaknesses must be short, actionable bullets.",
    "",
    "JSON shape:",
    '{ "matchScore": 0, "missingKeywords": [], "strengths": [], "weaknesses": [] }',
    "",
    `Provided matchScore: ${scoring.matchScore}`,
    `Provided missingKeywords: ${JSON.stringify(scoring.missingKeywords)}`,
    "",
    "Resume:",
    resumeText,
    "",
    "Job description:",
    jobDescription,
  ].join("\n");

  const result = await model.generateContent(prompt);
  const text = result.response.text();
  const parsed = safeJsonParse<ResumeAnalysis>(text);

  return {
    matchScore: scoring.matchScore,
    missingKeywords: scoring.missingKeywords,
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 8) : [],
    weaknesses: Array.isArray(parsed.weaknesses)
      ? parsed.weaknesses.slice(0, 8)
      : [],
  };
}

export async function optimizeResume(
  resumeText: string,
  jobDescription: string,
  missingKeywords: string[],
): Promise<string> {
  const genAI = getClient();
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const prompt = [
    "You are an expert resume editor for ATS.",
    "Rewrite the resume to better match the job description.",
    "",
    "Hard rules:",
    "- MUST NOT invent companies, titles, degrees, dates, certifications, or achievements.",
    "- You MAY rephrase existing bullets for clarity and impact.",
    "- You MAY reorganize sections and improve formatting.",
    "- Incorporate relevant missing keywords ONLY if they can be supported by the existing resume content.",
    "",
    "Output format:",
    "- Return ONLY plain text of the rewritten resume (no markdown fences).",
    "",
    `Missing keywords to consider: ${missingKeywords.join(", ")}`,
    "",
    "Job description:",
    jobDescription,
    "",
    "Resume to rewrite:",
    resumeText,
  ].join("\n");

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

