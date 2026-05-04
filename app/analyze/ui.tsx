"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import JobInput from "@/components/JobInput";
import type { AnalyzeApiResponse } from "@/types/analysis";

const STORAGE = {
  resumeText: "cvpilot.resumeText",
  jobDescription: "cvpilot.jobDescription",
  analysis: "cvpilot.analysis",
  optimized: "cvpilot.optimizedResumeText",
};

export default function AnalyzeClient() {
  const router = useRouter();
  const [resumeText, setResumeText] = useState<string>("");
  const [initialJob, setInitialJob] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const rt = sessionStorage.getItem(STORAGE.resumeText) ?? "";
    const jd = sessionStorage.getItem(STORAGE.jobDescription) ?? "";
    setResumeText(rt);
    setInitialJob(jd);
  }, []);

  async function onSubmit(jobDescription: string) {
    setError(null);
    const rt = resumeText.trim();
    const jd = jobDescription.trim();
    if (!rt) {
      setError("Missing resume text. Please upload your resume first.");
      return;
    }
    if (!jd) {
      setError("Please paste a job description.");
      return;
    }

    sessionStorage.setItem(STORAGE.jobDescription, jd);
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: rt, jobDescription: jd }),
      });
      const data = (await res.json()) as AnalyzeApiResponse;
      if (!res.ok || !data.ok) {
        setError(!data.ok ? data.error : "Analyze failed.");
        return;
      }

      sessionStorage.setItem(STORAGE.analysis, JSON.stringify(data));
      sessionStorage.setItem(STORAGE.optimized, data.optimizedResumeText);
      router.push("/dashboard");
    } catch {
      setError("Analyze failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-4">
      {error ? (
        <div className="rounded-xl border border-red-500/20 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <JobInput
        initialValue={initialJob}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
      <p className="text-xs text-ink/60">
        Your resume text is stored in this browser session only.
      </p>
    </div>
  );
}

