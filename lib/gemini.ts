import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ResumeAnalysis } from "@/types/analysis";

function requireGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Missing GEMINI_API_KEY in .env.local");
  return key;
}

const genAI = new GoogleGenerativeAI(requireGeminiApiKey());

async function generateWithResilience(
  prompt: string,
  options: { temperature?: number; maxOutputTokens?: number } = {},
): Promise<string> {
  const { temperature = 0.2, maxOutputTokens = 6000 } = options;
  const models = ["gemini-2.5-flash", "gemini-2.5-pro"];

  for (const modelName of models) {
    console.log(`[Gemini] Trying model: ${modelName}`);

    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: { temperature, maxOutputTokens, topP: 0.9 },
    });

    for (let attempt = 0; attempt < 4; attempt++) {
      console.log(`[Gemini] ${modelName} — attempt ${attempt + 1}/4`);

      try {
        const result = await model.generateContent(prompt);
        const text = result.response.text()?.trim();

        console.log(
          `[Gemini] ${modelName} attempt ${attempt + 1} — response length: ${text?.length ?? 0}`,
        );

        if (text && text.length > 100) return text;

        // Got a response but it's too short — log it so we can see what came back
        console.warn(
          `[Gemini] ${modelName} attempt ${attempt + 1} — response too short or empty:`,
          JSON.stringify(text),
        );
      } catch (err: any) {
        const msg = err.message?.toLowerCase() ?? "";
        const status =
          err.status ??
          err.statusCode ??
          err?.errorDetails?.[0]?.reason ??
          "unknown";

        console.error(
          `[Gemini] ${modelName} attempt ${attempt + 1} FAILED`,
          JSON.stringify({
            status,
            message: err.message,
            errorDetails: err.errorDetails ?? null,
            httpStatus: err.httpError?.statusCode ?? null,
          }),
        );

        if (msg.includes("503") || msg.includes("overloaded")) {
          const delay = 1500 * (attempt + 1);
          console.log(`[Gemini] 503/overloaded — retrying in ${delay}ms`);
          await new Promise((r) => setTimeout(r, delay));
          continue;
        }

        if (msg.includes("429")) {
          console.warn(
            `[Gemini] 429 rate limit hit on ${modelName} — skipping to next model`,
          );
          break;
        }

        // Any other error (401, 400, network failure, etc.) — log and break
        // Previously these were silently swallowed; now we surface them
        console.error(
          `[Gemini] Unhandled error type on ${modelName} — skipping to next model`,
        );
        break;
      }
    }

    console.log(`[Gemini] Exhausted all attempts for model: ${modelName}`);
  }

  throw new Error("Gemini generation failed after retries");
}

