// components/AnalyzingModal.tsx
"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = [
  { label: "Parsing resume content", duration: 1200 },
  { label: "Extracting job requirements", duration: 1000 },
  { label: "Running keyword analysis", duration: 1400 },
  { label: "Scoring skills match", duration: 1000 },
  { label: "Identifying gaps", duration: 1200 },
  { label: "Generating optimized resume", duration: 2000 },
  { label: "Finalizing report", duration: 800 },
];

const SIGNALS = [
  "Scanning resume structure and extracting sections…",
  "Parsing job description requirements and responsibilities…",
  "Comparing keyword overlap between resume and JD…",
  "Calculating skills match score…",
  "Identifying missing tools, frameworks, and terminology…",
  "Rewriting bullet points to align with job language…",
  "Weaving in missing keywords naturally…",
  "Finalizing ATS-optimized resume output…",
];

type Step = { label: string; status: "pending" | "active" | "done" };

export default function AnalyzingModal({ open }: { open: boolean }) {
  const [steps, setSteps] = useState<Step[]>(
    STEPS.map((s) => ({ label: s.label, status: "pending" })),
  );
  const [signal, setSignal] = useState(SIGNALS[0]);
  const [progress, setProgress] = useState(0);
  const [fadeSignal, setFadeSignal] = useState(true);
  const ran = useRef(false);

  useEffect(() => {
    if (!open || ran.current) return;
    ran.current = true;

    const totalDuration = STEPS.reduce((a, s) => a + s.duration, 0);
    let elapsed = 0;
    let signalIdx = 0;

    const signalInterval = setInterval(() => {
      setFadeSignal(false);
      setTimeout(() => {
        setSignal(SIGNALS[Math.min(signalIdx++, SIGNALS.length - 1)]);
        setFadeSignal(true);
      }, 200);
    }, 1100);

    (async () => {
      for (let i = 0; i < STEPS.length; i++) {
        setSteps((prev) =>
          prev.map((s, idx) => (idx === i ? { ...s, status: "active" } : s)),
        );
        await new Promise((r) => setTimeout(r, STEPS[i].duration));
        setSteps((prev) =>
          prev.map((s, idx) => (idx === i ? { ...s, status: "done" } : s)),
        );
        elapsed += STEPS[i].duration;
        setProgress(Math.round((elapsed / totalDuration) * 100));
      }
      clearInterval(signalInterval);
    })();

    return () => clearInterval(signalInterval);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-black/10 bg-white shadow-xl">
        {/* Progress bar */}
        <div className="h-0.5 w-full bg-black/5">
          <div
            className="h-full bg-ink transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="p-6">
          {/* Header */}
          <div className="mb-5 flex items-center gap-3">
            <div className="relative h-9 w-9 flex-shrink-0">
              <div className="absolute inset-0 rounded-full border border-black/10" />
              <div className="absolute inset-0 animate-spin rounded-full border border-transparent border-t-ink" />
            </div>
            <div>
              <p className="text-sm font-semibold text-ink">
                Analyzing your resume
              </p>
              <p className="text-xs text-ink/50">
                This takes about 10–15 seconds
              </p>
            </div>
          </div>

          {/* Steps */}
          <div className="mb-5 space-y-0 divide-y divide-black/5">
            {steps.map((step, i) => (
              <div key={i} className="flex items-center gap-3 py-2">
                <div className="flex h-4 w-4 flex-shrink-0 items-center justify-center">
                  {step.status === "done" ? (
                    <svg
                      className="animate-pop"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none"
                    >
                      <circle cx="8" cy="8" r="7" className="fill-black/5" />
                      <path
                        d="M5 8.5l2 2 4-4"
                        stroke="#0a0a0a"
                        strokeWidth="1.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : step.status === "active" ? (
                    <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-ink" />
                  ) : (
                    <div className="h-1.5 w-1.5 rounded-full bg-black/15" />
                  )}
                </div>
                <span
                  className={`text-xs transition-colors ${step.status === "done" ? "text-ink" : step.status === "active" ? "text-ink/80" : "text-ink/40"}`}
                >
                  {step.label}
                </span>
                {step.status === "done" && (
                  <span className="ml-auto text-[10px] text-ink/30">done</span>
                )}
              </div>
            ))}
          </div>

          {/* Live signal */}
          <div className="relative overflow-hidden rounded-xl bg-black/[0.03] px-4 py-3">
            <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-ink/30">
              Live signal
            </p>
            <p
              className="text-xs leading-relaxed text-ink/60 transition-opacity duration-200"
              style={{ opacity: fadeSignal ? 1 : 0 }}
            >
              {signal}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
