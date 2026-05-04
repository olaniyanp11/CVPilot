"use client";

import { useState } from "react";
import AnalyzingModal from "./AnalyzingModal";

export default function JobInput({
  initialValue = "",
  onSubmit,
  isSubmitting,
}: {
  initialValue?: string;
  onSubmit: (jobDescription: string) => void | Promise<void>;
  isSubmitting?: boolean;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <h1 className="font-[var(--font-syne)] text-2xl font-extrabold tracking-tight text-ink">
        Paste the job description
      </h1>
      <p className="mt-1 text-sm text-ink/70">
        We’ll score your resume, identify missing keywords, and generate an
        ATS-friendly rewrite.
      </p>

      <div className="mt-5 space-y-3">
        <label className="block text-sm font-semibold text-ink">
          Job description
        </label>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={10}
          className="w-full resize-y rounded-xl border border-black/10 bg-cream-100/30 p-3 text-sm text-ink outline-none focus:border-black/30"
          placeholder="Paste the full job post here…"
        />

        <button
          type="button"
          disabled={!!isSubmitting || !value.trim()}
          onClick={() => onSubmit(value)}
          className="inline-flex items-center justify-center rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-cream-100 shadow-sm hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Analyzing…" : "Analyze resume"}
        </button>
      </div>
      <AnalyzingModal open={!!isSubmitting} />
    </div>
  );
}

