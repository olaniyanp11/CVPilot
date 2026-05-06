import { GoogleGenerativeAI } from "@google/generative-ai";
import type { ResumeAnalysis } from "@/types/analysis";
import { HfInference } from "@huggingface/inference";

function requireGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY;
  if (!key) throw new Error("Missing GEMINI_API_KEY in .env.local");
  return key;
}

const genAI = new GoogleGenerativeAI(requireGeminiApiKey());

// async function generateWithResilience(
//   prompt: string,
//   options: { temperature?: number; maxOutputTokens?: number } = {},
// ): Promise<string> {
//   const { temperature = 0.2, maxOutputTokens = 6000 } = options;
//   const models = ["gemini-2.5-flash", "gemini-2.5-pro"];

//   for (const modelName of models) {
//     console.log(`[Gemini] Trying model: ${modelName}`);

//     const model = genAI.getGenerativeModel({
//       model: modelName,
//       generationConfig: { temperature, maxOutputTokens, topP: 0.9 },
//     });

//     for (let attempt = 0; attempt < 4; attempt++) {
//       console.log(`[Gemini] ${modelName} — attempt ${attempt + 1}/4`);

//       try {
//         const result = await model.generateContent(prompt);
//         const text = result.response.text()?.trim();

//         console.log(
//           `[Gemini] ${modelName} attempt ${attempt + 1} — response length: ${text?.length ?? 0}`,
//         );

//         if (text && text.length > 100) return text;

//         // Got a response but it's too short — log it so we can see what came back
//         console.warn(
//           `[Gemini] ${modelName} attempt ${attempt + 1} — response too short or empty:`,
//           JSON.stringify(text),
//         );
//       } catch (err: any) {
//         const msg = err.message?.toLowerCase() ?? "";
//         const status =
//           err.status ??
//           err.statusCode ??
//           err?.errorDetails?.[0]?.reason ??
//           "unknown";

//         console.error(
//           `[Gemini] ${modelName} attempt ${attempt + 1} FAILED`,
//           JSON.stringify({
//             status,
//             message: err.message,
//             errorDetails: err.errorDetails ?? null,
//             httpStatus: err.httpError?.statusCode ?? null,
//           }),
//         );

//         if (msg.includes("503") || msg.includes("overloaded")) {
//           const delay = 1500 * (attempt + 1);
//           console.log(`[Gemini] 503/overloaded — retrying in ${delay}ms`);
//           await new Promise((r) => setTimeout(r, delay));
//           continue;
//         }

//         if (msg.includes("429")) {
//           console.warn(
//             `[Gemini] 429 rate limit hit on ${modelName} — skipping to next model`,
//           );
//           break;
//         }

//         // Any other error (401, 400, network failure, etc.) — log and break
//         // Previously these were silently swallowed; now we surface them
//         console.error(
//           `[Gemini] Unhandled error type on ${modelName} — skipping to next model`,
//         );
//         break;
//       }
//     }

//     console.log(`[Gemini] Exhausted all attempts for model: ${modelName}`);
//   }

//   throw new Error("Gemini generation failed after retries");
// }

function requireHfApiKey(): string {
  const key = process.env.HUGGINGFACE_API_KEY;
  if (!key) throw new Error("Missing HUGGINGFACE_API_KEY in .env.local");
  return key;
}

const hf = new HfInference(requireHfApiKey());