/* ====================== SAFE JSON PARSER ====================== */
function safeJsonParse<T>(raw: string): T {
  let cleaned = raw
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/```$/i, "")
    .trim();

  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}") + 1;
  if (start !== -1 && end > start) {
    cleaned = cleaned.slice(start, end);
  }

  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.error(
      "[Gemini] safeJsonParse failed. Raw text was:",
      raw.slice(0, 500),
    );
    throw err;
  }
}

/* ====================== ANALYZE RESUME ====================== */
export async function analyzeResume(
  resumeText: string,
  jobDescription: string,
  scoring: { matchScore: number; missingKeywords: string[] },
): Promise<ResumeAnalysis> {
  console.log(
    "[analyzeResume] Starting — resume length:",
    resumeText.length,
    "JD length:",
    jobDescription.length,
  );

  const prompt = [
    "You are a strict ATS resume reviewer.",
    "Return ONLY valid JSON. No markdown, no backticks, no explanations.",
    "",
    "CRITICAL RULES:",
    "- Weaknesses MUST be specific to THIS resume vs THIS job description.",
    "- Do NOT use generic phrases like 'lacks quantifiable achievements' unless truly absent.",
    "- Each weakness must reference a concrete gap (e.g. 'Resume mentions no testing frameworks; job requires Jest, Cypress, and Playwright').",
    "- Each strength must reference a concrete match (e.g. 'Next.js experience matches job requirement for Next.js testing').",
    "- Strengths: exactly 4-6 items.",
    "- Weaknesses: exactly 5-7 items.",
    "- Use the exact provided matchScore and missingKeywords — do not change them.",
    "",
    `Provided matchScore: ${scoring.matchScore}`,
    `Provided missingKeywords: ${JSON.stringify(scoring.missingKeywords)}`,
    "",
    "Return this exact JSON shape:",
    '{ "matchScore": number, "missingKeywords": string[], "strengths": string[], "weaknesses": string[] }',
    "",
    "=== RESUME ===",
    resumeText,
    "",
    "=== JOB DESCRIPTION ===",
    jobDescription,
  ].join("\n");

  console.log(
    "[analyzeResume] Prompt token estimate:",
    Math.round(prompt.length / 4),
  );

  const text = await generateWithResilience(prompt, { temperature: 0.1 });
  const parsed = safeJsonParse<Partial<ResumeAnalysis>>(text);

  const strengths =
    Array.isArray(parsed.strengths) && parsed.strengths.length >= 2
      ? parsed.strengths.slice(0, 7)
      : deriveStrengthsFallback(resumeText, jobDescription);

  const weaknesses =
    Array.isArray(parsed.weaknesses) && parsed.weaknesses.length >= 3
      ? parsed.weaknesses.slice(0, 7)
      : deriveWeaknessesFallback(
          resumeText,
          jobDescription,
          scoring.missingKeywords,
        );

  console.log(
    "[analyzeResume] Done — strengths:",
    strengths.length,
    "weaknesses:",
    weaknesses.length,
  );

  return {
    matchScore: scoring.matchScore,
    missingKeywords: scoring.missingKeywords,
    strengths,
    weaknesses,
  };
}

/* ====================== DYNAMIC FALLBACK GENERATORS ====================== */
function deriveStrengthsFallback(
  resumeText: string,
  jobDescription: string,
): string[] {
  const strengths: string[] = [];
  const resume = resumeText.toLowerCase();
  const jd = jobDescription.toLowerCase();

  const checks: [string, string, string][] = [
    [
      "next.js",
      "next.js",
      "Next.js experience aligns with job requirement for Next.js applications",
    ],
    [
      "react",
      "react",
      "React proficiency matches the React Native ecosystem mentioned in the role",
    ],
    [
      "rest api",
      "rest",
      "REST API integration experience relevant to API validation requirements",
    ],
    [
      "typescript",
      "typescript",
      "TypeScript skills support type-safe testing and development",
    ],
    [
      "node",
      "node",
      "Node.js background aids in understanding NestJS backend testing",
    ],
    [
      "git",
      "git",
      "Version control experience supports CI/CD pipeline integration",
    ],
    [
      "lagos",
      "lagos",
      "Based in Lagos, matching the hybrid Lagos work location requirement",
    ],
  ];

  for (const [resumeKw, jdKw, message] of checks) {
    if (resume.includes(resumeKw) && jd.includes(jdKw)) {
      strengths.push(message);
    }
  }

  return strengths.length >= 2
    ? strengths
    : ["Clean resume structure", "Computer Science educational background"];
}

function deriveWeaknessesFallback(
  resumeText: string,
  jobDescription: string,
  missingKeywords: string[],
): string[] {
  const weaknesses: string[] = [];
  const resume = resumeText.toLowerCase();

  if (!resume.includes("test") && !resume.includes("qa")) {
    weaknesses.push(
      "No QA or testing experience mentioned — the role requires owning the full test lifecycle",
    );
  }
  if (!resume.includes("automated") && !resume.includes("automation")) {
    weaknesses.push(
      "No automated testing frameworks listed (Jest, Cypress, Playwright, etc.) — central to this role",
    );
  }
  if (!resume.includes("ci/cd") && !resume.includes("pipeline")) {
    weaknesses.push(
      "No CI/CD pipeline experience mentioned — job requires integrating tests into CI/CD",
    );
  }
  if (
    !resume.includes("security") &&
    !resume.includes("owasp") &&
    !resume.includes("pci")
  ) {
    weaknesses.push(
      "No security testing knowledge shown — role requires PCI-DSS and OWASP compliance",
    );
  }
  if (!resume.includes("graphql")) {
    weaknesses.push(
      "GraphQL not mentioned — job requires validating GraphQL APIs and microservices",
    );
  }
  if (
    !resume.includes("mobile") &&
    !resume.includes("react native") &&
    !resume.includes("ios") &&
    !resume.includes("android")
  ) {
    weaknesses.push(
      "No mobile testing experience — role covers iOS, Android, and React Native platforms",
    );
  }
  if (missingKeywords.length > 5) {
    weaknesses.push(
      `Resume is missing ${missingKeywords.length} keywords from the job description including: ${missingKeywords.slice(0, 5).join(", ")}`,
    );
  }

  return weaknesses.length >= 3
    ? weaknesses
    : [
        "Resume does not reflect QA or testing responsibilities required by the role",
        "Missing automated testing frameworks expected in this position",
        "No evidence of cross-platform or mobile testing experience",
      ];
}

/* ====================== OPTIMIZE RESUME ====================== */
export async function optimizeResume(
  resumeText: string,
  jobDescription: string,
  missingKeywords: string[],
): Promise<string> {
  console.log(
    "[optimizeResume] Starting — resume length:",
    resumeText.length,
    "missing keywords:",
    missingKeywords.length,
  );

  const prompt = [
    "You are an expert ATS resume optimizer.",
    "Rewrite the resume below to maximally align with the job description while staying 100% truthful.",
    "",
    "MANDATORY INSTRUCTIONS:",
    "- Rewrite EVERY bullet point to be stronger, more specific, and keyword-rich.",
    "- Rewrite the Professional Summary to be tailored to this exact job.",
    "- Naturally incorporate the missing keywords listed below where they genuinely apply.",
    "- Use strong action verbs (Engineered, Implemented, Optimized, Delivered, etc.).",
    "- Do NOT invent new jobs, companies, dates, or achievements that don't exist in the original.",
    "- Keep all existing roles, education, and projects — just rewrite the descriptions.",
    "- Output ONLY the full rewritten resume as plain text. No explanations, no markdown, no headers like 'Here is the rewritten resume'.",
    "",
    `Missing keywords to weave in naturally: ${missingKeywords.join(", ")}`,
    "",
    "=== JOB DESCRIPTION ===",
    jobDescription,
    "",
    "=== ORIGINAL RESUME (rewrite this) ===",
    resumeText,
  ].join("\n");

  console.log(
    "[optimizeResume] Prompt token estimate:",
    Math.round(prompt.length / 4),
  );

  const text = await generateWithResilience(prompt, {
    temperature: 0.3,
    maxOutputTokens: 7000,
  });

  const result = text.trim();

  if (result === resumeText.trim()) {
    console.warn(
      "[optimizeResume] WARNING: Model returned text identical to input. " +
        "The resume may not have been rewritten. Check your Gemini quota and prompt.",
    );
  }

  console.log("[optimizeResume] Done — output length:", result.length);

  return result;
}
