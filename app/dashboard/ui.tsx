"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import ScoreCard from "@/components/ScoreCard";
import KeywordList from "@/components/KeywordList";
import ResumePreview from "@/components/ResumePreview";
import type { AnalyzeApiResponse } from "@/types/analysis";

const STORAGE = {
  resumeText: "cvpilot.resumeText",
  analysis: "cvpilot.analysis",
};

export default function DashboardClient() {
  const [raw, setRaw] = useState<AnalyzeApiResponse | null>(null);
  const [resumeText, setResumeText] = useState<string>("");
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  useEffect(() => {
    const rt = sessionStorage.getItem(STORAGE.resumeText) ?? "";
    setResumeText(rt);
    const saved = sessionStorage.getItem(STORAGE.analysis);
    if (saved) {
      try {
        setRaw(JSON.parse(saved) as AnalyzeApiResponse);
      } catch {
        setRaw(null);
      }
    }
  }, []);

  const data = useMemo(() => (raw && raw.ok ? raw : null), [raw]);

  async function exportPdf() {
    setExportError(null);
    if (!data?.optimizedResumeText) {
      setExportError("Missing optimized resume text.");
      return;
    }
    setIsExporting(true);
    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: data.optimizedResumeText }),
      });
      if (!res.ok) {
        const msg = await res.text();
        setExportError(msg || "Export failed.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cvpilot-optimized-resume.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setExportError("Export failed. Please try again.");
    } finally {
      setIsExporting(false);
    }
  }

  if (!data) {
    return (
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h1 className="font-[var(--font-syne)] text-2xl font-extrabold text-ink">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-ink/70">
          No analysis found in this session.
        </p>
        <div className="mt-5 flex gap-3">
          <Link
            href="/upload"
            className="inline-flex items-center justify-center rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-cream-100 hover:bg-ink/90"
          >
            Upload resume
          </Link>
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:border-black/25"
          >
            Paste job description
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-[var(--font-syne)] text-3xl font-extrabold tracking-tight text-ink">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-ink/70">
            Score, gaps, and AI rewrite — ready to export.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportPdf}
            disabled={isExporting}
            className="inline-flex items-center justify-center rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-cream-100 hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isExporting ? "Exporting…" : "Download PDF"}
          </button>
          <Link
            href="/analyze"
            className="inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:border-black/25"
          >
            Re-run analysis
          </Link>
        </div>
      </div>

      {exportError ? (
        <div className="rounded-xl border border-red-500/20 bg-red-50 p-3 text-sm text-red-700">
          {exportError}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <ScoreCard score={data.analysis.matchScore} title="ATS match score" />
        <KeywordList
          title="Missing keywords"
          items={data.analysis.missingKeywords}
          variant="missing"
        />
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h3 className="font-[var(--font-syne)] text-lg font-extrabold text-ink">
            Scoring breakdown
          </h3>
          <div className="mt-3 space-y-2 text-sm text-ink/80">
            <div className="flex justify-between">
              <span>Skills (40%)</span>
              <span className="font-semibold">{data.scoring.skillsScore}</span>
            </div>
            <div className="flex justify-between">
              <span>Experience (40%)</span>
              <span className="font-semibold">
                {data.scoring.experienceScore}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Keywords (20%)</span>
              <span className="font-semibold">{data.scoring.keywordScore}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h3 className="font-[var(--font-syne)] text-lg font-extrabold text-ink">
            Strengths
          </h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink/80">
            {data.analysis.strengths.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
          <h3 className="font-[var(--font-syne)] text-lg font-extrabold text-ink">
            Weaknesses
          </h3>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink/80">
            {data.analysis.weaknesses.map((w) => (
              <li key={w}>{w}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <ResumePreview title="Before (original)" text={resumeText || "—"} />
        <ResumePreview title="After (optimized)" text={data.optimizedResumeText} />
      </div>

      <p className="text-xs text-ink/60">
        Note: analysis data is stored in this browser session only (no external backend).
      </p>
    </div>
  );
}