async function generateWithResilience(
  prompt: string,
  systemMessage: string,
  options: { temperature?: number; maxOutputTokens?: number } = {},
): Promise<string> {
  const { temperature = 0.1, maxOutputTokens = 3000 } = options;

  // Prioritizing models with high availability and strong instruction-following
  const models = [
    "deepseek-ai/DeepSeek-V4-Pro",
    "Qwen/Qwen2.5-72B-Instruct",
    "mistralai/Mistral-Nemo-Instruct-2407",
    "meta-llama/Llama-3.1-70B-Instruct",
  ];

  // Verify API Key exists before starting
  if (!process.env.HUGGINGFACE_API_KEY) {
    throw new Error(
      "HUGGINGFACE_API_KEY is missing from environment variables.",
    );
  }

  for (const modelName of models) {
    console.log(`[HuggingFace] Targeting: ${modelName}`);

    for (let attempt = 0; attempt < 3; attempt++) {
      console.log(`[HuggingFace] ${modelName} — Attempt ${attempt + 1}/3`);

      // Create a long timeout (120s) for local network stability
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 120000);

      try {
        const response = await hf.chatCompletion(
          {
            model: modelName,
            messages: [
              { role: "system", content: systemMessage },
              { role: "user", content: prompt },
            ],
            max_tokens: maxOutputTokens,
            temperature: temperature,
          },
          {
            // Use custom fetch to attach the timeout signal
            fetch: (url, fetchOptions) =>
              fetch(url, { ...fetchOptions, signal: controller.signal }),

            // CRITICAL: Tells Hugging Face to wait if the model is currently loading
            // wait_for_model: true,
          },
        );

        clearTimeout(timeoutId);

        const text = response.choices[0].message.content?.trim();

        // Basic validation of the response
        if (text && text.length > 100) {
          console.log(`[HuggingFace] Success with ${modelName}`);
          return text;
        }

        console.warn(
          `[HuggingFace] ${modelName} returned a suspiciously short response.`,
        );
      } catch (err: any) {
        clearTimeout(timeoutId);

        // Detailed error logging for your local debugging
        const errName = err.name || "UnknownError";
        const errMsg = err.message?.toLowerCase() ?? "";

        console.error(`[DEBUG] Error Name: ${errName}`);
        console.error(`[DEBUG] Error Message: ${err.message}`);

        if (errName === "AbortError") {
          console.error(
            `[HuggingFace] Timeout: Model ${modelName} took too long.`,
          );
          break; // Move to the next model
        }

        // Handle specific API responses
        if (errMsg.includes("loading") || errMsg.includes("503")) {
          const backoff = 5000 * (attempt + 1);
          console.log(
            `[HuggingFace] Model is busy/loading. Waiting ${backoff}ms...`,
          );
          await new Promise((r) => setTimeout(r, backoff));
          continue; // Retry the same model
        }

        if (errMsg.includes("429") || errMsg.includes("rate limit")) {
          console.warn(`[HuggingFace] Rate limited on ${modelName}.`);
          break; // Move to the next model
        }

        // Generic fetch failure - likely local network or SSL
        console.error(
          `[HuggingFace] Fetch failed on ${modelName}. Switching models...`,
        );
        break;
      }
    }
  }

  throw new Error(
    "All models failed. Check your API key, local DNS settings, or .env.local file.",
  );
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
      "[Parser] safeJsonParse failed. Raw text was:",
      raw.slice(0, 500),
    );
    throw err;
  }
}

/* ====================== ANALYZE RESUME (JSON Output) ====================== */

export async function analyzeResume(
  resumeText: string,
  jobDescription: string,
  scoring: { matchScore: number; missingKeywords: string[] },
): Promise<ResumeAnalysis> {
  const prompt = [
    "CRITICAL RULES:",
    "- Weaknesses MUST be specific to THIS resume vs THIS job description.",
    "- Each weakness must reference a concrete gap (e.g. 'Resume mentions no testing frameworks').",
    "- Strengths: exactly 4-6 items.",
    "- Weaknesses: exactly 5-7 items.",
    `- matchScore: ${scoring.matchScore}`,
    `- missingKeywords: ${JSON.stringify(scoring.missingKeywords)}`,
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

  const systemRole =
    "You are a precise ATS resume reviewer. Return ONLY valid JSON. No conversational filler.";

  const text = await generateWithResilience(prompt, systemRole, {
    temperature: 0.1,
  });
  const parsed = safeJsonParse<Partial<ResumeAnalysis>>(text);

  return {
    matchScore: scoring.matchScore,
    missingKeywords: scoring.missingKeywords,
    strengths:
      parsed.strengths || deriveStrengthsFallback(resumeText, jobDescription),
    weaknesses:
      parsed.weaknesses ||
      deriveWeaknessesFallback(
        resumeText,
        jobDescription,
        scoring.missingKeywords,
      ),
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
  const prompt = [
    "Rewrite the following resume to align with the provided Job Description.",
    "Ensure you weave in these missing keywords naturally: " +
      missingKeywords.join(", "),
    "",
    "=== JOB DESCRIPTION ===",
    jobDescription,
    "",
    "=== ORIGINAL RESUME ===",
    resumeText,
  ].join("\n");

  /**
   * Refined System Role:
   * This tells the model exactly how to structure the document for a PDF.
   */
  const systemRole = `
    You are a professional Resume Architect. 
    Format the resume using clean Markdown:
    1. Use # for the Name.
    2. Use ## for Section Headers (Experience, Education, etc.).
    3. Use bold **Company Name** and *Job Title*.
    4. Use bullet points (-) for responsibilities.
    5. Do NOT include any introductory text like "Here is the optimized resume."
    6. Return ONLY the resume content.
  `.trim();

  const text = await generateWithResilience(prompt, systemRole, {
    temperature: 0.3,
    maxOutputTokens: 6000,
  });

  return text.trim();
}