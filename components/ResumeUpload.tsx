"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type UploadResponse =
  | {
      ok: true;
      resume: { filename: string; mimeType: string; text: string };
    }
  | { ok: false; error: string };

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes)) return "";
  const units = ["B", "KB", "MB", "GB"];
  let idx = 0;
  let n = bytes;
  while (n >= 1024 && idx < units.length - 1) {
    n /= 1024;
    idx += 1;
  }
  return `${n.toFixed(idx === 0 ? 0 : 1)} ${units[idx]}`;
}

export default function ResumeUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);

  const fileMeta = useMemo(() => {
    if (!file) return null;
    return { name: file.name, size: file.size, type: file.type };
  }, [file]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setExtractedText(null);

    if (!file) {
      setError("Please choose a PDF or DOCX file.");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = (await res.json()) as UploadResponse;
      if (!res.ok || !data.ok) {
        setError(!data.ok ? data.error : "Upload failed.");
        return;
      }

      setExtractedText(data.resume.text);
      sessionStorage.setItem("cvpilot.resumeText", data.resume.text);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <h1 className="font-[var(--font-syne)] text-2xl font-extrabold tracking-tight text-ink">
          Upload your resume
        </h1>
        <p className="mt-1 text-sm text-ink/70">
          Upload a PDF or DOCX. We’ll extract text for analysis in the next step.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div className="rounded-xl border border-dashed border-black/15 bg-cream-100/40 p-4">
            <label className="block text-sm font-semibold text-ink">
              Resume file (PDF/DOCX)
            </label>
            <input
              className="mt-2 block w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-ink file:px-4 file:py-2 file:text-cream-100 file:font-semibold hover:file:bg-ink/90"
              type="file"
              accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={(ev) => {
                const f = ev.target.files?.item(0) ?? null;
                setFile(f);
                setError(null);
                setExtractedText(null);
              }}
            />
            {fileMeta ? (
              <div className="mt-2 text-xs text-ink/70">
                <span className="font-semibold text-ink">Selected:</span>{" "}
                {fileMeta.name} · {formatBytes(fileMeta.size)}
                {fileMeta.type ? ` · ${fileMeta.type}` : null}
              </div>
            ) : null}
          </div>

          {error ? (
            <div className="rounded-xl border border-red-500/20 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isUploading}
            className="inline-flex items-center justify-center rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-cream-100 shadow-sm hover:bg-ink/90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isUploading ? "Uploading…" : "Extract text"}
          </button>
          {extractedText ? (
            <Link
              href="/analyze"
              className="ml-3 inline-flex items-center justify-center rounded-xl border border-black/10 bg-white px-5 py-2.5 text-sm font-semibold text-ink hover:border-black/25"
            >
              Continue →
            </Link>
          ) : null}
        </form>
      </div>

      <div className="mt-6 rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-[var(--font-syne)] text-lg font-extrabold text-ink">
            Extracted text
          </h2>
          <span className="text-xs text-ink/60">
            {extractedText ? `${extractedText.length} chars` : "—"}
          </span>
        </div>
        <div className="mt-3">
          {extractedText ? (
            <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded-xl bg-cream-100/40 p-4 text-sm leading-relaxed text-ink">
              {extractedText}
            </pre>
          ) : (
            <p className="text-sm text-ink/70">
              Upload a resume to see extracted text here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

