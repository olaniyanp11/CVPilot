"use client";

export default function ResumePreview({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-black/10 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <h3 className="font-[var(--font-syne)] text-lg font-extrabold text-ink">
          {title}
        </h3>
        <span className="text-xs text-ink/60">{text.length} chars</span>
      </div>
      <pre className="mt-3 max-h-[520px] overflow-auto whitespace-pre-wrap rounded-xl bg-cream-100/40 p-4 text-sm leading-relaxed text-ink">
        {text}
      </pre>
    </div>
  );
}

