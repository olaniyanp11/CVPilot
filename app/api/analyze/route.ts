import { NextResponse } from "next/server";
import { scoreResume } from "@/lib/scoring";
import { analyzeResume, optimizeResume } from "@/lib/gemini";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      resumeText?: string;
      jobDescription?: string;
    };

    const resumeText = body.resumeText?.trim() ?? "";
    const jobDescription = body.jobDescription?.trim() ?? "";

    if (!resumeText || !jobDescription) {
      return NextResponse.json(
        { ok: false, error: "Missing resumeText or jobDescription." },
        { status: 400 },
      );
    }

    const scoring = scoreResume(resumeText, jobDescription);
    const analysis = await analyzeResume(resumeText, jobDescription, scoring);
    const optimizedResumeText = await optimizeResume(
      resumeText,
      jobDescription,
      scoring.missingKeywords,
    );

    return NextResponse.json({
      ok: true,
      analysis,
      optimizedResumeText,
      scoring: {
        skillsScore: scoring.skillsScore,
        experienceScore: scoring.experienceScore,
        keywordScore: scoring.keywordScore,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Analyze failed.";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

