// app/loading.tsx  ← Next.js picks this up automatically as the route loading UI
// OR use as a standalone component: components/LoadingPage.tsx

"use client";

import { useEffect, useState } from "react";

const TASKS = [
  "Parsing resume sections",
  "Matching against job description",
  "Calculating keyword coverage",
  "Scoring skills & experience",
  "Building optimized version",
];

const SUBTITLES = [
  "Scanning job requirements…",
  "Extracting keywords…",
  "Scoring your skills match…",
  "Identifying gaps…",
  "Rewriting for ATS…",
];

export default function Loading() {
  const [activeTask, setActiveTask] = useState(0);
  const [subtitleIdx, setSubtitleIdx] = useState(0);

  useEffect(() => {
    const taskTimer = setInterval(() => {
      setActiveTask((p) => (p < TASKS.length - 1 ? p + 1 : 0));
    }, 2200);

    const subtitleTimer = setInterval(() => {
      setSubtitleIdx((p) => (p + 1) % SUBTITLES.length);
    }, 3500);

    return () => {
      clearInterval(taskTimer);
      clearInterval(subtitleTimer);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      {/* Pulsing icon */}
      <div className="relative mb-8 h-14 w-14">
        <div className="absolute inset-0 animate-ping rounded-full border border-black/20" />
        <div className="absolute inset-0 rounded-full border border-black/10" />
        <div className="absolute inset-1 flex items-center justify-center overflow-hidden rounded-full bg-black/[0.04]">
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M4 7h14M4 11h10M4 15h6"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>

      {/* Title */}
      <p className="mb-2 text-[17px] font-semibold tracking-tight text-ink">
        Reading your resume
      </p>

      {/* Cycling subtitle */}
      <div className="mb-8 h-5 overflow-hidden">
        <p key={subtitleIdx} className="animate-fade-in-up text-sm text-ink/50">
          {SUBTITLES[subtitleIdx]}
        </p>
      </div>

      {/* Bouncing dots */}
      <div className="mb-10 flex gap-2">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </div>

      {/* Checklist card */}
      <div className="w-full max-w-xs rounded-2xl bg-black/[0.04] p-5 text-left">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-widest text-ink/30">
          What we're doing
        </p>
        <div className="flex flex-col gap-2">
          {TASKS.map((task, i) => {
            const done = i < activeTask;
            const current = i === activeTask;
            return (
              <div key={i} className="flex items-center gap-2.5">
                <div className="flex h-3.5 w-3.5 flex-shrink-0 items-center justify-center">
                  {done ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle
                        cx="7"
                        cy="7"
                        r="6"
                        className="stroke-black/10"
                        strokeWidth="0.5"
                        fill="white"
                      />
                      <path
                        d="M4.5 7.5l2 2 3-4"
                        stroke="currentColor"
                        strokeWidth="1.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : current ? (
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink" />
                  ) : (
                    <div className="h-1 w-1 rounded-full bg-black/15" />
                  )}
                </div>
                <span
                  className={`text-xs transition-colors ${
                    done ? "text-ink" : current ? "text-ink/70" : "text-ink/30"
                  }`}
                >
                  {task}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
