export type ResumeAnalysis = {
  matchScore: number; // 0-100
  missingKeywords: string[];
  strengths: string[];
  weaknesses: string[];
};

export type AnalyzeApiResponse =
  | {
      ok: true;
      analysis: ResumeAnalysis;
      optimizedResumeText: string;
      scoring: {
        skillsScore: number;
        experienceScore: number;
        keywordScore: number;
      };
    }
  | { ok: false; error: string };

